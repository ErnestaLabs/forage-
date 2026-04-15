'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

type SignupState = 'idle' | 'loading' | 'success' | 'error';
type TokenStatus = 'idle' | 'verifying' | 'valid' | 'invalid';

interface SignupResponse {
  success: boolean;
  message: string;
  isNewUser: boolean;
  userId: string;
  credits: number;
  apiKey: string;
}

const USE_CASES = [
  'B2B Lead Gen',
  'Competitor Intel',
  'Trading / Prediction Markets',
  'General Research',
  'Other'
];

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [apifyToken, setApifyToken] = useState('');
  const [useCase, setUseCase] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('idle');
  const [apifyUsername, setApifyUsername] = useState('');
  
  const [state, setState] = useState<SignupState>('idle');
  const [response, setResponse] = useState<SignupResponse | null>(null);
  const [error, setError] = useState('');

  // Debounced token verification
  const verifyToken = useCallback(async (token: string) => {
    if (!token || token.length < 10) {
      setTokenStatus('idle');
      return;
    }

    setTokenStatus('verifying');
    try {
      const res = await fetch('/api/verify-apify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apifyToken: token }),
      });
      const data = await res.json();
      
      if (data.valid) {
        setTokenStatus('valid');
        setApifyUsername(data.username);
      } else {
        setTokenStatus('invalid');
      }
    } catch (err) {
      setTokenStatus('invalid');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (apifyToken) verifyToken(apifyToken);
    }, 600);
    return () => clearTimeout(timer);
  }, [apifyToken, verifyToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (!apifyToken) {
      setError('Apify token is required');
      return;
    }
    if (!useCase) {
      setError('Please select a use case');
      return;
    }
    if (tokenStatus === 'invalid') {
      setError('Invalid Apify token');
      return;
    }

    setState('loading');
    setError('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, apifyToken, useCase }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setResponse(data);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  };

  const renderMessageWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <AnimatePresence mode="wait">
        {state === 'success' && response ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card"
            style={{ padding: 32 }}
          >
            {/* Success header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--success-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Check size={24} style={{ color: 'var(--success)' }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  margin: 0,
                }}>
                  {response.isNewUser ? "You're in!" : 'Welcome back!'}
                </h3>
                <div style={{
                  fontSize: 14,
                  color: 'var(--foreground-secondary)',
                  margin: 0,
                }}>
                  {renderMessageWithLinks(response.message)}
                </div>
              </div>
            </div>

            {/* Credit balance */}
            <div style={{
              padding: '16px 20px',
              background: 'var(--glass)',
              borderRadius: 12,
              border: '1px solid var(--border)',
              marginBottom: 20,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <span style={{ fontSize: 14, color: 'var(--foreground-secondary)' }}>
                  Available Credit
                </span>
                <span style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--success)',
                  letterSpacing: '-0.02em',
                }}>
                  ${response.credits.toFixed(2)}
                </span>
              </div>
              <p style={{
                fontSize: 11,
                color: 'var(--foreground-tertiary)',
                margin: 0,
                lineHeight: 1.4,
              }}>
                This credit is for Forage tools only, separate from Apify's platform credit.
              </p>
            </div>

             {/* Connect instructions */}
             <div style={{
               padding: 20,
               background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--cyan-dim) 100%)',
               borderRadius: 12,
               border: '1px solid var(--border)',
             }}>
               <h4 style={{
                 fontSize: 14,
                 fontWeight: 600,
                 color: 'var(--foreground)',
                 margin: '0 0 12px',
               }}>
                 Connect to Forage
               </h4>
               <div style={{
                 fontFamily: 'var(--font-mono)',
                 fontSize: 12,
                 color: 'var(--foreground-secondary)',
                 lineHeight: 1.8,
               }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: 'var(--foreground-muted)' }}>1. Get your Apify token</span>
                    <br />
                    <a 
                      href="https://console.apify.com/account#/integrations" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      Apify Account → Integrations
                    </a>
                  </div>
                 <div style={{ marginBottom: 8 }}>
                   <span style={{ color: 'var(--foreground-muted)' }}>2. Add MCP server to your client</span>
                   <br />
                   URL:{' '}
                   <code style={{ background: 'var(--background)', padding: '2px 4px', borderRadius: 4 }}>
                     https://ernesta-labs--forage.apify.actor/mcp
                   </code>
                   <br />
                   Set:{' '}
                   <code style={{ background: 'var(--background)', padding: '2px 4px', borderRadius: 4 }}>
                     APIFY_API_TOKEN=your_token
                   </code>
                 </div>
                 <div>
                   <span style={{ color: 'var(--foreground-muted)' }}>3. Start using tools</span>
                   <br />
                   Your $5 Forage credit is tracked by this email. Usage deducts from this balance.
                 </div>
               </div>
             </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Email field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground-secondary)' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={state === 'loading'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  fontSize: 14,
                  color: 'var(--foreground)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Apify Token field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground-secondary)' }}>
                  Apify API Token
                </label>
                <a 
                  href="https://console.apify.com/account#/integrations" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}
                >
                  Find your token →
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showToken ? "text" : "password"}
                  value={apifyToken}
                  onChange={(e) => setApifyToken(e.target.value)}
                  placeholder="Your Apify Token"
                  disabled={state === 'loading'}
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 16px',
                    background: 'var(--background-secondary)',
                    border: tokenStatus === 'invalid' ? '1px solid var(--error)' : 
                            tokenStatus === 'valid' ? '1px solid var(--success)' : 
                            '1px solid var(--border)',
                    borderRadius: 10,
                    fontSize: 14,
                    color: 'var(--foreground)',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--foreground-tertiary)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {/* Validation Indicator */}
                <div style={{ position: 'absolute', right: 44, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                   {tokenStatus === 'verifying' && <Loader2 size={16} className="spin" style={{ color: 'var(--foreground-muted)' }} />}
                   {tokenStatus === 'valid' && <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />}
                   {tokenStatus === 'invalid' && <AlertCircle size={16} style={{ color: 'var(--error)' }} />}
                </div>
              </div>
              {tokenStatus === 'valid' && (
                <span style={{ fontSize: 11, color: 'var(--success)', marginTop: 2 }}>
                  Connected as {apifyUsername}
                </span>
              )}
            </div>

            {/* Use case dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground-secondary)' }}>
                What will you use Forage for?
              </label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                disabled={state === 'loading'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  fontSize: 14,
                  color: 'var(--foreground)',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="" disabled>Select your primary use case</option>
                {USE_CASES.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={state === 'loading' || tokenStatus === 'verifying'}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn btn-primary"
              style={{
                marginTop: 8,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                opacity: (state === 'loading' || tokenStatus === 'verifying') ? 0.7 : 1,
                cursor: (state === 'loading' || tokenStatus === 'verifying') ? 'not-allowed' : 'pointer',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {state === 'loading' ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Creating...
                </>
              ) : (
                <>
                  Start Free
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 8,
                  }}
                >
                  <AlertCircle size={16} style={{ color: 'var(--error)' }} />
                  <span style={{ fontSize: 13, color: 'var(--error)' }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p style={{
              fontSize: 12,
              color: 'var(--foreground-tertiary)',
              margin: 0,
              textAlign: 'center',
            }}>
               No credit card required · $5.00 credit included · Cancel anytime
            </p>
          </motion.form>
        )}
      </AnimatePresence>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
