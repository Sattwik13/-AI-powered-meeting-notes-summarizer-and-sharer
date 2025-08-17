import { useState } from 'react';

function EmailShare({ summary }) {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('Meeting Summary');
  const [isSharing, setIsSharing] = useState(false);
  const [message, setMessage] = useState('');

  const handleShare = async () => {
    if (!emails.trim()) {
      setMessage('Please enter at least one email address');
      return;
    }

    const emailList = emails.split(',')
    .map(email => email.trim())
    .filter(email => email);
    
    if (emailList.length === 0) {
      setMessage('Please enter valid email addresses');
      return;
    }

    setIsSharing(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary,
          emails: emailList,
          subject
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share summary');
      }

      const data = await response.json();
      setMessage('Summary shared successfully!');
      setEmails('');
    } catch (error) {
      setMessage('Failed to share summary. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="email-share">
      <h3>Share Summary</h3>
      
      <div className="share-form">
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="subject-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="emails">Email addresses (comma-separated)</label>
          <textarea
            id="emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="john@example.com, jane@example.com"
            rows={3}
            className="emails-textarea"
          />
        </div>

        <button 
          className="share-btn"
          onClick={handleShare}
          disabled={isSharing}
        >
          {isSharing ? 'Sharing...' : 'Share via Email'}
        </button>

        {message && (
          <div className={`share-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailShare;