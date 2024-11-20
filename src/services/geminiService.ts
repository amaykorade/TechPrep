import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, FeedbackSummary } from '../types';

const API_KEY = 'AIzaSyBwRodsW-FzwVsPphilWppYqIlqKKo4Qc4';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateQuestions(
  technology: string,
  difficulty: string,
  count: number
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate exactly ${count} ${difficulty} level technical interview questions for ${technology}. Format each question as a numbered list starting with 1. and ending with ${count}. Make questions clear, specific, and appropriate for ${difficulty} level developers.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawQuestions = response.text();
    
    if (!rawQuestions) {
      throw new Error('No questions generated');
    }

    const questions = extractQuestions(rawQuestions);
    
    if (questions.length === 0) {
      throw new Error('Failed to parse questions from response');
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
}

export async function evaluateAnswer(question: string, answer: string): Promise<{
  feedback: string;
  score: number;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are an expert technical interviewer. Evaluate this answer for the technical interview question. 
    Provide constructive feedback and a score from 1-10.
    
    Question: ${question}
    Answer: ${answer}
    
    Format your response as:
    Score: [number]
    Feedback: [your feedback]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const evaluation = response.text();
    
    if (!evaluation) {
      throw new Error('No evaluation generated');
    }

    return parseEvaluation(evaluation);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw new Error('Failed to evaluate answer. Please try again.');
  }
}

export async function generateFeedbackSummary(questions: Question[]): Promise<FeedbackSummary> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const answeredQuestions = questions.filter(q => !q.skipped);
    const overallScore = Math.round((answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length) * 10) / 10;
    
    const prompt = `Based on these interview responses, provide a feedback summary:
    ${questions.map(q => `
      Q${q.id}: ${q.question}
      ${q.skipped ? 'SKIPPED' : `Answer: ${q.userAnswer || 'No answer provided'}`}
      ${q.score ? `Score: ${q.score}/10` : ''}
    `).join('\n')}

    Provide three specific areas for improvement and three learning resources.
    Format your response exactly like this example:
    AREAS_FOR_IMPROVEMENT
    1. [First improvement area]
    2. [Second improvement area]
    3. [Third improvement area]
    EFFECTIVENESS
    [number between 1-100]
    RESOURCES
    1. [Resource title] | [URL] | [Brief description]
    2. [Resource title] | [URL] | [Brief description]
    3. [Resource title] | [URL] | [Brief description]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    // Parse the structured response
    const areas = rawText.match(/AREAS_FOR_IMPROVEMENT\n((?:.*\n?){3})/);
    const effectiveness = rawText.match(/EFFECTIVENESS\n(\d+)/);
    const resources = rawText.match(/RESOURCES\n((?:.*\n?){3})/);

    const improvementAreas = areas?.[1].split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim()) || [];

    const recommendedResources = resources?.[1].split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [title, url, description] = line.replace(/^\d+\.\s*/, '').split('|').map(s => s.trim());
        return { title, url, description };
      }) || [];

    return {
      overallScore,
      improvementAreas,
      effectiveness: Number(effectiveness?.[1]) || 70,
      accuracy: Math.round(overallScore * 10),
      recommendedResources
    };
  } catch (error) {
    console.error('Error generating feedback summary:', error);
    throw new Error('Failed to generate feedback summary. Please try again.');
  }
}

function extractQuestions(rawText: string): string[] {
  const questions: string[] = [];
  const lines = rawText.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^\d+\.\s*(.+)/);
    if (match && match[1]) {
      const question = match[1].trim();
      if (question.length > 0) {
        questions.push(question);
      }
    }
  }

  return questions;
}

function parseEvaluation(rawText: string): { feedback: string; score: number } {
  const scoreMatch = rawText.match(/Score:\s*(\d+)/i);
  const feedbackMatch = rawText.match(/Feedback:\s*(.+)/is);
  
  const score = scoreMatch ? Math.min(Math.max(parseInt(scoreMatch[1], 10), 1), 10) : 5;
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No specific feedback provided.';
  
  return { feedback, score };
}