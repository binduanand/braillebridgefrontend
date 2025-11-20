import { useState } from 'react';

export default function Braille() {
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [convertedText, setConvertedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setConvertedText('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in first.');
        setLoading(false);
        return;
      }

      
      if (activeTab === 'text') {
        if (!inputText.trim()) {
          setError('Please enter some text to convert');
          setLoading(false);
          return;
        }

        const blob = new Blob([inputText], { type: 'text/plain' });
        const pseudoFile = new File([blob], 'input.txt', { type: 'text/plain' });
        const formData = new FormData();
        formData.append('file', pseudoFile);

        const uploadRes = await fetch('https://braillebridgebackend-9zof.onrender.com/api/files/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const text = await uploadRes.text();
        console.log('Upload (text) raw response:', text);

        let uploaded = null;
        try {
          uploaded = JSON.parse(text);
        } catch {
          throw new Error('Upload failed — invalid or empty response');
        }

        if (!uploadRes.ok || !uploaded?._id) {
          throw new Error(uploaded?.message || 'Upload failed');
        }

        const convertRes = await fetch(
          `https://braillebridgebackend-9zof.onrender.com/api/convert/braille/${uploaded._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const convertText = await convertRes.text();
        console.log('Convert (text) raw response:', convertText);

        let convertData = null;
        try {
          convertData = JSON.parse(convertText);
        } catch {
          throw new Error('Conversion failed — invalid or empty response');
        }

        if (!convertRes.ok) throw new Error(convertData.message || 'Conversion failed');

        setConvertedText(convertData.unicodeText || convertData.g2Text || '');
      }

      
      else {
        if (!uploadedFile) {
          setError('Please upload a file');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile);

        const uploadRes = await fetch('https://braillebridgebackend-9zof.onrender.com/api/files/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        console.log('Upload response status:', uploadRes.status);

        const text = await uploadRes.text();
        console.log('Upload (file) raw response:', text);

        let uploaded = null;
        try {
          uploaded = JSON.parse(text);
        } catch {
          throw new Error('Upload failed — no JSON returned');
        }

        if (!uploadRes.ok || !uploaded?._id) {
          throw new Error(uploaded?.message || 'Upload failed');
        }

        const convertRes = await fetch(
          `https://braillebridgebackend-9zof.onrender.com/api/convert/braille/${uploaded._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const convertText = await convertRes.text();
        console.log('Convert (file) raw response:', convertText);

        let convertData = null;
        try {
          convertData = JSON.parse(convertText);
        } catch {
          throw new Error('Conversion failed — invalid or empty response');
        }

        if (!convertRes.ok) throw new Error(convertData.message || 'Conversion failed');

        setConvertedText(convertData.unicodeText || convertData.g2Text || '');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText);
  };

  const handleDownload = () => {
    const blob = new Blob([convertedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-braille.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInputText('');
    setUploadedFile(null);
    setConvertedText('');
    setError('');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: window.innerWidth <= 768 ? '1.5rem 1rem' : '3rem 2rem',
    },
    content: {
      marginTop: '80px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    titleSection: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #c084fc 0%, #f9a8d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      color: '#d1d5db',
      fontSize: '1.1rem',
    },
    tabContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '0.875rem 2rem',
      borderRadius: '12px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#d1d5db',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
    },
    tabActive: {
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#fff',
    },
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
    inputGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.75rem',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#e5e7eb',
    },
    textarea: {
      width: '80%',
      minHeight: '200px',
      padding: '1rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    fileUploadArea: {
      border: '2px dashed rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '3rem 2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    fileUploadAreaActive: {
      borderColor: '#a855f7',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
    },
    fileIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    fileInput: {
      display: 'none',
    },
    fileInfo: {
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    button: {
      padding: '1rem 2rem',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#fff',
      fontSize: '1.05rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    buttonSecondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    outputSection: {
      marginTop: '2rem',
    },
    outputLabel: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      display: 'block',
    },
    outputBox: {
      minHeight: '200px',
      padding: '1.5rem',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#e5e7eb',
      fontSize: '1.1rem',
      lineHeight: '1.8',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    actionButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
    },
    iconButton: {
      padding: '0.75rem 1.25rem',
      borderRadius: '8px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Text to Braille Converter</h1>
          <p style={styles.subtitle}>Upload a file or paste text to convert Text to Braille</p>
        </div>

        <div style={styles.tabContainer}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'text' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('text')}
          >
            📝 Paste Text
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'file' ? styles.tabActive : {}) }}
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
            <div style={styles.inputGroup}>
              <label style={styles.label}>Enter Text</label>
              <textarea
                style={styles.textarea}
                placeholder="Paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
              />
            </div>
          ) : (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Upload File</label>
              <div
                style={{
                  ...styles.fileUploadArea,
                  ...(uploadedFile ? styles.fileUploadAreaActive : {}),
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div style={styles.fileIcon}>📄</div>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                  {uploadedFile ? 'File Selected' : 'Click to upload'}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                  Supported formats: TXT, PDF, DOCX (Max 10MB)
                </div>
                <input
                  id="fileInput"
                  type="file"
                  style={styles.fileInput}
                  accept=".txt,.brf,.brl"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
              </div>
              {uploadedFile && (
                <div style={styles.fileInfo}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{uploadedFile.name}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  <button
                    style={{ ...styles.iconButton, padding: '0.5rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.buttonSecondary }}
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onClick={handleConvert}
              disabled={loading}
            >
              {loading ? '⏳ Converting...' : '✨ Convert to Braille'}
            </button>
          </div>
        </div>

        {convertedText && (
          <div style={styles.card}>
            <div style={styles.outputSection}>
              <label style={styles.outputLabel}>Converted Text</label>
              <div style={styles.outputBox}>
                {convertedText || 'Your converted text will appear here...'}
              </div>
              <div style={styles.actionButtons}>
                <button style={styles.iconButton} onClick={handleCopy}>
                  📋 Copy
                </button>
                <button style={styles.iconButton} onClick={handleDownload}>
                  ⬇️ Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        textarea:focus {
          border-color: rgba(168, 85, 247, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
