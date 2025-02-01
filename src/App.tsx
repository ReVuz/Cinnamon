import React, { useState, useRef } from 'react';
import { Upload, Youtube, Music2, Download, Play, Pause, Guitar, Piano, Blinds as Violin, Loader2 } from 'lucide-react';

type ChordResult = {
  chord: string;
};

type InstrumentType = 'guitar' | 'piano' | 'violin';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ChordResult[]>([]);
  const [songTitle, setSongTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('guitar');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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
    } else {
      setError('Please upload a valid audio file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type.startsWith('audio/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid audio file');
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock results with more musical progression
      setResults([
        { chord: 'Am' },
        { chord: 'F' },
        { chord: 'C' },
        { chord: 'G' },
        { chord: 'Am' },
        { chord: 'Em' },
        { chord: 'F' },
        { chord: 'G' }
      ]);
      setSongTitle(file ? file.name : 'YouTube Video');
      
    } catch (err) {
      setError('Error analyzing the audio');
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const content = results
      .map(r => r.chord)
      .join(' - ');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songTitle}-chords.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
          <Music2 className="inline-block mr-2 mb-1" />
          Chord Detection
        </h1>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* File Upload */}
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
            {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
          </div>

          {/* YouTube URL */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="relative">
              <Youtube className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Paste YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Instrument Selection */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedInstrument('guitar')}
            className={`p-3 rounded-lg flex items-center ${
              selectedInstrument === 'guitar' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
            }`}
          >
            <Guitar className="mr-2" /> Guitar
          </button>
          <button
            onClick={() => setSelectedInstrument('piano')}
            className={`p-3 rounded-lg flex items-center ${
              selectedInstrument === 'piano' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
            }`}
          >
            <Piano className="mr-2" /> Piano
          </button>
          <button
            onClick={() => setSelectedInstrument('violin')}
            className={`p-3 rounded-lg flex items-center ${
              selectedInstrument === 'violin' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
            }`}
          >
            <Violin className="mr-2" /> Violin
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || (!file && !youtubeUrl)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2" />
                Analyzing...
              </span>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{songTitle}</h2>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="mr-2" /> Download Results
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>

            {/* Musical Staff Representation */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-wrap justify-center gap-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`
                      relative min-w-[60px] h-16 flex items-center justify-center
                      ${index % 4 === 0 ? 'border-l-2 border-gray-200' : ''}
                    `}
                  >
                    <div className="text-2xl font-serif text-indigo-700">
                      {result.chord}
                    </div>
                    {index < results.length - 1 && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-300">
                        |
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-center gap-2 text-sm text-gray-500">
                  <span>Time Signature: 4/4</span>
                  <span>•</span>
                  <span>Key: {results[0]?.chord.includes('m') ? 'Minor' : 'Major'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;