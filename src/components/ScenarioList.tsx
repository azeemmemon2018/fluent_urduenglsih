import React, { useState, useMemo } from 'react';
import { Scenario } from '../types';
import { Search, ChevronRight, CheckCircle2, Sparkles, Filter, BookOpen } from 'lucide-react';

interface ScenarioListProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  completedScenarioIds: string[];
}

export const ScenarioList: React.FC<ScenarioListProps> = ({
  scenarios,
  onSelectScenario,
  completedScenarioIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', 'Shopping', 'Medical', 'Travel', 'Dining', 'Career', 'Home', 'Banking', 'Daily Life'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.titleUrdu.includes(searchQuery) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.descriptionUrdu.includes(searchQuery);

      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || s.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [scenarios, searchQuery, selectedCategory, selectedDifficulty]);

  const completionPercentage = Math.round(
    (completedScenarioIds.length / scenarios.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Banner & Stats */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>50 DAILY ENGLISH SCENARIOS · 50 روزمرہ مکالمے</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white">
              روزمرہ زندگی میں روانی سے انگلش بولیں
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
              دکان، ہسپتال، سفر، دفتر اور گھریلو گفتگو کے لیے جملہ بہ جملہ انگریزی اور اردو آواز سنیں اور مکمل روانی سے بولنا سیکھیں۔
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 min-w-[220px]">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span className="font-semibold">مکمل شدہ (Completed)</span>
                <span className="text-emerald-400 font-bold">{completedScenarioIds.length} / {scenarios.length}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block text-right font-mono">
                {completionPercentage}% مکمل
              </span>
            </div>
          </div>
        </div>

        {/* 3 Step Beginner Guide */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/70 px-3 py-2 border border-slate-700/60 text-xs">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold shrink-0">1</span>
            <span className="text-slate-200">کوئی بھی روزمرہ موضوع منتخب کریں</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/70 px-3 py-2 border border-slate-700/60 text-xs">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-bold shrink-0">2</span>
            <span className="text-slate-200">▶ "پوری گفتگو سنیں" کا بٹن دبائیں</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/70 px-3 py-2 border border-slate-700/60 text-xs">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white font-bold shrink-0">3</span>
            <span className="text-slate-200">مائیک کے ذریعے جملے خود بولیں</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search scenarios in English or Urdu (e.g., Grocery, ڈاکٹر, Airport, کرایہ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Difficulties' : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenarios.map((scenario, index) => {
          const isCompleted = completedScenarioIds.includes(scenario.id);

          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-5 hover:border-emerald-500/50 hover:bg-slate-800/70 transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-emerald-400 font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>·</span>
                    <span className="text-slate-300">{scenario.category}</span>
                    <span>·</span>
                    <span
                      className={`${
                        scenario.difficulty === 'Beginner'
                          ? 'text-teal-400'
                          : scenario.difficulty === 'Intermediate'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {scenario.difficulty}
                    </span>
                  </div>

                  {isCompleted && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Done</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {scenario.title}
                </h3>
                <p className="mt-1 text-sm font-urdu font-medium text-emerald-400/90 leading-relaxed">
                  {scenario.titleUrdu}
                </p>

                <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                  {scenario.dialogue.length} dialogue turns
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Start Practice
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="py-16 text-center text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-800">
          <BookOpen className="h-10 w-10 mx-auto text-slate-600 mb-3" />
          <p className="text-base font-medium text-slate-300">No scenarios found</p>
          <p className="text-xs text-slate-500 mt-1">Try searching with different English or Urdu terms</p>
        </div>
      )}
    </div>
  );
};
