import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useInterval } from 'react-use';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  isRecording: boolean;
  onRecordingComplete: () => void;
  onToggleRecording: () => void;
}

export function VoiceRecorder({
  onTranscriptionComplete,
  isRecording,
  onRecordingComplete,
  onToggleRecording,
}: VoiceRecorderProps) {
  const [timeLeft, setTimeLeft] = useState(50);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        setError('Error occurred in recognition: ' + event.error);
      };

      setRecognition(recognition);
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useInterval(
    () => {
      if (timeLeft > 0) {
        setTimeLeft(t => t - 1);
      } else {
        handleStopRecording();
      }
    },
    isRecording ? 1000 : null
  );

  const handleStartRecording = useCallback(() => {
    if (recognition) {
      setTimeLeft(50);
      setTranscript('');
      setError(null);
      recognition.start();
      onToggleRecording();
    }
  }, [recognition, onToggleRecording]);

  const handleStopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      onToggleRecording();
      onTranscriptionComplete(transcript);
      onRecordingComplete();
    }
  }, [recognition, transcript, onTranscriptionComplete, onRecordingComplete, onToggleRecording]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center space-y-4"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={!recognition || error !== null}
          className={`p-4 rounded-full transition-all duration-300 ${
            isRecording
              ? 'bg-red-900/30 text-red-400 border border-red-500/30 hover:bg-red-900/50'
              : 'bg-blue-900/30 text-blue-400 border border-blue-500/30 hover:bg-blue-900/50'
          } ${(!recognition || error) && 'opacity-50 cursor-not-allowed'}`}
        >
          {isRecording ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
        
        {isRecording && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-900/30 rounded-full border border-blue-500/30">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-blue-400 font-medium">
              {timeLeft}s remaining
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg border border-red-500/30">
          {error}
        </div>
      )}

      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 bg-gray-900/50 rounded-lg border border-gray-700"
        >
          <h4 className="font-medium text-gray-300 mb-2">Transcription:</h4>
          <p className="text-gray-400">{transcript}</p>
        </motion.div>
      )}
    </motion.div>
  );
}