import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Download, Eye } from 'lucide-react';

const TextToVideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('runway-gen3');
  const [duration, setDuration] = useState(4);
  const [resolution, setResolution] = useState('1080p');
  const [quality, setQuality] = useState('high');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState(null);

  const generateVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/generate/text-to-video', 
        {
          prompt,
          provider: model,
          duration,
          resolution,
          quality,
          fps: 24
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      pollProgress(response.data.videoId);
    } catch (err) {
      alert('Error: ' + err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const pollProgress = async (videoId) => {
    const token = localStorage.getItem('token');
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/generate/status/${videoId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setProgress(response.data.progress);

        if (response.data.status === 'completed') {
          setGeneratedVideo(response.data.videoUrl);
          setLoading(false);
          clearInterval(interval);
        } else if (response.data.status === 'failed') {
          alert('Generation failed: ' + response.data.error);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">🎬 Text to Video</h2>

      <form onSubmit={generateVideo} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Describe your video:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic scene of a spaceship flying through asteroid fields..."
            className="w-full h-32 p-4 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">AI Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600"
            disabled={loading}
          >
            <option value="runway-gen3">🏃 Runway Gen-3 (Best Quality)</option>
            <option value="luma-dream">✨ Luma Dream Machine</option>
            <option value="stable-video">📹 Stable Video</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Duration: {duration}s
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Resolution:</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600"
              disabled={loading}
            >
              <option>720p</option>
              <option>1080p</option>
              <option>2K</option>
              <option>4K</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Quality:</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600"
              disabled={loading}
            >
              <option>standard</option>
              <option>high</option>
              <option>ultra</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          <Zap className="inline mr-2" size={20} />
          {loading ? `Generating... ${progress}%` : 'Generate Video'}
        </button>
      </form>

      {loading && (
        <div className="mt-6 bg-slate-700 rounded-lg p-4">
          <div className="w-full bg-slate-600 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {generatedVideo && (
        <div className="mt-8 bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-4">✅ Video Generated!</h3>
          <video src={generatedVideo} controls className="w-full rounded-lg mb-4" />
          <div className="flex gap-3">
            <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="inline mr-2" size={18} /> Download
            </button>
            <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Eye className="inline mr-2" size={18} /> Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToVideoGenerator;
