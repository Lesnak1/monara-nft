'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  MessageSquare, 
  Github, 
  Twitter, 
  Send, 
  CheckCircle2,
  AlertCircle,
  Globe,
  FileText,
  Zap,
  Users
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Have questions about MONARA? We're here to help with your evolving digital beings.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-white/70 leading-relaxed mb-8">
                Reach out to our team for support, partnerships, or general inquiries about the MONARA ecosystem.
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Support</h3>
                    <p className="text-white/60 text-sm">General inquiries and support</p>
                  </div>
                </div>
                <a 
                  href="mailto:support@monara.xyz" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  support@monara.xyz
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Community Discord</h3>
                    <p className="text-white/60 text-sm">Join our community</p>
                  </div>
                </div>
                <a 
                  href="https://discord.gg/monad" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Join Discord Server
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gray-500/20 rounded-xl">
                    <Github className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">GitHub Issues</h3>
                    <p className="text-white/60 text-sm">Technical support and bugs</p>
                  </div>
                </div>
                <a 
                  href="https://github.com/leknax/monara" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors font-medium"
                >
                  Report an Issue
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-cyan-500/20 rounded-xl">
                    <Twitter className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Follow Updates</h3>
                    <p className="text-white/60 text-sm">Latest news and announcements</p>
                  </div>
                </div>
                <a 
                  href="https://twitter.com/monad_xyz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  @monad_xyz
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/terms" className="flex items-center text-white/70 hover:text-white transition-colors">
                  <FileText className="w-4 h-4 mr-3" />
                  Terms of Service
                </Link>
                <Link href="/privacy" className="flex items-center text-white/70 hover:text-white transition-colors">
                  <FileText className="w-4 h-4 mr-3" />
                  Privacy Policy
                </Link>
                <a 
                  href="https://monad.xyz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4 mr-3" />
                  Monad Network
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/70">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="general" className="bg-gray-900">General Inquiry</option>
                      <option value="support" className="bg-gray-900">Technical Support</option>
                      <option value="partnership" className="bg-gray-900">Partnership</option>
                      <option value="press" className="bg-gray-900">Press & Media</option>
                      <option value="bug" className="bg-gray-900">Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-white/80">
                        <p className="font-medium text-white mb-1">Response Time</p>
                        <p>We typically respond within 24 hours during business days. For urgent technical issues, please use our Discord community for faster support.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-white/70">Quick answers to common questions about MONARA</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                What is MONARA?
              </h3>
              <p className="text-white/70 leading-relaxed">
                MONARA is a collection of evolving digital beings (NFTs) on the Monad Network. Each being starts as a neural network visualization and evolves through computational stages over time.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Users className="w-5 h-5 text-purple-400 mr-2" />
                How do NFTs evolve?
              </h3>
              <p className="text-white/70 leading-relaxed">
                MONARA beings evolve through algorithmic computation based on blockchain data, time factors, and neural network parameters. Evolution happens automatically over time.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Globe className="w-5 h-5 text-blue-400 mr-2" />
                What is Monad Network?
              </h3>
              <p className="text-white/70 leading-relaxed">
                Monad is an ultra-fast, EVM-compatible blockchain with 10,000+ TPS and 0.5s block times. It provides the perfect infrastructure for real-time NFT evolution.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Mail className="w-5 h-5 text-green-400 mr-2" />
                Need Technical Support?
              </h3>
              <p className="text-white/70 leading-relaxed">
                For technical issues, wallet problems, or transaction questions, please join our Discord community or submit a GitHub issue for the fastest response.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 