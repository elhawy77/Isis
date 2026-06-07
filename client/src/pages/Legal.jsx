import React, { useState } from 'react';

const Legal = () => {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Legal</h1>
          <p className="text-gray-400">Terms of Service, Privacy Policy & Copyright Information</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {[
            { id: 'terms', label: 'Terms of Service' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'copyright', label: 'Copyright' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-gray-300 space-y-6 prose prose-invert max-w-none">
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
                <p>Last Updated: June 2024</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h3>
                <p>By accessing and using Isis ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2. Use License</h3>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on Isis for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Modifying or copying the materials</li>
                  <li>Using the materials for any commercial purpose or for any public display</li>
                  <li>Attempting to reverse engineer any software contained on Isis</li>
                  <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Disclaimer</h3>
                <p>The materials on Isis are provided on an 'as is' basis. Isis makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4. Limitations</h3>
                <p>In no event shall Isis or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Isis.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">5. User Content</h3>
                <p>You retain all rights to any content you submit, post or display on or through the Service. By submitting content to Isis, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content in connection with our Service.</p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
                <p>Last Updated: June 2024</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name, email address, and password</li>
                  <li>Billing information and transaction history</li>
                  <li>Profile information (username, profile picture, etc.)</li>
                  <li>Communications and support requests</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2. How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Data Security</h3>
                <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4. Your Rights</h3>
                <p>You have the right to access, update, or delete your personal information at any time by logging into your account or contacting us.</p>
              </div>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Copyright Notice</h2>
                <p>© 2024 Isis AI Video Generator. All rights reserved.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Copyright Ownership</h3>
                <p>All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Isis AI Video Generator or its content suppliers and is protected by international copyright laws.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2. User-Generated Content</h3>
                <p>Users retain all intellectual property rights to videos and content they generate using our Service. However, we maintain the right to use generated content for service improvement and marketing purposes with proper attribution.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Watermark Policy</h3>
                <p>Free tier videos include the Isis watermark. Pro and Enterprise users have access to watermark-free exports. Removing our watermark without authorization is prohibited.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4. Copyright Claims</h3>
                <p>If you believe your copyright has been violated, please contact us at ma9933151@gmail.com with:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Identification of the copyrighted work</li>
                  <li>Location of the infringing material</li>
                  <li>Your contact information</li>
                  <li>A statement of good faith belief that the use is not authorized</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Contact Information</h3>
                <p>
                  <strong>Isis AI Video Generator</strong><br />
                  Email: ma9933151@gmail.com<br />
                  Phone: +20 201143628812<br />
                  Address: Cairo, Egypt
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-6 bg-slate-800 rounded-lg border border-slate-700 text-sm text-gray-400">
          <p>
            These legal documents were last updated on June 7, 2024. We may update these policies from time to time. Your continued use of our Service constitutes your acceptance of any changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
