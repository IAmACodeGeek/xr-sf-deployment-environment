import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(90deg, #fff1ec, #f8ddddd)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          color: '#000',
          textAlign: 'center',
          padding: '20px',
          fontFamily: 'DM Sans, sans-serif'
        }}>
          {/* Main content container */}
          <div style={{
            padding: '60px 40px',
            borderRadius: '24px',
            background: 'linear-gradient(90deg, #fff1ec 0%, #f8dddd 100%)',
            border: '1px solid rgba(222, 59, 28, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            width: '80vw',
            height: '45vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            {/* Main error message */}
            <h1 style={{ 
              fontSize: '3.5rem', 
              marginBottom: '3rem', 
              fontWeight: '600',
              fontFamily: 'DM Sans, sans-serif',
              color: '#000',
              lineHeight: '1.3',
              textAlign: 'center'
            }}>
              Sorry, this store is currently unavailable.
            </h1>
            
            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}>
              <button style={{
                background: '#DE3B1C',
                border: 'none',
                borderRadius: '16px',
                padding: '20px 48px',
                color: 'white',
                fontSize: '1.4rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(222, 59, 28, 0.3)',
                textTransform: 'none',
                minWidth: '220px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 6px 16px rgba(222, 59, 28, 0.4)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 12px rgba(222, 59, 28, 0.3)';
              }}
              onClick={() => {
                const domainExtension = window.location.hostname.includes('shackit.in') ? 'in' : 'com';
                window.location.href = `https://dashboard.shackit.${domainExtension}/auth`;
              }}
              >
                Store Owners Login
              </button>
              
              <button style={{
                background: 'transparent',
                border: '2px solid #DE3B1C',
                borderRadius: '16px',
                padding: '18px 48px',
                color: '#DE3B1C',
                fontSize: '1.4rem',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'none',
                minWidth: '220px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.background = '#DE3B1C';
                target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.background = 'transparent';
                target.style.color = '#DE3B1C';
              }}
              onClick={() => {
                const domainExtension = window.location.hostname.includes('shackit.in') ? 'in' : 'com';
                window.location.href = `https://dashboard.shackit.${domainExtension}/register`;
              }}
              >
                Start a free trial
              </button>
            </div>
            
            {/* Support link */}
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666',
              margin: 0,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: '400'
            }}>
              Need help? <span 
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => {
                  const domainExtension = window.location.hostname.includes('shackit.in') ? 'in' : 'com';
                  const contactUrl = `https://www.shackit.${domainExtension}/#sec-contact`;
                  window.open(contactUrl, '_blank');
                }}
              >
                Contact Support
              </span>
            </p>
          </div>
          
          {/* Logo */}
          <div style={{
            position: 'absolute',
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <img 
              src="/shackit-blk.png" 
              alt="Shackit Logo" 
              style={{
                height: '60px',
                width: 'auto'
              }}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 