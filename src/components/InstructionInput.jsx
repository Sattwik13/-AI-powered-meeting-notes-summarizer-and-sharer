
function InstructionInput({ instruction, onInstructionChange }) {
  const presetInstructions = [
    "Summarize in bullet points for executives",
    "Highlight only action items and next steps",
    "Create a detailed meeting recap with key decisions",
    "Extract and list all tasks and assignments",
    "Summarize key discussion points and outcomes"
  ];

  return (
    <div className="instruction-input">
      <h3>3. Custom Instructions</h3>
      <textarea
        value={instruction}
        onChange={(e) => onInstructionChange(e.target.value)}
        placeholder="Enter custom instructions for the AI summary (optional)..."
        rows={3}
        className="instruction-textarea"
      />
      
      <div className="preset-instructions">
        <p>Suggestions:</p>
        <div className="preset-buttons">
          {presetInstructions.map((preset, index) => (
            <button
              key={index}
              className="preset-btn"
              onClick={() => onInstructionChange(preset)}
              type="button"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructionInput;