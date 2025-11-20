import { useState, useRef } from 'react';

export default function TextToSpeechPage() {
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  const token = localStorage.getItem('token');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
      setError('');
    }
  };

  const handleConvert = async () => {
    setError('');
    setLoading(true);
    setAudioUrl('');

    try {
      if (!token) {
        setError('Please log in first.');
        setLoading(false);
        return;
      }

      let response;

      if (activeTab === 'text') {
        if (!inputText.trim()) {
          setError('Please enter some text to convert.');
          setLoading(false);
          return;
        }

        const blob = new Blob([inputText], { type: 'text/plain' });
        const pseudoFile = new File([blob], 'input.txt', { type: 'text/plain' });
        const formData = new FormData();
        formData.append('file', pseudoFile);

        const uploadRes = await fetch(
          `https://braillebridgebackend-9zof.onrender.com/api/files/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const uploadText = await uploadRes.text();
        let uploaded;
        try {
          uploaded = JSON.parse(uploadText);
        } catch {
          throw new Error('File upload returned invalid JSON.');
        }

        if (!uploadRes.ok || !uploaded?._id) {
          throw new Error(uploaded?.message || 'File upload failed.');
        }

        response = await fetch(
          `https://braillebridgebackend-9zof.onrender.com/api/convert/tts/${uploaded._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        if (!uploadedFile) {
          setError('Please upload a file.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile);

        const uploadRes = await fetch(
          `https://braillebridgebackend-9zof.onrender.com/api/files/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const uploadText = await uploadRes.text();
        let uploaded;
        try {
          uploaded = JSON.parse(uploadText);
        } catch {
          throw new Error('File upload returned invalid JSON.');
        }

        if (!uploadRes.ok || !uploaded?._id) {
          throw new Error(uploaded?.message || 'File upload failed.');
        }

        response = await fetch(
          `https://braillebridgebackend-9zof.onrender.com/api/convert/tts/${uploaded._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const convertText = await response.text();
      let data;
      try {
        data = JSON.parse(convertText);
      } catch {
        throw new Error('Server did not return valid JSON.');
      }

      if (!response.ok) throw new Error(data.message || 'Conversion failed.');

      const url = data.audioUrl || data.url || data.tts_url;
      if (!url) throw new Error('No audio URL returned from server.');

      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

 

  const handleReset = () => {
    setInputText('');
    setUploadedFile(null);
    setAudioUrl('');
    setError('');
  };

  
  const handleDownload = async () => {
    if (!audioUrl) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'speech.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download audio.');
    }
  };



  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)',
      color: '#fff',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: window.innerWidth <= 768 ? '1.5rem 1rem' : '3rem 2rem',
    },
    content: { marginTop: '80px', maxWidth: '1200px', margin: '0 auto' },
    titleSection: { textAlign: 'center', marginBottom: '2rem' },
    title: {
      fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #c084fc 0%, #f9a8d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: { color: '#d1d5db', fontSize: '1.1rem' },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: window.innerWidth <= 768 ? '1.5rem' : '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '2rem',
    },
    errorBox: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#fca5a5',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Text to Speech Converter</h1>
          <p style={styles.subtitle}>Upload a file or paste text to convert into speech</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '12px',
              background: activeTab === 'text' ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => setActiveTab('text')}
          >
            📝 Paste Text
          </button>
          <button
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '12px',
              background: activeTab === 'file' ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => setActiveTab('file')}
          >
            📁 Upload File
          </button>
        </div>

     
        <div style={styles.card}>
          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'text' ? (
            <textarea
              style={{
                width: '80%',
                minHeight: '200px',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
              }}
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
          ) : (
            <div
              style={{
                border: '2px dashed rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div style={{ fontSize: '2rem' }}>📄</div>
              <div>{uploadedFile ? 'File Selected' : 'Click to Upload File'}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                Supported formats: TXT, PDF, DOCX (Max 10MB)
              </div>
              <input
                id="fileInput"
                type="file"
                accept=".txt,.pdf,.docx"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={loading}
              />
              {uploadedFile && <p>Uploaded: {uploadedFile.name}</p>}
            </div>
          )}

          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1.5rem', color: '#fff' }}
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
            <button
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                borderRadius: '10px',
                padding: '0.75rem 1.5rem',
                color: '#fff',
              }}
              onClick={handleConvert}
              disabled={loading}
            >
              {loading ? '⏳ Converting...' : '🎧 Convert to Speech'}
            </button>
          </div>
        </div>

        
        {audioUrl && (
          <div style={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <h3>Your Audio is Ready!</h3>
              <div style={{ marginTop: '1rem' }}>
                <button onClick={handleDownload} style={{ marginRight: '1rem' }}>
                  ⬇️ Download MP3
                </button>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                style={{ marginTop: '1rem', width: '100%' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
