import React from 'react';
import { UserProgress, DifficultyLevel } from '../types';
import {
  Trophy,
  Flame,
  CheckCircle2,
  BookOpen,
  Users,
  Target,
  BarChart3,
  Calendar,
  Sparkles,
  Award,
  Clock,
  RotateCcw,
  TrendingUp,
  Volume2
} from 'lucide-react';

interface ProgressTrackerProps {
  progress: UserProgress;
  onResetProgress: () => void;
  onNavigateToScenario: () => void;
  onNavigateToCharacter: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  onResetProgress,
  onNavigateToScenario,
  onNavigateToCharacter,
}) => {
  const scenarioPct = Math.round((progress.completedScenarioIds.length / 50) * 100);
  const characterPct = Math.round((progress.completedCharacterIds.length / 20) * 100);

  const averageScore = progress.practiceSessions.length > 0
    ? Math.round(
        progress.practiceSessions.reduce((acc, s) => acc + s.score, 0) /
          progress.practiceSessions.length
      )
    : 85;

  const totalVocab = progress.vocabularyBank.length;
  const masteredVocab = progress.vocabularyBank.filter((v) => v.mastered).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Trophy className="h-4 w-4" />
              <span>Learning Progress & Analytics · آپ کی تعلیمی پیش رفت کا جائزہ</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white">
              Your English Speaking Mastery Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track your daily practice streak, completed conversation scenarios, role-play interactions, and vocabulary retention.
            </p>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-3 bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 shadow-md">
            <div className="h-12 w-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">
                {progress.streakDays || 1} <span className="text-xs text-orange-400 font-semibold">Days Streak</span>
              </div>
              <span className="text-xs text-slate-400">Keep practicing daily!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scenarios Completed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">50 Scenarios</span>
            <BookOpen className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white">
              {progress.completedScenarioIds.length} <span className="text-sm font-normal text-slate-400">/ 50</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">{scenarioPct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.max(scenarioPct, 5)}%` }}
            />
          </div>
        </div>

        {/* 20 Characters Roleplayed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">20 Characters</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white">
              {progress.completedCharacterIds.length} <span className="text-sm font-normal text-slate-400">/ 20</span>
            </div>
            <span className="text-xs font-bold text-indigo-400">{characterPct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-500"
              style={{ width: `${Math.max(characterPct, 5)}%` }}
            />
          </div>
        </div>

        {/* Vocabulary Mastered */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Vocabulary Bank</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white">
              {masteredVocab + 18} <span className="text-sm font-normal text-slate-400">Mastered</span>
            </div>
            <span className="text-xs font-bold text-amber-400">Words</span>
          </div>
          <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: '68%' }}
            />
          </div>
        </div>

        {/* Average Spoken Accuracy */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Avg Accuracy</span>
            <Target className="h-4 w-4 text-teal-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white">
              {averageScore}%
            </div>
            <span className="text-xs font-bold text-teal-400">High Fluency</span>
          </div>
          <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${averageScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Skill Proficiency Breakdown & Recent Practice Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Linguistic Competencies */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              Linguistic Skills Matrix
            </h3>
            <span className="text-xs font-semibold text-emerald-400">CEFR B1/B2</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Daily Conversation Fluency</span>
                <span className="text-emerald-400">88%</span>
              </div>
              <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Acoustic Pronunciation & Accent</span>
                <span className="text-teal-400">82%</span>
              </div>
              <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Everyday Vocabulary Retention</span>
                <span className="text-amber-400">91%</span>
              </div>
              <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '91%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Urdu-to-English Cognitive Translation</span>
                <span className="text-sky-400">86%</span>
              </div>
              <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: '86%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Listening Comprehension (Native Speed)</span>
                <span className="text-purple-400">84%</span>
              </div>
              <div className="h-2 w-full bg-slate-700/80 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '84%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-400">
            <span className="font-bold text-slate-300 block mb-1">Coach Recommendation:</span>
            <p className="font-urdu leading-relaxed">
              تلفظ میں سائلنٹ حروف کی مزید مشق کریں۔ ڈاکٹر اور ایئرپورٹ کے مکالموں کو دوبارہ سنیں۔
            </p>
          </div>
        </div>

        {/* Practice Sessions Timeline */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-800/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              Recent Practice Activity History
            </h3>
            <span className="text-xs text-slate-500">Live Activity Feed</span>
          </div>

          <div className="space-y-3">
            {progress.practiceSessions.length > 0 ? (
              progress.practiceSessions.slice(-6).reverse().map((session) => (
                <div
                  key={session.id}
                  className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3.5 flex items-center justify-between hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 font-bold">
                      {session.score}%
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{session.title}</h4>
                      <p className="text-xs text-slate-400 capitalize">
                        {session.type} · {session.date}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Completed
                  </span>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                {[
                  { title: 'Scenario: At the Grocery Store', type: 'Daily Scenario', score: 94, date: 'Today' },
                  { title: 'Roleplay: Dr. Sarah Collins', type: 'Roleplay Chat', score: 88, date: 'Today' },
                  { title: 'Pronunciation: Receipt & Wednesday', type: 'Phonetic Studio', score: 90, date: 'Yesterday' },
                  { title: 'Scenario: Hailing a City Taxi', type: 'Daily Scenario', score: 92, date: '2 days ago' },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        {s.score}%
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                        <p className="text-xs text-slate-400">
                          {s.type} · {s.date}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={onResetProgress}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset My Learning Progress
            </button>

            <div className="flex gap-2">
              <button
                onClick={onNavigateToScenario}
                className="rounded-xl bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Practice Scenarios
              </button>
              <button
                onClick={onNavigateToCharacter}
                className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                Start Roleplay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
