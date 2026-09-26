import React, { useState } from 'react';
import { Character } from '../types';
import {
  Store,
  Stethoscope,
  Car,
  UtensilsCrossed,
  Building,
  Plane,
  Landmark,
  Bus,
  Briefcase,
  Package,
  UserCheck,
  Coffee,
  Key,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Dumbbell,
  Scissors,
  GraduationCap,
  HeartHandshake,
  Search,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Mic
} from 'lucide-react';

interface CharacterListProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
}

// Icon mapper for characters
const ICON_MAP: Record<string, React.ReactNode> = {
  Store: <Store className="h-6 w-6 text-amber-400" />,
  Stethoscope: <Stethoscope className="h-6 w-6 text-teal-400" />,
  Car: <Car className="h-6 w-6 text-yellow-400" />,
  UtensilsCrossed: <UtensilsCrossed className="h-6 w-6 text-rose-400" />,
  Building: <Building className="h-6 w-6 text-indigo-400" />,
  Plane: <Plane className="h-6 w-6 text-sky-400" />,
  Landmark: <Landmark className="h-6 w-6 text-emerald-400" />,
  Bus: <Bus className="h-6 w-6 text-orange-400" />,
  Briefcase: <Briefcase className="h-6 w-6 text-slate-300" />,
  Package: <Package className="h-6 w-6 text-red-400" />,
  UserCheck: <UserCheck className="h-6 w-6 text-blue-400" />,
  Coffee: <Coffee className="h-6 w-6 text-cyan-400" />,
  Key: <Key className="h-6 w-6 text-stone-300" />,
  Wrench: <Wrench className="h-6 w-6 text-amber-500" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-blue-400" />,
  ShieldAlert: <ShieldAlert className="h-6 w-6 text-indigo-400" />,
  Dumbbell: <Dumbbell className="h-6 w-6 text-violet-400" />,
  Scissors: <Scissors className="h-6 w-6 text-teal-300" />,
  GraduationCap: <GraduationCap className="h-6 w-6 text-emerald-400" />,
  HeartHandshake: <HeartHandshake className="h-6 w-6 text-rose-400" />,
};

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onSelectCharacter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'تمام کردار (All)' },
    { id: 'Daily', label: 'روزمرہ زندگی (Daily)' },
    { id: 'Services', label: 'خدمات و شاپنگ (Services)' },
    { id: 'Professional', label: 'ملازمت و انٹرویو (Jobs)' },
    { id: 'Travel', label: 'سفر و ہوٹل (Travel)' }
  ];

  const filteredCharacters = characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roleUrdu.includes(searchQuery) ||
      c.setting.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Daily') {
      return ['shopkeeper', 'neighbor', 'barber', 'mechanic'].includes(c.id);
    }
    if (selectedCategory === 'Services') {
      return ['doctor', 'waiter', 'cashier', 'delivery', 'fitness_trainer'].includes(c.id);
    }
    if (selectedCategory === 'Professional') {
      return ['interviewer', 'colleague', 'bank_manager', 'teacher'].includes(c.id);
    }
    if (selectedCategory === 'Travel') {
      return ['taxi_driver', 'pilot', 'hotel_receptionist', 'immigration_officer'].includes(c.id);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Friendly Welcoming Header Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>20 INTERACTIVE CHARACTERS · 20 لائیو کردار</span>
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-white">
          کرداروں سے حقیقی بول چال کی پریکٹس
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
          کسی بھی کردار پر کلک کریں — گفتگو ایک <strong className="text-emerald-400">مکمل فریش اسکرین</strong> پر کھلے گی جہاں آپ بلا رکاوٹ صرف اسی کردار سے مائیک اور چیٹ کے ذریعے بول سکتے ہیں۔
          (Click any character to open a fresh, dedicated screen focused entirely on your live conversation).
        </p>

        {/* 3 Step Beginner Guide */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2 border border-slate-700/60 text-xs">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-bold shrink-0">1</span>
            <span className="text-slate-200">کوئی بھی کردار منتخب کریں</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2 border border-slate-700/60 text-xs">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold shrink-0">2</span>
            <span className="text-slate-200">مائیک دبا کر انگلش یا اردو بولیں</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2 border border-slate-700/60 text-xs">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white font-bold shrink-0">3</span>
            <span className="text-slate-200">آواز سنیں اور غلطی درست کریں</span>
          </div>
        </div>
      </div>

      {/* Search Input & Category Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="کردار تلاش کریں (مثلاً: ڈاکٹر، Taxi, Airport, دکاندار، انٹرویو)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 20 Characters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCharacters.map((char, index) => {
          return (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-800/40 p-5 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/10"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/80 shadow-inner group-hover:scale-105 transition-transform">
                    {ICON_MAP[char.avatarIcon] || <MessageSquare className="h-6 w-6 text-indigo-400" />}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {char.role}
                  </h3>
                  <p className="text-xs font-urdu font-medium text-emerald-400">
                    {char.roleUrdu}
                  </p>
                  <p className="text-xs text-slate-300 font-medium">
                    {char.name}
                  </p>
                </div>

                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1 line-clamp-1">
                  <span className="text-slate-500">Setting:</span>
                  <span>{char.setting}</span>
                </p>

                <p className="mt-2 text-xs text-slate-400/90 italic line-clamp-2">
                  "{char.greetingEnglish}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1.5">
                  <Mic className="h-4 w-4 text-emerald-400" />
                  <span>بات شروع کریں (Start Chat)</span>
                </span>
                <span className="rounded-lg bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span>کھولیں</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
