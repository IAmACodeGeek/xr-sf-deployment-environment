import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ThreeJSErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ThreeJS Error Boundary caught an error:', error, errorInfo);
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          color: '#fff',
          textAlign: 'center',
          padding: '20px',
          fontFamily: 'DM Sans, sans-serif'
        }}>
          {/* Animated background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 3s ease infinite',
            opacity: 0.3
          }} />
          
          {/* Main content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '32px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)',
            border: '1px solid rgba(255, 127, 50, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 127, 50, 0.1)',
            backdropFilter: 'blur(10px)',
            width: '90%',
            maxWidth: '600px'
          }}>
            {/* 3D Error Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4A90E2 0%, #7BB3F0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(74, 144, 226, 0.4)',
              animation: 'pulse 2s infinite'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1rem', 
              fontWeight: '700',
              fontFamily: 'DM Sans, sans-serif',
              background: 'linear-gradient(135deg, #4A90E2 0%, #7BB3F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              3D Experience Error
            </h1>
            
            <p style={{ 
              fontSize: '1.2rem', 
              maxWidth: '500px', 
              lineHeight: '1.6',
              marginBottom: '2rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: '400'
            }}>
              We're having trouble loading the 3D experience. This might be due to your device's graphics capabilities or a temporary issue.
            </p>
            
            <div style={{
              padding: '16px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(123, 179, 240, 0.05) 100%)',
              border: '1px solid rgba(74, 144, 226, 0.2)',
              marginBottom: '2rem'
            }}>
              <p style={{ 
                fontSize: '1rem', 
                opacity: 0.8,
                margin: 0,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: '500'
              }}>
                Technical Details: {this.state.error?.message || '3D rendering error'}
              </p>
            </div>
            
            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button style={{
                background: 'linear-gradient(135deg, #4A90E2 0%, #7BB3F0 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 32px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                textTransform: 'none',
                minWidth: '140px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.4)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
              }}
              onClick={() => window.location.reload()}
              >
                Reload Experience
              </button>
              
              <button style={{
                background: 'linear-gradient(135deg, #424147 0%, #5a5a5a 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 32px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(66, 65, 71, 0.3)',
                textTransform: 'none',
                minWidth: '140px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 6px 16px rgba(66, 65, 71, 0.4)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 12px rgba(66, 65, 71, 0.3)';
              }}
              onClick={() => {
                // Try to continue without 3D
                this.setState({ hasError: false });
              }}
              >
                Continue Without 3D
              </button>
            </div>
            
            {/* Helpful tips */}
            <div style={{
              marginTop: '2rem',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: '600'
              }}>
                💡 Tips to improve 3D performance:
              </h3>
              <ul style={{
                textAlign: 'left',
                margin: 0,
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                <li>Update your graphics drivers</li>
                <li>Close other applications using graphics</li>
                <li>Try a different browser (Chrome recommended)</li>
                <li>Check if hardware acceleration is enabled</li>
              </ul>
            </div>
          </div>
          
          {/* CSS Animations */}
          <style>{`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ThreeJSErrorBoundary; 