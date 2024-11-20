import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Question, FeedbackSummary } from '../types';

const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontFamily: 'Helvetica'
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20,
    textAlign: 'center'
  },
  section: { 
    marginBottom: 15 
  },
  heading: { 
    fontSize: 18, 
    marginBottom: 10,
    color: '#333'
  },
  text: { 
    fontSize: 12, 
    marginBottom: 5,
    lineHeight: 1.5
  },
  score: { 
    fontSize: 16, 
    marginBottom: 10,
    color: '#2563eb'
  }
});

const PerformanceReport = ({ questions, summary }: { 
  questions: Question[], 
  summary: FeedbackSummary 
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Interview Performance Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Overall Performance</Text>
        <Text style={styles.score}>Overall Score: {summary.overallScore}/10</Text>
        <Text style={styles.score}>Answer Effectiveness: {summary.effectiveness}%</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Areas for Improvement</Text>
        {summary.improvementAreas.map((area, index) => (
          <Text key={index} style={styles.text}>• {area}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Question Analysis</Text>
        {questions.map((q) => (
          <View key={q.id} style={styles.section}>
            <Text style={styles.text}>Question {q.id}: {q.question}</Text>
            {q.skipped ? (
              <Text style={styles.text}>Status: Skipped</Text>
            ) : (
              <>
                <Text style={styles.text}>Your Answer: {q.userAnswer}</Text>
                <Text style={styles.text}>Score: {q.score}/10</Text>
                <Text style={styles.text}>Feedback: {q.feedback}</Text>
              </>
            )}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const ResourcesDocument = ({ resources }: { 
  resources: FeedbackSummary['recommendedResources'] 
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Learning Resources</Text>
      
      {resources.map((resource, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.heading}>{resource.title}</Text>
          <Text style={styles.text}>{resource.description}</Text>
          <Text style={styles.text}>URL: {resource.url}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export const generatePDFReport = (questions: Question[], summary: FeedbackSummary) => (
  <PDFDownloadLink 
    document={<PerformanceReport questions={questions} summary={summary} />}
    fileName="interview-performance.pdf"
  >
    {({ loading }) => loading ? 'Generating PDF...' : 'Download Performance Report'}
  </PDFDownloadLink>
);

export const generateResourcesPDF = (resources: FeedbackSummary['recommendedResources']) => (
  <PDFDownloadLink 
    document={<ResourcesDocument resources={resources} />}
    fileName="learning-resources.pdf"
  >
    {({ loading }) => loading ? 'Generating PDF...' : 'Download Learning Resources'}
  </PDFDownloadLink>
);