import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Zap, Shield, Users, Cpu, Gauge } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎬</div>
            <span className="text-2xl font-bold">Isis</span>
          </div>
          <div className="flex gap-4">
            {token ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 text-gray-400 hover:text-white transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Create AI Videos in Seconds
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Transform your imagination into stunning videos using the most advanced AI models. From text to cinematic videos - it's all here.
        </p>
        <div className="flex gap-4 justify-center mb-12">
          <button
            onClick={() => navigate(token ? '/generate' : '/register')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2"
          >
            <Play size={20} /> Start Creating
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="px-8 py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/10 transition"
          >
            View Pricing
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Isis?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Generate 4K videos in minutes using our optimized AI engines'
            },
            {
              icon: Shield,
              title: 'Enterprise Grade',
              description: 'Bank-level security and 99.9% uptime guarantee for your content'
            },
            {
              icon: Users,
              title: '24/7 Support',
              description: 'Get help anytime with our AI bot and human support team'
            },
            {
              icon: Cpu,
              title: 'Advanced Models',
              description: 'Access to Runway, Luma, Stable Diffusion and custom models'
            },
            {
              icon: Gauge,
              title: 'Full Control',
              description: 'Customize every aspect - from resolution to motion dynamics'
            },
            {
              icon: Play,
              title: 'Multiple Formats',
              description: 'Export to any format, resolution, or codec you need'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-slate-800 rounded-lg border border-slate-700 p-8 hover:border-blue-500 transition">
                <Icon size={40} className="text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Free',
              price: '$0',
              credits: '150',
              features: ['Text to Video', 'Image to Video', '1080p', 'Watermarked']
            },
            {
              name: 'Pro',
              price: '$19',
              credits: '1000',
              features: ['All Free', '4K Resolution', 'Watermark-free', 'Priority Support'],
              popular: true
            },
            {
              name: 'Enterprise',
              price: '$149',
              credits: '10,000',
              features: ['All Pro', '8K Resolution', 'API Access', 'Custom Models']
            }
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-8 ${
                plan.popular
                  ? 'border-blue-500 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl md:scale-105'
                  : 'border-slate-700 bg-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="mb-4 text-center">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-400 mb-1">{plan.price}<span className="text-lg text-gray-400">/month</span></p>
              <p className="text-gray-400 text-sm mb-6">{plan.credits} credits</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-300 flex items-center gap-2">
                    <span className="text-green-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded-lg font-semibold transition ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Create?</h2>
        <p className="text-xl text-gray-400 mb-8">Join thousands of creators using Isis to generate amazing videos</p>
        <button
          onClick={() => navigate(token ? '/generate' : '/register')}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition text-lg"
        >
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/support" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:ma9933151@gmail.com" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/legal" className="hover:text-white">Terms</a></li>
                <li><a href="/legal" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-gray-400">📧 ma9933151@gmail.com</p>
              <p className="text-gray-400">📱 +20 201143628812</p>
              <p className="text-gray-400">📍 Cairo, Egypt</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-gray-400">
            <p>© 2024 Isis AI Video Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
