import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TranscriptInput from './components/TranscriptInput';
import InstructionInput from './components/InstructionInput';
import SummaryOutput from './components/SummaryOutput';
import EmailShare from './components/EmailShare';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [instruction, setInstruction] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (content) => {
    setTranscript(content);
    setError('');
  };

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      setError('Please provide a transcript');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          instruction
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummaryEdit = (editedSummary) => {
    setSummary(editedSummary);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Meeting Notes Summarizer</h1>
        <p>Upload transcripts, customize instructions, and share AI-generated summaries</p>
      </header>

      <main className="app-main">
        <div className="input-section">
          <FileUpload onFileUpload={handleFileUpload} />
          <TranscriptInput 
            transcript={transcript} 
            onTranscriptChange={setTranscript} 
          />
          <InstructionInput 
            instruction={instruction} 
            onInstructionChange={setInstruction} 
          />
          
          <button 
            className="generate-btn"
            onClick={handleGenerateSummary}
            disabled={isLoading || !transcript.trim()}
          >
            {isLoading ? 'Generating Summary...' : 'Generate Summary'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        {summary && (
          <div className="output-section">
            <SummaryOutput 
              summary={summary} 
              onSummaryEdit={handleSummaryEdit} 
            />
            <EmailShare summary={summary} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;