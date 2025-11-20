import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import Braille from './Braille';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Speech from './Speech';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>BB</div>
            <span style={styles.logoText}>BrailleBridge</span>
          </Link>

         
          {!isMobile && (
            <div style={styles.desktopMenu}>
              <button
                onClick={() => handleProtectedRoute('/braille')}
                style={styles.navButton}
              >
                To Braille
              </button>
              <button
                onClick={() => handleProtectedRoute('/speech')}
                style={styles.navButton}
              >
                To Speech
              </button>

              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" style={styles.navLink}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.navLink}>
                    Sign In
                  </Link>
                  <Link to="/signup" style={styles.getStartedBtn}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}

         
          {isMobile && (
            <button
              style={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>

        
        {isMobile && mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            <button
              onClick={() => {
                handleProtectedRoute('/braille');
                setMobileMenuOpen(false);
              }}
              style={styles.mobileLink}
            >
              To Braille
            </button>
            <button
              onClick={() => {
                handleProtectedRoute('/speech');
                setMobileMenuOpen(false);
              }}
              style={styles.mobileLink}
            >
              To Speech
            </button>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  style={styles.mobileLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  style={styles.mobileLink}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={styles.mobileLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  style={styles.mobileLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      
      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/braille" element={<Braille />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/speech" element={<Speech />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)',
    color: '#fff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  nav: {
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    padding: '1rem 0',
    backgroundColor: 'rgb(15, 23, 42)',
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: '#fff',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.25rem',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  navLink: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  },
  navButton: {
    color: '#d1d5db',
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  getStartedBtn: {
    padding: '0.5rem 1.5rem',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'transform 0.3s ease',
  },
  logoutBtn: {
    padding: '0.5rem 1.2rem',
    background: 'rgba(239, 68, 68, 0.9)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  mobileMenuBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.8rem',
    cursor: 'pointer',
    padding: '0.25rem',
    lineHeight: 1,
  },
  mobileMenu: {
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    backdropFilter: 'blur(10px)',
    padding: '1rem 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  mobileLink: {
    color: '#d1d5db',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    padding: '0.75rem 2rem',
    width: '100%',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  content: {
    paddingTop: '80px',
  },
};
