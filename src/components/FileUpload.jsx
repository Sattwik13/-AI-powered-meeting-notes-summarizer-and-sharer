import { useRef } from 'react';

function FileUpload({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      alert('Please upload a text file (.txt)');
      return;
    }

    const formData = new FormData();
    formData.append('transcript', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      onFileUpload(data.content);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <h3>1. Upload Transcript</h3>
      <div className="upload-area" onClick={handleClick}>
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <p>Click to upload transcript file</p>
          <span className="file-types">Supported: .txt files</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default FileUpload;