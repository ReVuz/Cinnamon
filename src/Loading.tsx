import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

type LoadingProps = {
  setResults: (results: { 
    chord: string;
    start_time: number;
    end_time: number;
  }[]) => void;
  setSongTitle: (title: string) => void;
  file: File | null;
  youtubeUrl?: string;
};

interface LocationState {
  type: 'file' | 'youtube';
  data: File | string;
}

const Loading: React.FC<LoadingProps> = ({ setResults, setSongTitle, file, youtubeUrl }) => {
  const [progress, setProgress] = useState(0);
  const [cursorPosition, setCursorPosition] = React.useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Add cursor effect
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const analyzeAudio = async () => {
      if (!state?.type || !state?.data) {
        setError('No file or URL provided');
        return;
      }

      // Slower progress animation for longer wait
      progressInterval = setInterval(() => {
        setProgress(prev => {
          // Slower progress that takes about 5 minutes to reach 90%
          const increment = 90 / (5 * 60); // 90% spread over 5 minutes
          return Math.min(prev + increment, 90);
        });
      }, 1000); // Update every second

      // Set 5-minute timeout
      timeoutId = setTimeout(() => {
        setError('Request timed out after 5 minutes. Please try again.');
        clearInterval(progressInterval);
      }, 5 * 60 * 1000);

      try {
        const formData = new FormData();
        const endpoint = state.type === 'youtube' ? 'process-youtube' : 'process-file';
        formData.append(state.type === 'youtube' ? 'url' : 'file', state.data);

        const response = await fetch(`http://localhost:8000/${endpoint}`, {
          method: 'POST',
          body: formData,
          
          
        });

        if (!response.ok) {
          throw new Error(`Failed to process ${state.type}`);
        }

        const data = await response.json();
        
        // Log the received data
        console.log('Received data:', data);

        // Add delay before checking data to ensure complete processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (data && Array.isArray(data.notes)) {
          clearTimeout(timeoutId);
          setResults(data.notes);
          setSongTitle(state.type === 'youtube' ? (data.title || 'YouTube Video') : (state.data as File).name);
          setProgress(100);
          setTimeout(() => navigate('/results'), 500);
        } else {
          throw new Error('No valid chord data received. Please try again.');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(
            err.name === 'TimeoutError' 
              ? 'Request timed out after 5 minutes. Please try again.'
              : err.message
          );
        } else {
          setError('An error occurred');
        }
        console.error('Error processing audio:', err);
      } finally {
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
      }
    };

    analyzeAudio();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
    };
  }, [state, navigate, setResults, setSongTitle]);

  // If there's an error, show it but don't redirect
  if (error) {
    return (
      <div className="relative min-h-screen animate-gradient overflow-hidden [cursor:none]">
        <div className="floating-shapes absolute inset-0 z-0" />
        <div className="relative z-10 h-screen flex items-center justify-center">
          <div className="text-center text-white bg-red-500/80 backdrop-blur-lg p-4 rounded-lg">
            <p>Error: {error}</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-4 px-4 py-2 bg-white text-red-500 rounded hover:bg-gray-100"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen animate-gradient overflow-hidden [cursor:none]">
      <div className="floating-shapes absolute inset-0 z-0" />
      
      {/* Custom cursor */}
      <div 
        className="pointer-events-none fixed w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mix-blend-multiply blur-sm transition-transform duration-200 ease-out z-50"
        style={{ 
          left: cursorPosition.x - 24,
          top: cursorPosition.y - 24,
          transform: 'translate(0, 0)',
        }}
      />
      
      <div className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader"></div>
          <div className="w-full bg-white/20 backdrop-blur-lg rounded-full h-2.5 mb-8">
            <div
              className="bg-white h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-white">Analyzing audio...</div>
        </div>
      </div>
    </div>
  );
};

export default Loading;