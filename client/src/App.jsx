import React, { useState } from 'react';
import TextToVideoGenerator from './components/TextToVideoGenerator';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎬</div>
            <h1 className="text-2xl font-bold text-white">Isis AI Video Generator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <TextToVideoGenerator />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>© 2024 Isis AI Video Generator</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
