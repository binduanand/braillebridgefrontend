import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleStartConverting = () => {
    if (isLoggedIn) {
      navigate('/braille');
    } else {
      navigate('/signup');
    }
  };

  const features = [
    { icon: "📝", title: "Text to Braille", description: "Convert text documents to Braille instantly with high accuracy" },
    { icon: "🔊", title: "Speech to Braille ", description: "Transform text content into natural-sounding speech output" },
    { icon: "👤", title: "User Dashboard", description: "Manage your conversions, track history, and access your profile" },
    { icon: "⚡", title: "Lightning Fast", description: "Process your documents in seconds with our optimized engine" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Bridge the Gap with<br />
            <span style={styles.heroTitleGradient}>BrailleBridge</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Empowering accessibility through intelligent Braille conversion. Transform text documents into Braille and speech effortlessly.
          </p>
          <div style={styles.heroBtns}>
            <button onClick={handleStartConverting} style={styles.primaryBtn}>
              Start Converting →
            </button>
            <a href="#features" style={styles.secondaryBtn}>Learn More</a>
          </div>
        </div>

        <div style={styles.floatingCards}>
          <div style={{ ...styles.floatingCard, ...styles.floatingCard1 }}></div>
          <div style={{ ...styles.floatingCard, ...styles.floatingCard2 }}></div>
          <div style={{ ...styles.floatingCard, ...styles.floatingCard3 }}></div>
        </div>
      </div>

      
      <div id="features" style={styles.features}>
        <div style={styles.sectionContent}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Powerful Features</h2>
            <p style={styles.sectionSubtitle}>Everything you need for seamless Braille conversion</p>
          </div>

          <div style={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <div key={idx} style={styles.featureCard}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div id="about" style={styles.about}>
        <div style={styles.aboutContent}>
          <h2 style={styles.sectionTitle}>About BrailleBridge</h2>
          <p style={styles.aboutText}>
            BrailleBridge is a cutting-edge platform designed to make Braille content accessible to everyone.
            Our advanced conversion technology ensures accurate and fast transformation of text documents
            into Braille and speech, breaking down barriers and fostering inclusivity.
          </p>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>97%</div>
              <div style={styles.statLabel}>Accuracy</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Available</div>
            </div>
          </div>
        </div>
      </div>

      
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 BrailleBridge. Making accessibility universal.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  hero: { paddingTop: '8rem', textAlign: 'center', position: 'relative' },
  heroContent: { maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' },
  heroTitle: { fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '1.5rem' },
  heroTitleGradient: {
    background: 'linear-gradient(135deg, #c084fc 0%, #f9a8d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: { color: '#d1d5db', maxWidth: '800px', margin: '0 auto 2rem', lineHeight: '1.6' },
  heroBtns: { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' },
  primaryBtn: {
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    color: '#fff',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '1rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  floatingCards: { position: 'relative', height: '200px', marginTop: '3rem' },
  floatingCard: { position: 'absolute', borderRadius: '16px', backdropFilter: 'blur(10px)', animation: 'float 6s ease-in-out infinite' },
  floatingCard1: { width: '160px', height: '160px', backgroundColor: 'rgba(168,85,247,0.2)', left: '25%', top: 0 },
  floatingCard2: { width: '120px', height: '120px', backgroundColor: 'rgba(236,72,153,0.2)', right: '25%', top: '40px', animationDelay: '1s' },
  floatingCard3: { width: '140px', height: '140px', backgroundColor: 'rgba(59,130,246,0.2)', left: '33%', bottom: 0, animationDelay: '2s' },
  
  sectionContent: { maxWidth: '1280px', margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: '4rem' },
  sectionTitle: { fontSize: '2.5rem', fontWeight: 'bold' },
  sectionSubtitle: { fontSize: '1.25rem', color: '#d1d5db' },
  features: { paddingBottom: '5rem' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '2rem' },
  featureCard: { padding: '2rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
  featureIcon: {
    width: '100%',
    height: '64px',
    background: 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  about: { padding: '5rem 2rem', backgroundColor: 'rgba(0,0,0,0.2)' },
  aboutContent: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
  aboutText: { color: '#d1d5db', marginBottom: '3rem', lineHeight: '1.8' },
  stats: { display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' },
  stat: { textAlign: 'center' },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg,#c084fc 0%,#f9a8d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: { color: '#9ca3af' },
  footer: { padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' },
  footerText: { color: '#9ca3af' },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
`;
document.head.appendChild(styleSheet);
