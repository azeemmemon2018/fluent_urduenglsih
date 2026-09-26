import React from 'react';
import {
  MessageSquare,
  Users,
  Mic,
  BookOpen,
  Volume2,
  Globe,
  Radio,
  Newspaper,
  Trophy,
  Bot,
  Sliders,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { DifficultyLevel } from '../types';

export type ActiveNavTab =
  | 'scenarios'
  | 'characters'
  | 'live'
  | 'news'
  | 'pronunciation'
  | 'vocab'
  | 'progress';

interface NavbarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
  showUrduScript: boolean;
  setShowUrduScript: (show: boolean) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  onOpenSupport: () => void;
  onOpenSentenceDoctor?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  audioSpeed,
  setAudioSpeed,
  showUrduScript,
  setShowUrduScript,
  difficulty,
  setDifficulty,
  onOpenSupport,
  onOpenSentenceDoctor,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('scenarios')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
            <span className="text-xl">ب</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">BoloEnglish</span>
              <span className="text-xs font-urdu font-semibold text-emerald-400">بولو انگلش</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden lg:block leading-none mt-0.5">
              English Roleplay & Speaking Coach for Urdu Speakers
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none px-2">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              activeTab === 'scenarios'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>50 Scenarios</span>
            </div>
            <span className="text-[10px] font-urdu text-emerald-300/80 leading-none mt-0.5">روزمرہ گفتگو</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              activeTab === 'characters'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Users className="h-3.5 w-3.5" />
              <span>20 Characters</span>
            </div>
            <span className="text-[10px] font-urdu text-indigo-300/80 leading-none mt-0.5">کرداروں سے بات</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              activeTab === 'live'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Radio className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              <span>Live Voice</span>
            </div>
            <span className="text-[10px] font-urdu text-purple-300/80 leading-none mt-0.5">براہ راست بولیں</span>
          </button>

          <button
            onClick={() => setActiveTab('pronunciation')}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              activeTab === 'pronunciation'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Mic className="h-3.5 w-3.5" />
              <span>Pronunciation</span>
            </div>
            <span className="text-[10px] font-urdu text-teal-300/80 leading-none mt-0.5">تلفظ کوچ</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              activeTab === 'news'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Newspaper className="h-3.5 w-3.5 text-sky-400" />
              <span>Daily News</span>
            </div>
            <span className="text-[10px] font-urdu text-sky-300/80 leading-none mt-0.5">تازہ خبریں</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              activeTab === 'vocab'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Vocab</span>
            </div>
            <span className="text-[10px] font-urdu text-amber-300/80 leading-none mt-0.5">الفاظ کا ذخیرہ</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              activeTab === 'progress'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Progress</span>
            </div>
            <span className="text-[10px] font-urdu text-emerald-300/80 leading-none mt-0.5">میری ترقی</span>
          </button>
        </nav>

        {/* Global Controls & Support Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio Speed Toggle (Fast / Slow) */}
          <button
            onClick={() => setAudioSpeed(audioSpeed === 1.0 ? 0.8 : 1.0)}
            className="flex items-center gap-1 rounded-xl bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            title="Toggle normal speed vs slower speed for beginners"
          >
            <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{audioSpeed === 1.0 ? '1x عام' : '0.8x آہستہ'}</span>
          </button>

          {/* Difficulty Level Dropdown */}
          <div className="relative hidden sm:block">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="appearance-none rounded-xl bg-slate-800 border border-slate-700/80 pl-2.5 pr-6 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              title="Change Learning Difficulty Level"
            >
              <option value="Beginner">آسان (Beginner)</option>
              <option value="Intermediate">درمیانہ (Intermediate)</option>
              <option value="Advanced">مشکل (Advanced)</option>
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sentence Doctor Button */}
          {onOpenSentenceDoctor && (
            <button
              onClick={onOpenSentenceDoctor}
              className="flex items-center gap-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 px-2.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/30 transition-all shadow-sm"
              title="جملہ بولیں اور غلطیاں درست کروائیں (Sentence Doctor)"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">جملہ درست کریں</span>
            </button>
          )}

          {/* Context-Aware Ustad AI & Grammar Doctor Button */}
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-1.5 text-xs font-bold text-white hover:opacity-95 transition-all shadow-sm shadow-emerald-600/20"
            title="استاد AI اور گرامر ڈاکٹر (Chatbot & Grammar Coach)"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>استاد AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
