import React, { useState } from 'react';
import { MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Support = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [description, setDescription] = useState('');
  const [ticketCreated, setTicketCreated] = useState(null);
  const token = localStorage.getItem('token');

  const sendChatMessage = async () => {
    if (!message.trim()) return;

    setChatMessages([...chatMessages, { type: 'user', message }]);
    setMessage('');

    try {
      const response = await axios.post(
        '/api/chat/message',
        { message },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setChatMessages(prev => [...prev, { type: 'bot', message: response.data.botResponse }]);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/support/tickets',
        { subject, category, description },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setTicketCreated(response.data.ticketId);
      setSubject('');
      setCategory('technical');
      setDescription('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-gray-400">Get help from our AI bot or contact our support team</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <MessageSquare className="inline mr-2" size={20} />
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'ticket'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Create Ticket
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'contact'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Contact Info
          </button>
        </div>

        {/* AI Chat */}
        {activeTab === 'chat' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="h-96 bg-slate-900 rounded-lg mb-4 p-4 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Ask me anything about Isis! How can I help?</p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-200'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={sendChatMessage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Create Ticket */}
        {activeTab === 'ticket' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            {ticketCreated ? (
              <div className="text-center py-12">
                <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Ticket Created!</h3>
                <p className="text-gray-400 mb-6">Ticket ID: <span className="font-mono text-blue-400">{ticketCreated}</span></p>
                <p className="text-gray-400 mb-6">Our support team will respond within 24-48 hours</p>
                <button
                  onClick={() => setTicketCreated(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={createTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500"
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Create Support Ticket
                </button>
              </form>
            )}
          </div>
        )}

        {/* Contact Info */}
        {activeTab === 'contact' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Email</p>
                  <p className="text-xl text-white">ma9933151@gmail.com</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Phone</p>
                  <p className="text-xl text-white">+20 201143628812</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Location</p>
                  <p className="text-xl text-white">Cairo, Egypt</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Support Hours</p>
                  <p className="text-white">Monday - Friday: 9 AM - 6 PM (EET)</p>
                  <p className="text-gray-400 text-sm">Response time: 24-48 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <Clock size={24} className="text-blue-400 mb-2" />
                  <p className="text-gray-400">Average Response Time</p>
                  <p className="text-2xl font-bold text-white">24 Hours</p>
                </div>
                <div>
                  <CheckCircle size={24} className="text-green-400 mb-2" />
                  <p className="text-gray-400">Resolution Rate</p>
                  <p className="text-2xl font-bold text-white">99%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
