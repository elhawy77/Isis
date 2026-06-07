import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      credits: '150 credits',
      description: 'Perfect for getting started',
      features: [
        { name: 'Text to Video', included: true },
        { name: 'Image to Video', included: true },
        { name: 'Max Resolution 1080p', included: true },
        { name: 'Max Duration 10s', included: true },
        { name: 'Watermarked Videos', included: false },
        { name: 'Batch Processing', included: false },
        { name: 'API Access', included: false },
        { name: 'Priority Support', included: false }
      ],
      cta: 'Get Started',
      action: () => navigate('/register')
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      credits: '1000 credits',
      description: 'For serious creators',
      popular: true,
      features: [
        { name: 'Text to Video', included: true },
        { name: 'Image to Video', included: true },
        { name: 'Max Resolution 4K', included: true },
        { name: 'Max Duration 30s', included: true },
        { name: 'Watermark-Free', included: true },
        { name: 'Batch Processing', included: true },
        { name: 'API Access', included: false },
        { name: 'Priority Support', included: true }
      ],
      cta: 'Subscribe Now',
      action: () => navigate(token ? '/dashboard/subscription?plan=pro' : '/login')
    },
    {
      name: 'Enterprise',
      price: '$149',
      period: '/month',
      credits: '10,000 credits',
      description: 'For agencies & studios',
      features: [
        { name: 'Text to Video', included: true },
        { name: 'Image to Video', included: true },
        { name: 'Max Resolution 8K', included: true },
        { name: 'Max Duration 120s', included: true },
        { name: 'Watermark-Free', included: true },
        { name: 'Batch Processing', included: true },
        { name: 'API Access', included: true },
        { name: 'Priority Support', included: true }
      ],
      cta: 'Contact Sales',
      action: () => window.location.href = 'mailto:ma9933151@gmail.com?subject=Enterprise Plan Inquiry'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400">
            Choose the perfect plan for your video generation needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-lg border transition transform hover:scale-105 ${
                plan.popular
                  ? 'border-blue-500 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl md:scale-105'
                  : 'border-slate-700 bg-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-white">
                    {plan.price}
                    <span className="text-lg text-gray-400 font-normal">{plan.period}</span>
                  </div>
                  <div className="text-sm text-blue-400 mt-2">{plan.credits}</div>
                </div>

                <button
                  onClick={plan.action}
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check size={20} className="text-green-400 flex-shrink-0" />
                      ) : (
                        <X size={20} className="text-gray-600 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto pt-12 border-t border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Can I upgrade or downgrade anytime?</h4>
              <p className="text-gray-400">
                Yes! You can change your plan at any time. We'll prorate charges accordingly.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">What happens to unused credits?</h4>
              <p className="text-gray-400">
                Credits reset monthly. Unused credits do not carry over, but Pro and Enterprise plans include rollover options.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Do you offer refunds?</h4>
              <p className="text-gray-400">
                We offer a 7-day money-back guarantee if you're not satisfied. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
