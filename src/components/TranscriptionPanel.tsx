import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, FileAudio, Check, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { transcribeAudio, synthesizeSpeech } from '../utils/deepgramService';

const TEMPLATE_OPTIONS = [
  { id: 'soap', label: 'SOAP Note' },
  { id: 'progress', label: 'Progress Note' },
  { id: 'discharge', label: 'Discharge Summary' },
  { id: 'consultation', label: 'Consultation Note' }
];

export default function TranscriptionPanel() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('soap');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { 
    isPlaying, 
    togglePlay, 
    setAudioUrl 
  } = useAudioPlayer();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await handleTranscription(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    try {
      const text = await transcribeAudio(audioBlob);
      setTranscription(text);
      
      // Simulate AI response - replace with your actual AI integration
      const response = `Based on the ${selectedTemplate} template, here's my analysis of your recording...`;
      setAiResponse(response);
      
      // Convert AI response to speech
      const audioUrl = await synthesizeSpeech(response);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Medical Transcription</h2>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TEMPLATE_OPTIONS.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileAudio className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Your Speech</span>
                {transcription && <Check className="w-4 h-4 text-green-500" />}
              </div>
              <textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Transcription will appear here..."
              />
            </div>

            {aiResponse && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">AI Response</span>
                  </div>
                  <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Play className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{aiResponse}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}