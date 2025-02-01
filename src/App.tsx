import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AudioUpload from './AudioUpload';
import Loading from './Loading';
import Results from './Results';

type ChordResult = {
  chord: string;
};

type InstrumentType = 'guitar' | 'piano' | 'violin';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [results, setResults] = useState<ChordResult[]>([]);
  const [songTitle, setSongTitle] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('guitar');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AudioUpload setFile={setFile} setYoutubeUrl={setYoutubeUrl} setError={setError} />
          }
        />
        <Route
          path="/loading"
          element={
            <Loading
              setResults={setResults}
              setSongTitle={setSongTitle}
              file={file}
            />
          }
        />
        <Route
          path="/results"
          element={
            <Results
              results={results}
              songTitle={songTitle}
              selectedInstrument={selectedInstrument}
              setSelectedInstrument={setSelectedInstrument}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;