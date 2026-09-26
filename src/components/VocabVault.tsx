import React, { useState, useMemo } from 'react';
import { VocabularyWord } from '../types';
import { SCENARIOS } from '../data/scenarios';
import { Search, Volume2, Sparkles, BookOpen, Layers, Check, Shuffle } from 'lucide-react';
import { playTextToSpeech } from '../utils/audio';

export const VocabVault: React.FC<{ audioSpeed: number }> = ({ audioSpeed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Extract all vocabulary words uniquely
  const allVocab = useMemo(() => {
    const list: VocabularyWord[] = [];
    const seen = new Set<string>();

    for (const scenario of SCENARIOS) {
      for (const v of scenario.keyVocabulary) {
        if (!seen.has(v.english.toLowerCase())) {
          seen.add(v.english.toLowerCase());
          list.push(v);
        }
      }
    }
    return list;
  }, []);

  const filteredVocab = useMemo(() => {
    return allVocab.filter((v) => {
      const q = searchQuery.toLowerCase();
      return (
        v.english.toLowerCase().includes(q) ||
        v.urdu.includes(q) ||
        v.romanUrdu.toLowerCase().includes(q) ||
        v.exampleSentence.toLowerCase().includes(q)
      );
    });
  }, [allVocab, searchQuery]);

  const handlePlay = (text: string) => {
    playTextToSpeech(text, 'en', audioSpeed);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredVocab.length);
  };

  const handleShuffleCards = () => {
    setIsFlipped(false);
    setCurrentCardIndex(Math.floor(Math.random() * filteredVocab.length));
  };

  const activeCard = filteredVocab[currentCardIndex] || filteredVocab[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>Vocabulary Vault · ضروری الفاظ کا خزانہ</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white">
              Daily-Use Vocabulary & Flashcards
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Curated everyday vocabulary extracted from all 50 daily scenarios. Listen to native pronunciation, memorize Urdu meanings, and flip interactive cards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlashcardMode(!isFlashcardMode)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
                isFlashcardMode
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>{isFlashcardMode ? 'View All Words' : 'Flashcard Test Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {isFlashcardMode && activeCard ? (
        /* Flashcard Mode */
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Card {currentCardIndex + 1} of {filteredVocab.length}
            </span>
            <button
              onClick={handleShuffleCards}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Shuffle
            </button>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[280px] rounded-2xl border border-slate-700 bg-slate-800/80 p-8 flex flex-col justify-between items-center text-center cursor-pointer shadow-xl hover:border-amber-500/50 transition-all select-none"
          >
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              {isFlipped ? 'Meaning in Urdu (معنی)' : 'English Word (انگریزی لفظ)'}
            </span>

            {!isFlipped ? (
              <div className="space-y-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {activeCard.english}
                </div>
                <span className="inline-block rounded-full bg-slate-700/60 px-3 py-1 text-xs text-slate-300">
                  {activeCard.partOfSpeech}
                </span>
                <p className="text-xs text-slate-400 italic">"{activeCard.exampleSentence}"</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-3xl sm:text-4xl font-bold font-urdu text-amber-300 leading-relaxed">
                  {activeCard.urdu}
                </div>
                <div className="text-sm font-mono text-slate-300">
                  Roman: {activeCard.romanUrdu}
                </div>
                <p className="text-xs font-urdu text-slate-300 max-w-sm">
                  {activeCard.urduMeaning}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(activeCard.english);
                }}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors p-2"
              >
                <Volume2 className="h-4 w-4" />
                Listen
              </button>
              <span className="text-xs text-slate-500">· Click card to flip ·</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : filteredVocab.length - 1));
              }}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNextCard}
              className="flex-1 rounded-xl bg-amber-500 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
            >
              Next Word
            </button>
          </div>
        </div>
      ) : (
        /* Grid Table Mode */
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vocabulary by English, Urdu, or Roman Urdu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVocab.map((w, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 hover:border-slate-700 hover:bg-slate-800/70 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-white">{w.english}</span>
                    <span className="text-xs text-slate-400 ml-1.5 font-normal">
                      ({w.partOfSpeech})
                    </span>
                  </div>
                  <button
                    onClick={() => handlePlay(w.english)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Listen to audio"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-urdu text-sm font-semibold text-amber-300">
                    {w.urdu}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{w.romanUrdu}</span>
                </div>

                <p className="text-xs text-slate-300 italic border-t border-slate-800 pt-2">
                  "{w.exampleSentence}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
