
import React, { useState } from 'react';
import { speechService, decodeBase64, decodeAudioData } from '../services/gemini';

const SpeechMode: React.FC = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState('Kore');

  const voices = [
    { name: 'Kore', desc: 'Balanced & Clear' },
    { name: 'Puck', desc: 'Energetic & Bright' },
    { name: 'Charon', desc: 'Deep & Authoritative' },
    { name: 'Fenrir', desc: 'Warm & Natural' }
  ];

  const handleSynthesize = async () => {
    if (!text.trim() || isSpeaking) return;

    setIsSpeaking(true);
    try {
      const base64Audio = await speechService.generateSpeech(text, voice);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const uint8Array = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(uint8Array, audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (err) {
      console.error(err);
      alert("Speech synthesis failed.");
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gray-950/50">
        <div>
          <h2 className="text-lg font-semibold text-purple-300">Neural Voice</h2>
          <p className="text-xs text-gray-500">Gemini 2.5 Flash TTS Engine</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl glass p-8 rounded-3xl border-white/10 shadow-2xl">
          <label className="block text-xs uppercase tracking-[0.2em] font-bold text-purple-400 mb-4">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type anything you want Aether to speak..."
            className="w-full bg-black/30 border border-white/5 rounded-2xl p-6 min-h-[150px] focus:outline-none focus:border-purple-500/50 transition-colors text-lg leading-relaxed mb-8 placeholder-gray-700"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {voices.map((v) => (
              <button
                key={v.name}
                onClick={() => setVoice(v.name)}
                className={`p-3 rounded-xl border transition-all text-left ${
                  voice === v.name 
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-inner' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="text-sm font-bold">{v.name}</div>
                <div className="text-[9px] opacity-60 truncate">{v.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleSynthesize}
            disabled={!text.trim() || isSpeaking}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl shadow-purple-900/20"
          >
            {isSpeaking ? (
              <>
                <div className="flex space-x-1">
                  {[1, 2, 3].map(i => <div key={i} className="w-1 h-4 bg-white/60 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                </div>
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                <span>Generate & Speak</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechMode;
