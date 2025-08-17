
function TranscriptInput({ transcript, onTranscriptChange }) {
  return (
    <div className="transcript-input">
      <h3>2. Meeting Transcript</h3>
      <textarea
        value={transcript}
        onChange={(e) => onTranscriptChange(e.target.value)}
        placeholder="Paste your meeting transcript here or upload a file above..."
        rows={8}
        className="transcript-textarea"
      />
    </div>
  );
}

export default TranscriptInput;