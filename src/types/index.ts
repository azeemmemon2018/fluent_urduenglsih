export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole: 'user' | 'npc';
  english: string;
  urdu: string;
  romanUrdu: string;
  tips?: string;
  audioPronunciationGuide?: string;
}

export interface VocabularyWord {
  english: string;
  urdu: string;
  romanUrdu: string;
  partOfSpeech: string;
  exampleSentence: string;
  urduMeaning: string;
}

export interface Scenario {
  id: string;
  title: string;
  titleUrdu: string;
  titleRomanUrdu: string;
  category: 'Shopping' | 'Medical' | 'Travel' | 'Dining' | 'Career' | 'Home' | 'Banking' | 'Daily Life';
  difficulty: DifficultyLevel;
  description: string;
  descriptionUrdu: string;
  dialogue: DialogueLine[];
  keyVocabulary: VocabularyWord[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  roleUrdu: string;
  setting: string;
  settingUrdu: string;
  avatarIcon: string;
  accentColor: string;
  greetingEnglish: string;
  greetingUrdu: string;
  greetingRomanUrdu: string;
  personaPrompt: string;
  suggestedQuestions: string[];
}

export interface FeedbackItem {
  type: 'grammar' | 'pronunciation' | 'vocabulary' | 'fluency';
  issue?: string;
  correctedText?: string;
  explanationUrdu: string;
  explanationRomanUrdu: string;
}

export interface SentenceMistake {
  mistake: string;
  correction: string;
  explanationUrdu: string;
  explanationRoman?: string;
}

export interface SentenceCorrection {
  hasMistakes: boolean;
  originalText: string;
  correctedSentence: string;
  mistakes: SentenceMistake[];
  explanationUrdu: string;
  explanationRoman?: string;
  fluencyScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'character' | 'system';
  englishText: string;
  urduText?: string;
  romanUrduText?: string;
  audioUrl?: string;
  timestamp: string;
  isVoiceInput?: boolean;
  userLanguageDetected?: 'english' | 'urdu' | 'roman_urdu' | 'mixed';
  englishTranslation?: string; // If user spoke Urdu, this shows what they said in English
  howToSayInEnglish?: string; // Polite coaching phrase
  correction?: SentenceCorrection; // Specific error breakdown for the user's sentence
  feedback?: {
    score: number;
    grammarNotesUrdu?: string;
    grammarNotesRoman?: string;
    pronunciationTipUrdu?: string;
    vocabularyLearned: VocabularyWord[];
  };
}

export interface GroundingSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface NewsDiscussionMessage {
  id: string;
  sender: 'user' | 'agent';
  englishText: string;
  urduText?: string;
  romanUrduText?: string;
  sources?: GroundingSource[];
  vocabularyWords?: VocabularyWord[];
  timestamp: string;
}

export interface SupportChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  urduText?: string;
  romanUrduText?: string;
  timestamp: string;
  category?: 'learning' | 'app_support' | 'grammar' | 'sentence_correction' | 'general';
  isVoiceInput?: boolean;
  correction?: SentenceCorrection;
  grammarBreakdown?: {
    topic: string;
    ruleEnglish: string;
    ruleUrdu: string;
    ruleRomanUrdu?: string;
    examples: { en: string; ur: string }[];
    commonMistakes?: string;
  };
}

export interface PronunciationDiagnostic {
  wordOrPhrase: string;
  overallScore: number;
  phoneticIPA: string;
  urduTransliteration: string;
  syllableStress: { syllable: string; stressed: boolean }[];
  articulatoryAdvice: {
    organ: string;
    guidanceUrdu: string;
    guidanceEnglish: string;
  }[];
  commonUrduSpeakerPitfall: string;
  minimalPairDrill: { pair: string; explanation: string }[];
  intonationPattern: string;
}

export interface PracticeSessionRecord {
  id: string;
  date: string;
  type: 'scenario' | 'roleplay' | 'pronunciation' | 'news';
  title: string;
  score: number;
  notes?: string;
}

export interface UserProgress {
  completedScenarioIds: string[];
  completedCharacterIds: string[];
  vocabularyBank: {
    word: VocabularyWord;
    mastered: boolean;
    dateAdded: string;
    practiceCount: number;
  }[];
  practiceSessions: PracticeSessionRecord[];
  streakDays: number;
  lastActiveDate: string;
  level: DifficultyLevel;
}
