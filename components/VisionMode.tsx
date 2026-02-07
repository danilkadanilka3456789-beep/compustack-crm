
import React, { useState } from 'react';
import { visionService } from '../services/gemini';
import { GeneratedImage } from '../types';

const VisionMode: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const imageUrl = await visionService.generateImage(prompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: new Date()
      };
      setImages(prev => [newImage, ...prev]);
      setPrompt('');
    } catch (err) {
      console.error("Generation failed:", err);
      alert("Failed to generate image. Please try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gray-950/50">
        <div>
          <h2 className="text-lg font-semibold text-indigo-300">Aether Vision</h2>
          <p className="text-xs text-gray-500">Gemini 2.5 Flash Image Synthesis</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {images.length === 0 && !isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-medium">No creations yet</h3>
            <p className="text-sm max-w-xs mt-2">Describe something magical and let Aether bring it to life.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isGenerating && (
              <div className="aspect-square rounded-2xl border-2 border-dashed border-indigo-500/30 flex flex-col items-center justify-center bg-indigo-500/5 animate-pulse">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-medium text-indigo-400">Visualizing...</p>
              </div>
            )}
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-2xl overflow-hidden glass border-white/10 hover:border-indigo-500/50 transition-all duration-300">
                <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-xs text-white/90 line-clamp-2 italic">"{img.prompt}"</p>
                  <button 
                    onClick={() => window.open(img.url, '_blank')}
                    className="mt-2 text-[10px] uppercase tracking-wider font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Download High-Res
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <form onSubmit={handleGenerate} className="max-w-4xl mx-auto relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city with floating neon gardens, hyper-realistic, 8k..."
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none placeholder-gray-600"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="absolute right-3 bottom-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
          >
            {isGenerating ? 'Generating...' : 'Synthesize'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisionMode;
