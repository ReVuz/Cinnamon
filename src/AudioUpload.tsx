import React, { useState, useRef } from 'react';
import { Upload, Youtube, Music2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AudioUploadProps = {
  setFile: (file: File | null) => void;
  setYoutubeUrl: (url: string) => void;
  setError: (error: string) => void;
};

const AudioUpload: React.FC<AudioUploadProps> = ({ setFile, setYoutubeUrl, setError }) => {
  const [youtubeUrl, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-500');
    }
  };

  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleDragLeave();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith('audio/')) {
      setFile(droppedFile);
      setError('');
      navigate('/loading');
    } else {
      setError('Please upload a valid audio file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type.startsWith('audio/')) {
      setFile(selectedFile);
      setError('');
      navigate('/loading');
    } else {
      setError('Please upload a valid audio file');
    }
  };

  const handleAnalyze = () => {
    if (youtubeUrl) {
      setYoutubeUrl(youtubeUrl);
      navigate('/loading');
    } else {
      setError('Please provide a YouTube URL or upload an audio file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
          <Music2 className="inline-block mr-2 mb-1" />
          Chord Detection
        </h1>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
          >
            <Upload className="mx-auto mb-4 text-gray-400" />
            <p className="mb-2 text-gray-600">Drag and drop your audio file here</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Choose File
            </button>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="relative">
              <Youtube className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Paste YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleAnalyze}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioUpload;