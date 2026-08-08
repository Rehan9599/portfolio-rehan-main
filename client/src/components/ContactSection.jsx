import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Footer from './Footer';
import { Input } from '../ui/components/input/input';
import { Textarea } from '../ui/components/textarea/textarea';
import API from '../api';

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
      const response = await API.post('/api/contact', formData);
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
          className="contact-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="contact-success"
            >
              <CheckCircle2 size={52} color="var(--accent)" />
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out, Rehan will get back to you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              {error && (
                <div className="contact-error">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <Input
                label="Name"
                type="text"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Input
                label="Email"
                type="email"
                required
                placeholder="your.email@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Textarea
                label="Message"
                rows={4}
                required
                placeholder="Tell me about your project or opportunity..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />

              <button type="submit" className="btn btn-primary contact-submit" disabled={sending}>
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