import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type LoadingProps = {
  setResults: (results: { chord: string }[]) => void;
  setSongTitle: (title: string) => void;
  file: File | null;
};

const Loading: React.FC<LoadingProps> = ({ setResults, setSongTitle, file }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    const analyzeAudio = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
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
      clearInterval(progressInterval);
      setProgress(100);
      navigate('/results');
    };

    analyzeAudio();

    return () => clearInterval(progressInterval);
  }, [file, navigate, setResults, setSongTitle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="animate-spin text-indigo-600 mr-2" />
          <h2 className="text-2xl font-semibold text-indigo-900">Analyzing...</h2>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;