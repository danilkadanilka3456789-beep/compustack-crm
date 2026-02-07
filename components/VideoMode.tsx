
import React, { useState } from 'react';
import { videoService } from '../services/gemini';

interface VideoModeProps {
  hasKey: boolean;
  onSelectKey: () => void;
}

const VideoMode: React.FC<VideoModeProps> = ({ hasKey, onSelectKey }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const statuses = [
    "Analyzing creative parameters...",
    "Sampling cinematic textures...",
    "Generating temporal frames...",
    "Optimizing motion vectors...",
    "Finalizing high-fidelity output..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setVideoUrl(null);
    setStatus(statuses[0]);

    // Update status periodically for better UX
    const statusInterval = setInterval(() => {
      setStatus(prev => {
        const idx = statuses.indexOf(prev);
        return statuses[(idx + 1) % statuses.length];
      });
    }, 12000);

    try {
      const url = await videoService.generateVideo(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        alert("API Key error. Please re-select a paid project key.");
        onSelectKey();
      } else {
        alert("Video generation failed. Please check your billing or try a simpler prompt.");
      }
    } finally {
      clearInterval(statusInterval);
      setIsGenerating(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-950">
        <div className="max-w-md glass p-8 rounded-3xl border-white/10">
          <div className="text-5xl mb-6">🔑</div>
          <h2 className="text-2xl font-bold mb-4">Paid API Key Required</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Veo video generation requires an API key from a paid Google Cloud project. 
            Please select your key to continue.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="text-indigo-400 text-xs hover:underline block mb-6"
          >
            Learn more about billing
          </a>
          <button
            onClick={onSelectKey}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-black">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gray-950/50 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Veo Cinematic</h2>
          <p className="text-xs text-gray-500">Professional Video Generation (1080p)</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
        {isGenerating ? (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-2xl font-medium text-white mb-2">{status}</h3>
              <p className="text-gray-500 text-sm italic">This usually takes about 2-3 minutes...</p>
            </div>
            <div className="w-64 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-cyan-400 animate-progress origin-left"></div>
            </div>
          </div>
        ) : videoUrl ? (
          <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/10 border border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full aspect-video bg-black"
            />
            <div className="p-4 glass border-t border-white/5 flex justify-between items-center">
              <span className="text-sm text-gray-400 truncate max-w-md italic">"{prompt}"</span>
              <a 
                href={videoUrl} 
                download="aether-creation.mp4"
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all"
              >
                Download MP4
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-30">
            <div className="text-8xl mb-6">🎥</div>
            <h3 className="text-2xl font-medium">Create your first scene</h3>
            <p className="text-sm mt-3">High-resolution motion synthesis starting from text.</p>
          </div>
        )}
      </div>

      <div className="p-8 bg-gradient-to-t from-gray-950 to-transparent">
        <form onSubmit={handleGenerate} className="max-w-4xl mx-auto flex space-x-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A drone shot of a misty mountain range at dawn, cinematic lighting..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-600"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="px-10 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all disabled:opacity-30 shadow-lg shadow-cyan-600/20"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoMode;
