import { useState } from 'react';

function SummaryOutput({ summary, onSummaryEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summary);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSummaryEdit(editedSummary);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSummary(summary);
    setIsEditing(false);
  };

  return (
    <div className="summary-output">
      <div className="summary-header">
        <h3>Generated Summary</h3>
        {!isEditing && (
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="summary-editor">
          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            rows={12}
            className="summary-textarea"
          />
          <div className="editor-actions">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="summary-content">
          {summary.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default SummaryOutput;