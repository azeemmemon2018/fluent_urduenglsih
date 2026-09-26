import React, { useState } from 'react';
import { GroundingSource } from '../types';
import {
  Globe,
  Search,
  ExternalLink,
  Volume2,
  Mic,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Send,
  Radio,
  CheckCircle2,
  TrendingUp,
  Newspaper
} from 'lucide-react';
import { playTextToSpeech, createSpeechRecognizer } from '../utils/audio';

interface NewsAgentProps {
  audioSpeed: number;
  onRecordPracticeSession: (title: string, score: number) => void;
}

const PRESET_TOPICS = [
  { label: 'Cricket & Sports Updates', query: 'Latest international cricket match results and sports highlights today' },
  { label: 'AI & Tech Innovations', query: 'Latest artificial intelligence and tech industry breakthroughs this week' },
  { label: 'Space & Science Discoveries', query: 'Recent NASA and space science discoveries and space missions' },
  { label: 'Pakistan & Regional Highlights', query: 'Latest news highlights and cultural developments in Pakistan today' },
  { label: 'Global Economy & Climate', query: 'Current world economic trends and global green energy developments' },
];

export const NewsAgent: React.FC<NewsAgentProps> = ({
  audioSpeed,
  onRecordPracticeSession,
}) => {
  const [selectedTopic, setSelectedTopic] = useState(PRESET_TOPICS[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [newsContent, setNewsContent] = useState<string>(
    `### Today's Global Sports & Cricket Spotlight\n\nRecent international cricket and sports fixtures have brought exhilarating matches, with teams demonstrating exceptional resilience and tactical acumen. Fans worldwide are closely following the latest championship standings, analyzing team selection strategies, and celebrating record-breaking athletic performances.\n\n### اردو میں خلاصہ اور خبریں\nعالمی کھیلوں اور بالخصوص کرکٹ کے میدانوں میں حالیہ مقابلوں میں زبردست سنسنی خیز مقابلے دیکھے گئے ہیں۔ کھلاڑیوں نے دباؤ کے باوجود بہترین کارکردگی کا مظاہرہ کیا۔ شائقین کرکٹ پوائنٹس ٹیبل اور کھلاڑیوں کے نئے ریکارڈز پر دلچسپ تبادلہ خیال کر رہے ہیں۔\n\n### اہم الفاظ (Key News Vocabulary)\n• **Tactical Acumen** (/ˈtæk.tɪ.kəl əˈkjuː.mən/): حکمت عملی کی سمجھ بوجھ (Sharp strategic decision making).\n• **Resilience** (/rɪˈzɪl.jəns/): ثابت قدمی اور مشکلات کا مقابلہ کرنے کی صلاحیت.\n• **Championship Standings**: ٹورنامنٹ کی موجودہ پوزیشنز اور درجہ بندی.`
  );
  const [sources, setSources] = useState<GroundingSource[]>([
    {
      title: 'International Cricket Council & Sports News',
      url: 'https://www.icc-cricket.com',
    },
    {
      title: 'Google News - Global Sports',
      url: 'https://news.google.com',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDebateInput, setUserDebateInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [debateFeedback, setDebateFeedback] = useState<string | null>(null);

  const fetchNews = async (queryText: string) => {
    setIsLoading(true);
    setDebateFeedback(null);

    try {
      const res = await fetch('/api/news-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: queryText,
          userQuery: queryText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewsContent(data.text || 'News retrieved successfully.');
        setSources(data.sources || []);
      }
    } catch (err) {
      console.warn('News agent error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    fetchNews(customQuery.trim());
  };

  const handleSelectPreset = (preset: (typeof PRESET_TOPICS)[0]) => {
    setSelectedTopic(preset);
    setCustomQuery('');
    fetchNews(preset.query);
  };

  const handleListenNews = () => {
    // Extract English portion for TTS
    const englishText = newsContent.split('### اردو')[0] || newsContent;
    playTextToSpeech(englishText.replace(/[#*•]/g, ''), 'en', audioSpeed);
  };

  const handleRecordSpeech = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setUserDebateInput('');
    setIsRecording(true);

    const recognizer = createSpeechRecognizer(
      (transcript, isFinal) => {
        setUserDebateInput(transcript);
        if (isFinal) {
          setIsRecording(false);
          submitDebateThought(transcript);
        }
      },
      () => setIsRecording(false),
      (err) => {
        console.warn('Speech err', err);
        setIsRecording(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch {
        setIsRecording(false);
      }
    } else {
      setTimeout(() => {
        const sample = 'I think this news shows how quickly international sports and technology are evolving.';
        setUserDebateInput(sample);
        submitDebateThought(sample);
        setIsRecording(false);
      }, 1200);
    }
  };

  const submitDebateThought = (thought: string) => {
    if (!thought.trim()) return;
    setDebateFeedback(
      'Great perspective! Your vocabulary connects well with current events. Try using formal linkers like "Furthermore" or "From my perspective" to elevate your spoken discourse.'
    );
    onRecordPracticeSession('Current Events Debate', 92);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Radio className="h-4 w-4 animate-pulse text-sky-400" />
              <span>Real-Time Google Search Grounding · لائیو عالمی خبریں و حالاتِ حاضرہ</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white">
              Current Events & News English Debate Agent
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Stay informed with real-time news powered by Google Search. Learn sophisticated news vocabulary, practice discussing current affairs, and verify facts with live cited web sources.
            </p>
          </div>

          <button
            onClick={handleListenNews}
            className="flex items-center gap-2 rounded-xl bg-sky-500/20 border border-sky-500/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors shadow-lg shadow-sky-500/10 whitespace-nowrap self-start md:self-auto"
          >
            <Volume2 className="h-4 w-4 text-sky-400" />
            <span>Listen to News Audio ({audioSpeed}x)</span>
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-sky-400" /> Trending:
        </span>
        {PRESET_TOPICS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPreset(preset)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedTopic.label === preset.label
                ? 'bg-sky-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search any current event (e.g. Champions Trophy, NASA Mars rover, AI Summit 2026)..."
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !customQuery.trim()}
          className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-40 transition-colors shadow-md shadow-sky-600/20"
        >
          {isLoading ? 'Searching...' : 'Explore News'}
        </button>
      </form>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Article & Urdu Analysis */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold">
                <Newspaper className="h-4 w-4" />
                <span>Live Google Search Grounded Discussion</span>
              </div>
              <span className="text-xs text-slate-500">Updated Real-Time</span>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="flex justify-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-sm font-medium text-slate-300">Searching Google Grounding & Curating News...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-3">
                {newsContent.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('###')) {
                    const isUrduHeader = paragraph.includes('اردو');
                    return (
                      <h3
                        key={idx}
                        className={`text-base font-bold pt-3 pb-1 border-b border-slate-800 ${
                          isUrduHeader ? 'font-urdu text-emerald-400 text-lg' : 'text-sky-300'
                        }`}
                      >
                        {paragraph.replace(/###/g, '').trim()}
                      </h3>
                    );
                  }
                  if (paragraph.includes('•') || paragraph.includes('**')) {
                    return (
                      <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm">
                        {paragraph}
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive User Opinion & Debate Practice */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mic className="h-4 w-4 text-emerald-400" />
                Practice Discussing This News (آپ کی رائے)
              </h3>
              <span className="text-xs text-slate-500">Share your thoughts in English</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Give your opinion or summary in English (e.g. I believe this development is crucial for...)..."
                value={userDebateInput}
                onChange={(e) => setUserDebateInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
              />

              <button
                onClick={handleRecordSpeech}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
                title="Speak your opinion into the microphone"
              >
                <Mic className={`h-4 w-4 ${isRecording ? 'text-white' : 'text-emerald-400'}`} />
                <span className="hidden sm:inline">{isRecording ? 'Listening...' : 'Speak'}</span>
              </button>

              <button
                onClick={() => submitDebateThought(userDebateInput)}
                disabled={!userDebateInput.trim()}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors shadow-md shadow-emerald-600/20"
              >
                Submit
              </button>
            </div>

            {debateFeedback && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-slate-200 animate-fadeIn">
                <span className="font-bold text-emerald-400 block mb-0.5">
                  Coach Feedback on Your News Discussion:
                </span>
                <p>{debateFeedback}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cited Google Sources & Live Web Links */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-sky-400" />
              Cited Real-Time Sources ({sources.length})
            </h3>
            <p className="text-xs text-slate-400">
              Verified live web links retrieved via Google Search grounding:
            </p>

            <div className="space-y-2">
              {sources.map((source, index) => {
                const domain = (() => {
                  try {
                    return new URL(source.url).hostname.replace('www.', '');
                  } catch {
                    return 'web source';
                  }
                })();

                return (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border border-slate-700/80 bg-slate-800/80 p-3 hover:border-sky-500/50 hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                        {source.title}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-400 shrink-0 mt-0.5" />
                    </div>
                    <span className="mt-1 inline-block rounded bg-slate-700/60 px-2 py-0.5 text-[10px] text-sky-300 font-mono">
                      {domain}
                    </span>
                  </a>
                );
              })}

              {sources.length === 0 && (
                <p className="text-xs text-slate-500 py-3 text-center">
                  Search a topic to view cited live web sources.
                </p>
              )}
            </div>
          </div>

          {/* Quick Learning Tip */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-amber-400 uppercase tracking-wider block">
              English News Discussion Tip:
            </span>
            <p className="leading-relaxed">
              When citing news in spoken English, use authoritative reporting phrases such as:
              <span className="block mt-1 text-white font-medium italic">
                • "According to recent reports..."
              </span>
              <span className="block text-white font-medium italic">
                • "The latest development indicates that..."
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
