import React, { useState, useEffect } from 'react';
import { Users, BarChart3, DollarSign, Video, MessageSquare, Settings, LogOut, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, videosRes, invoicesRes, ticketsRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('/api/admin/users?limit=10', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('/api/admin/videos?limit=10', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('/api/admin/invoices?limit=10', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('/api/admin/support?limit=10', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setVideos(videosRes.data.videos);
      setInvoices(invoicesRes.data.invoices);
      setTickets(ticketsRes.data.tickets);
    } catch (err) {
      console.error('Error:', err);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, updates, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchDashboardData();
      alert('User updated successfully');
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchDashboardData();
        alert('User deleted successfully');
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚙️</div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-gray-400 hover:text-white">
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        {stats && activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users size={40} className="text-blue-400" />
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Videos</p>
                  <p className="text-3xl font-bold text-white">{stats.totalVideos}</p>
                </div>
                <Video size={40} className="text-purple-400" />
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Revenue</p>
                  <p className="text-3xl font-bold text-white">${stats.totalRevenue}</p>
                </div>
                <DollarSign size={40} className="text-green-400" />
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Active Subs</p>
                  <p className="text-3xl font-bold text-white">{stats.activeSubscriptions}</p>
                </div>
                <BarChart3 size={40} className="text-orange-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'videos', label: 'Videos', icon: Video },
            { id: 'invoices', label: 'Invoices', icon: DollarSign },
            { id: 'support', label: 'Support', icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-400">Username</th>
                    <th className="text-left py-3 px-4 text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400">Plan</th>
                    <th className="text-left py-3 px-4 text-gray-400">Credits</th>
                    <th className="text-left py-3 px-4 text-gray-400">Admin</th>
                    <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="py-3 px-4 text-white">{user.username}</td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.subscription?.plan === 'enterprise' ? 'bg-purple-900 text-purple-200' :
                          user.subscription?.plan === 'pro' ? 'bg-blue-900 text-blue-200' :
                          'bg-gray-900 text-gray-200'
                        }`}>
                          {user.subscription?.plan || 'free'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">{user.subscription?.credits?.remaining || 0}</td>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={user.isAdmin}
                          onChange={(e) => handleUpdateUser(user._id, { isAdmin: e.target.checked })}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-400">Title</th>
                    <th className="text-left py-3 px-4 text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-gray-400">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map(video => (
                    <tr key={video._id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="py-3 px-4 text-white">{video.title}</td>
                      <td className="py-3 px-4 text-gray-400">{video.user.username}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          video.status === 'completed' ? 'bg-green-900 text-green-200' :
                          video.status === 'processing' ? 'bg-yellow-900 text-yellow-200' :
                          video.status === 'failed' ? 'bg-red-900 text-red-200' :
                          'bg-gray-900 text-gray-200'
                        }`}>
                          {video.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{video.generationType}</td>
                      <td className="py-3 px-4 text-gray-400">{new Date(video.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-400">Invoice</th>
                    <th className="text-left py-3 px-4 text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice._id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="py-3 px-4 text-white font-mono text-xs">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4 text-gray-400">{invoice.user.username}</td>
                      <td className="py-3 px-4 text-white">${invoice.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          invoice.status === 'paid' ? 'bg-green-900 text-green-200' :
                          invoice.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-red-900 text-red-200'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-400">Ticket ID</th>
                    <th className="text-left py-3 px-4 text-gray-400">Subject</th>
                    <th className="text-left py-3 px-4 text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-gray-400">Priority</th>
                    <th className="text-left py-3 px-4 text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket._id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="py-3 px-4 text-white font-mono text-xs">{ticket.ticketId}</td>
                      <td className="py-3 px-4 text-gray-400">{ticket.subject}</td>
                      <td className="py-3 px-4 text-gray-400">{ticket.user.username}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          ticket.priority === 'urgent' ? 'bg-red-900 text-red-200' :
                          ticket.priority === 'high' ? 'bg-orange-900 text-orange-200' :
                          ticket.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-green-900 text-green-200'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          ticket.status === 'resolved' ? 'bg-green-900 text-green-200' :
                          ticket.status === 'in_progress' ? 'bg-blue-900 text-blue-200' :
                          'bg-gray-900 text-gray-200'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
