import React from 'react';
import { Download, Play, Pause, Guitar, Piano, Blinds as Violin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ResultsProps = {
  results: { chord: string }[];
  songTitle: string;
  selectedInstrument: 'guitar' | 'piano' | 'violin';
  setSelectedInstrument: (instrument: 'guitar' | 'piano' | 'violin') => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
};

const Results: React.FC<ResultsProps> = ({
  results,
  songTitle,
  selectedInstrument,
  setSelectedInstrument,
  isPlaying,
  setIsPlaying
}) => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const content = results.map(r => r.chord).join(' - ');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songTitle}-chords.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <button onClick={handleBack} className="absolute top-4 left-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Back
        </button>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{songTitle}</h2>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="mr-2" /> Download Results
          </button>
        </div>

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

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>

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
    </div>
  );
};

export default Results;