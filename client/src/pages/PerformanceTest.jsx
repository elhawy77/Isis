import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Gauge, TrendingUp } from 'lucide-react';

const PerformanceTest = () => {
  const [testRunning, setTestRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: 0
  });

  const runLoadTest = async () => {
    setTestRunning(true);
    const token = localStorage.getItem('token');
    const testMetrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: []
    };

    try {
      // Simulate 100 concurrent requests
      const requests = Array(100).fill(null).map(() => {
        const startTime = performance.now();
        return axios.get('/api/health', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
          const endTime = performance.now();
          testMetrics.successfulRequests++;
          testMetrics.responseTimes.push(endTime - startTime);
          return { success: true, time: endTime - startTime };
        }).catch(err => {
          testMetrics.failedRequests++;
          return { success: false };
        });
      });

      const results = await Promise.all(requests);
      testMetrics.totalRequests = results.length;

      const times = testMetrics.responseTimes;
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

      setMetrics({
        totalRequests: testMetrics.totalRequests,
        successfulRequests: testMetrics.successfulRequests,
        failedRequests: testMetrics.failedRequests,
        averageResponseTime: Math.round(avgTime),
        maxResponseTime: Math.round(Math.max(...times)),
        minResponseTime: Math.round(Math.min(...times))
      });

      setResults({ passed: testMetrics.failedRequests === 0 });
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      setTestRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Performance Testing</h1>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Load Test</h2>
          <button
            onClick={runLoadTest}
            disabled={testRunning}
            className={`px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              testRunning
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Gauge size={20} />
            {testRunning ? 'Running Test...' : 'Run Load Test'}
          </button>
        </div>

        {results && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`rounded-lg border p-6 ${
              results.passed
                ? 'border-green-500 bg-green-900/20'
                : 'border-red-500 bg-red-900/20'
            }`}>
              <h3 className="text-xl font-bold mb-4">
                {results.passed ? '✅ All Tests Passed' : '❌ Tests Failed'}
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>Total Requests: <span className="font-bold">{metrics.totalRequests}</span></p>
                <p>Successful: <span className="font-bold text-green-400">{metrics.successfulRequests}</span></p>
                <p>Failed: <span className="font-bold text-red-400">{metrics.failedRequests}</span></p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={24} /> Response Times
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>Average: <span className="font-bold">{metrics.averageResponseTime}ms</span></p>
                <p>Max: <span className="font-bold">{metrics.maxResponseTime}ms</span></p>
                <p>Min: <span className="font-bold">{metrics.minResponseTime}ms</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTest;
