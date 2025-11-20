import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';



export default function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://braillebridgebackend-9zof.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Invalid credentials');

     
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));

      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)',
      color: '#fff',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    },
    background: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 0,
    },
    circle1: {
      position: 'absolute',
      width: '500px',
      height: '500px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)',
      top: '-250px',
      right: '-250px',
      animation: 'float 8s ease-in-out infinite',
    },
    circle2: {
      position: 'absolute',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0) 70%)',
      bottom: '-200px',
      left: '-200px',
      animation: 'float 10s ease-in-out infinite',
      animationDelay: '2s',
    },
    circle3: {
      position: 'absolute',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'float 12s ease-in-out infinite',
      animationDelay: '4s',
    },
    formContainer: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem 4rem',
      display: 'flex',
      gap: '3rem',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
    },
    formCard: {
      flex: '1 1 450px',
      maxWidth: '500px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '3rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #c084fc 0%, #f9a8d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    errorBox: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1.5rem',
      color: '#fca5a5',
    },
    input: {
      width: '90%',
      padding: '0.875rem 1rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      marginBottom: "1rem",
      marginTop: "1rem"
    },
    submitBtn: {
      padding: '1rem',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#fff',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '0.5rem',
    },
    footerLink: {
      color: '#c084fc',
      textDecoration: 'none',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>

      

      <div style={styles.formContainer}>
        <div style={styles.formCard}>
          <h1 style={styles.title}>Welcome Back</h1>
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don’t have an account?{' '}
            <Link to="/signup" style={styles.footerLink}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        input:focus {
          border-color: rgba(168, 85, 247, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1) !important;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4);
        }

        a:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
