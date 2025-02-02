import React from 'react';
import { Download, Play, Pause, Blinds as Violin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ResultsProps = {
  results: { 
    chord: string;
    start_time: number;
    end_time: number;
  }[];
  songTitle: string;
  selectedInstrument: 'flute';
  setSelectedInstrument: (instrument: 'flute') => void;
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
  const [cursorPosition, setCursorPosition] = React.useState({ x: 0, y: 0 });

  // Add cursor effect
  React.useEffect(() => { 
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDownload = () => {
    const content = results.join(' - ');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songTitle}-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    navigate('/');
  };

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

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <button 
            onClick={handleBack} 
            className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Back
          </button>
          
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">{songTitle}</h2>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Download className="mr-2" /> Download Results
              </button>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setSelectedInstrument('flute')}
                className={`p-3 rounded-lg flex items-center transition-all duration-300 hover:scale-105 ${
                  selectedInstrument === 'flute' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                <Violin className="mr-2" /> Flute
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg transition-all duration-300 hover:scale-110"
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>

            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex flex-wrap justify-center gap-4">
                {results.map((note, index) => (
                  <div
                    key={index}
                    className={`
                      relative min-w-[100px] h-16 flex items-center justify-center
                      transform transition-all duration-300 hover:scale-105
                      ${index % 4 === 0 ? 'border-l-2 border-gray-200' : ''}
                    `}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-serif bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {note}
                      </div>
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
                  <span>Key: {results[0]?.includes('m') ? 'Minor' : 'Major'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these styles to your global CSS or create a new style tag
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient {
    background: linear-gradient(
      -45deg,
      #ee7752,
      #e73c7e,
      #23a6d5,
      #23d5ab
    );
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .floating-shapes::before,
  .floating-shapes::after {
    content: '';
    position: fixed;
    width: 60vmax;
    height: 60vmax;
    border-radius: 47% 53% 61% 39% / 45% 51% 49% 55%;
    background-color: rgba(255, 255, 255, 0.07);
    animation: rotate 20s infinite linear;
    z-index: 1;
  }

  .floating-shapes::after {
    width: 40vmax;
    height: 40vmax;
    background-color: rgba(255, 255, 255, 0.05);
    animation: rotate 30s infinite linear reverse;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg) translateX(100px);
    }
    to {
      transform: rotate(360deg) translateX(100px);
    }
  }
`;

// Add style tag to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Results;