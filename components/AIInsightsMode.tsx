
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AIInsightsMode: React.FC = () => {
  const [prompt, setPrompt] = useState('Проанализируй текущие продажи компьютеров: выручка 1.2 млн, средний чек 45к. Дай рекомендации по увеличению лояльности клиентов.');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      // Use process.env.API_KEY directly when initializing GoogleGenAI
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: 'Ты - бизнес-консультант CRM системы компьютерного магазина. Давай четкие рекомендации на основе данных.',
        }
      });
      // Correctly access the .text property on GenerateContentResponse
      setResponse(result.text || 'Нет данных');
    } catch (e) {
      setResponse('Ошибка анализа. Проверьте подключение к API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <span>AI Бизнес-Ассистент</span>
          <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded text-white uppercase">Beta</span>
        </h2>
        <p className="text-sm text-gray-400 italic">"Анализ деятельности компании" (Пункт 3.4 вашего проекта)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2">
          <div className="glass p-6 rounded-3xl border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">Параметры анализа</h3>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm min-h-[150px] focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Введите данные для анализа..."
            />
            <button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
            >
              {isLoading ? 'Анализирую...' : 'Запустить анализ'}
            </button>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">Быстрые шаблоны</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg bg-white/5 text-xs hover:bg-white/10 transition-colors">
                Прогноз продаж на след. квартал
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-white/5 text-xs hover:bg-white/10 transition-colors">
                Анализ складских остатков видеокарт
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-white/5 text-xs hover:bg-white/10 transition-colors">
                План реактивации спящих клиентов
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-3xl border-white/5 p-8 overflow-y-auto bg-indigo-900/5">
          {response ? (
            <div className="prose prose-invert max-w-none">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center animate-pulse">
                  🧠
                </div>
                <div className="text-lg font-semibold">Отчет сформирован:</div>
              </div>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-indigo-500 pl-6">
                {response}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-medium">Готов к анализу</h3>
              <p className="text-sm max-w-xs mt-2">Введите данные о продажах слева, чтобы получить рекомендации от искусственного интеллекта.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsMode;
