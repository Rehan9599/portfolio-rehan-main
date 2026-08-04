import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';

export default function ContactSection({ personalInfo }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', message: '' });
        }, 4000);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send message. Please try again.';
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="app-container">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--surface-color)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-color)',
            borderRadius: '1.25rem',
            padding: '3rem',
            maxWidth: '750px',
            margin: '0 auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center', padding: '2rem 0' }}
            >
              <CheckCircle2 size={52} color="var(--primary-accent)" style={{ margin: '0 auto 1.25rem auto' }} />
              <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.6rem', fontWeight: 700 }}>Message Sent!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                Thank you for reaching out, Rehan will get back to you shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '0.65rem',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '0.95rem'
                }}>
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.55rem' }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.1rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(7, 10, 14, 0.75)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-accent)';
                    e.target.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.55rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.1rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(7, 10, 14, 0.75)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-accent)';
                    e.target.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.55rem' }}>
                  Message
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell me about your project or opportunity..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.1rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(7, 10, 14, 0.75)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-accent)';
                    e.target.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={sending}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  fontSize: '1.05rem', 
                  marginTop: '0.75rem',
                  opacity: sending ? 0.7 : 1,
                  cursor: sending ? 'wait' : 'pointer'
                }}
              >
                <Send size={18} /> {sending ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
      <Footer personalInfo={personalInfo} />
    </section>
  );
}
