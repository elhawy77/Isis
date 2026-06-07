import React, { useState, useEffect } from 'react';
import { BarChart3, CreditCard, Settings, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(response.data.user);
      setStats({
        videosGenerated: response.data.user.videosGenerated || 0,
        creditsRemaining: response.data.user.credits?.remaining || 0,
        currentPlan: response.data.user.plan || 'free'
      });
    } catch (err) {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎬</div>
            <h1 className="text-2xl font-bold text-white">Isis Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white">
              <Settings size={24} />
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white">
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome back, {user.username}!</h2>
          <p className="text-gray-400">Plan: <span className="font-semibold text-blue-400 capitalize">{stats.currentPlan}</span></p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Credits Remaining</p>
                <p className="text-3xl font-bold text-white">{stats.creditsRemaining}</p>
              </div>
              <CreditCard size={40} className="text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Videos Generated</p>
                <p className="text-3xl font-bold text-white">{stats.videosGenerated}</p>
              </div>
              <BarChart3 size={40} className="text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full h-full flex flex-col items-center justify-center text-center hover:bg-slate-700 transition rounded"
            >
              <p className="text-gray-400 text-sm mb-2">Upgrade Plan</p>
              <p className="text-lg font-semibold text-blue-400">View Plans →</p>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/generate')}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-center hover:from-blue-700 hover:to-purple-700 transition"
          >
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-2">Create New Video</h3>
            <p className="text-blue-100">Start generating amazing videos</p>
          </button>

          <button
            onClick={() => navigate('/support')}
            className="bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-8 text-center hover:from-green-700 hover:to-teal-700 transition"
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-white mb-2">Get Support</h3>
            <p className="text-green-100">Chat with our AI or contact support</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
