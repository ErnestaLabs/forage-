'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';

type SignupState = 'idle' | 'loading' | 'success' | 'error';

interface SignupResponse {
  success: boolean;
  message: string;
  isNewUser: boolean;
  userId: string;
  credits: number;
  apiKey: string;
}

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SignupState>('idle');
  const [response, setResponse] = useState<SignupResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setState('loading');
    setError('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

  // Helper to render URLs as clickable links
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
                    {' (or '}
                    <a 
                      href="https://console.apify.com/sign-up" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      sign up
                    </a>
                    {' if new)'}
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
            style={{ width: '100%' }}
          >
            <div style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={state === 'loading'}
                style={{
                  flex: '1 1 240px',
                  padding: '16px 20px',
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  fontSize: 15,
                  color: 'var(--foreground)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />
              <motion.button
                type="submit"
                disabled={state === 'loading'}
                whileHover={{ scale: state === 'loading' ? 1 : 1.02 }}
                whileTap={{ scale: state === 'loading' ? 1 : 0.98 }}
                className="btn btn-primary"
                style={{
                  padding: '16px 28px',
                  fontSize: 15,
                  fontWeight: 600,
                  opacity: state === 'loading' ? 0.7 : 1,
                  cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                }}
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Creating...
                  </>
                ) : (
                  <>
                    Start Free
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </div>

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
                    marginTop: 12,
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
              fontSize: 13,
              color: 'var(--foreground-tertiary)',
              margin: '16px 0 0',
              textAlign: 'center',
            }}>
               No credit card required · $5.00 credit included · Cancel anytime
            </p>
          </motion.form>
        )}
      </AnimatePresence>

    </div>
  );
}
