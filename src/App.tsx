/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SCENARIOS } from './data/scenarios';
import { CHARACTERS } from './data/characters';
import { Scenario, Character, DifficultyLevel, UserProgress, PracticeSessionRecord } from './types';
import { Navbar, ActiveNavTab } from './components/Navbar';
import { ScenarioList } from './components/ScenarioList';
import { ScenarioDetail } from './components/ScenarioDetail';
import { CharacterList } from './components/CharacterList';
import { RolePlayChat } from './components/RolePlayChat';
import { PronunciationCoach } from './components/PronunciationCoach';
import { VocabVault } from './components/VocabVault';
import { NewsAgent } from './components/NewsAgent';
import { LiveVoiceStudio } from './components/LiveVoiceStudio';
import { ProgressTracker } from './components/ProgressTracker';
import { SupportChat } from './components/SupportChat';
import { SentenceDoctorModal } from './components/SentenceDoctorModal';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [showUrduScript, setShowUrduScript] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isSentenceDoctorOpen, setIsSentenceDoctorOpen] = useState<boolean>(false);

  // User Learning Progress State
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('bolo_user_progress');
      if (saved) return JSON.parse(saved);
    } catch {}

    return {
      completedScenarioIds: ['scenario-01'],
      completedCharacterIds: ['shopkeeper'],
      vocabularyBank: [],
      practiceSessions: [
        {
          id: 'init-1',
          date: 'Today',
          type: 'scenario',
          title: 'At the Grocery Store',
          score: 92,
        },
      ],
      streakDays: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      level: 'Beginner',
    };
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem('bolo_user_progress', JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const handleCompleteScenario = (scenarioId: string) => {
    setProgress((prev) => {
      const completed = prev.completedScenarioIds.includes(scenarioId)
        ? prev.completedScenarioIds
        : [...prev.completedScenarioIds, scenarioId];

      const newSession: PracticeSessionRecord = {
        id: `sess-${Date.now()}`,
        date: 'Today',
        type: 'scenario',
        title: `Scenario completed: ${scenarioId}`,
        score: 95,
      };

      return {
        ...prev,
        completedScenarioIds: completed,
        practiceSessions: [...prev.practiceSessions, newSession],
      };
    });
  };

  const handleRecordPracticeSession = (title: string, score: number) => {
    setProgress((prev) => {
      const newSession: PracticeSessionRecord = {
        id: `sess-${Date.now()}`,
        date: 'Today',
        type: title.includes('Roleplay') ? 'roleplay' : title.includes('News') ? 'news' : 'pronunciation',
        title,
        score,
      };

      return {
        ...prev,
        practiceSessions: [...prev.practiceSessions, newSession],
      };
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your learning progress?')) {
      const fresh: UserProgress = {
        completedScenarioIds: [],
        completedCharacterIds: [],
        vocabularyBank: [],
        practiceSessions: [],
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        level: 'Beginner',
      };
      setProgress(fresh);
      try {
        localStorage.removeItem('bolo_user_progress');
      } catch {}
    }
  };

  const handleSelectNextScenario = () => {
    if (!selectedScenario) return;
    const currentIndex = SCENARIOS.findIndex((s) => s.id === selectedScenario.id);
    if (currentIndex >= 0 && currentIndex < SCENARIOS.length - 1) {
      setSelectedScenario(SCENARIOS[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const userProgressSummary = `Level: ${difficulty}, Scenarios completed: ${progress.completedScenarioIds.length}/50, Streak: ${progress.streakDays} days, Average accuracy: 90%.`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'scenarios') setSelectedScenario(null);
          if (tab !== 'characters') setSelectedCharacter(null);
        }}
        audioSpeed={audioSpeed}
        setAudioSpeed={setAudioSpeed}
        showUrduScript={showUrduScript}
        setShowUrduScript={setShowUrduScript}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenSentenceDoctor={() => setIsSentenceDoctorOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* MODE 1: 50 Daily Conversations */}
        {activeTab === 'scenarios' && (
          <>
            {selectedScenario ? (
              <ScenarioDetail
                scenario={selectedScenario}
                onBack={() => setSelectedScenario(null)}
                onComplete={handleCompleteScenario}
                audioSpeed={audioSpeed}
                showUrduScript={showUrduScript}
                onSelectNextScenario={handleSelectNextScenario}
              />
            ) : (
              <ScenarioList
                scenarios={SCENARIOS}
                onSelectScenario={(s) => setSelectedScenario(s)}
                completedScenarioIds={progress.completedScenarioIds}
              />
            )}
          </>
        )}

        {/* MODE 2: 20 Interactive Role-Play Characters */}
        {activeTab === 'characters' && (
          <CharacterList
            characters={CHARACTERS}
            onSelectCharacter={(c) => setSelectedCharacter(c)}
          />
        )}

        {/* Gemini Live Conversational Voice Experience */}
        {activeTab === 'live' && (
          <LiveVoiceStudio
            audioSpeed={audioSpeed}
            onRecordPracticeSession={handleRecordPracticeSession}
          />
        )}

        {/* Real-Time News & Google Search Grounding Agent */}
        {activeTab === 'news' && (
          <NewsAgent
            audioSpeed={audioSpeed}
            onRecordPracticeSession={handleRecordPracticeSession}
          />
        )}

        {/* Deep Phonetic Pronunciation Coach */}
        {activeTab === 'pronunciation' && (
          <PronunciationCoach
            audioSpeed={audioSpeed}
            onRecordPracticeSession={handleRecordPracticeSession}
          />
        )}

        {/* Vocabulary Vault & Flashcards */}
        {activeTab === 'vocab' && (
          <VocabVault audioSpeed={audioSpeed} />
        )}

        {/* Progress & Mastery Tracker */}
        {activeTab === 'progress' && (
          <ProgressTracker
            progress={progress}
            onResetProgress={handleResetProgress}
            onNavigateToScenario={() => {
              setActiveTab('scenarios');
              setSelectedScenario(null);
            }}
            onNavigateToCharacter={() => {
              setActiveTab('characters');
              setSelectedCharacter(null);
            }}
          />
        )}
      </main>

      {/* Dedicated Fresh Screen for Selected Role-Play Character */}
      {selectedCharacter && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col h-screen w-screen overflow-hidden animate-fadeIn">
          <RolePlayChat
            character={selectedCharacter}
            onBack={() => setSelectedCharacter(null)}
            audioSpeed={audioSpeed}
            showUrduScript={showUrduScript}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onRecordPracticeSession={handleRecordPracticeSession}
          />
        </div>
      )}

      {/* Floating Action Buttons for Ustad AI & Sentence Doctor */}
      {!selectedCharacter && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
          <button
            onClick={() => setIsSentenceDoctorOpen(true)}
            className="flex items-center gap-2 rounded-full bg-slate-900 border border-purple-500/50 px-3.5 py-2.5 text-xs font-bold text-purple-300 shadow-xl shadow-purple-500/10 hover:bg-slate-800 hover:scale-105 transition-all"
            title="جملہ بولیں اور غلطیاں درست کروائیں (Live Sentence Doctor)"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>🎙️ جملہ درست کریں</span>
          </button>

          <button
            onClick={() => setIsSupportOpen(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all border border-emerald-400/30"
            title="استاد AI اور گرامر ڈاکٹر (Chatbot & Grammar Coach)"
          >
            <div className="relative">
              <Bot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-300 animate-ping" />
            </div>
            <span>استاد AI & گرامر کوچ</span>
          </button>
        </div>
      )}

      {/* Context-Aware Ustad AI & Grammar Doctor Slideover Modal */}
      <SupportChat
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        audioSpeed={audioSpeed}
        userProgressSummary={userProgressSummary}
      />

      {/* Instant Sentence Doctor Modal */}
      <SentenceDoctorModal
        isOpen={isSentenceDoctorOpen}
        onClose={() => setIsSentenceDoctorOpen(false)}
        audioSpeed={audioSpeed}
      />
    </div>
  );
}
