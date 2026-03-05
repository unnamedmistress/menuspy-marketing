'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Brain, LayoutDashboard, MessageSquare, RefreshCw, Sparkles, Theater, TimerReset, TrendingUp } from 'lucide-react';

import ChatInterface from '@/components/ChatInterface';
import PermitCard from '@/components/PermitCard';
import PredictionCard from '@/components/PredictionCard';
import TheaterStage from '@/components/TheaterStage';
import TimeMachine from '@/components/TimeMachine';
import PermitForm from '@/components/forms/PermitForm';
import { routeChatMessage } from '@/lib/chat-router';
import { analyzeIntentHeuristic } from '@/lib/intent-detection';
import { evaluateIntent } from '@/lib/rule-engine';
import { advancePermit } from '@/lib/status-pipeline';
import { loadDemoState, resetDemoState, saveDemoState } from '@/lib/storage';
import { ChatMessage, Permit, Prediction } from '@/types';

const tabs = ['overview', 'theater', 'analytics'] as const;

type Tab = (typeof tabs)[number];

export default function HomePage() {
  const [boot] = useState(() => loadDemoState());
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [permits, setPermits] = useState<Permit[]>(boot.permits);
  const [predictions, setPredictions] = useState<Prediction[]>(boot.predictions);
  const [chat, setChat] = useState<ChatMessage[]>(boot.chat);
  const [historical] = useState(boot.historical);
  const [projectText, setProjectText] = useState('Build a 240 sqft backyard deck with stairs in Seattle');
  const [editing, setEditing] = useState<Permit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatTyping, setChatTyping] = useState(false);

  const activePermit = useMemo(() => permits.find((item) => item.status !== 'APPROVED') ?? permits[0], [permits]);

  function persist(nextPermits: Permit[], nextPredictions: Prediction[], nextChat: ChatMessage[]) {
    saveDemoState({ permits: nextPermits, predictions: nextPredictions, chat: nextChat, historical });
  }

  function runPrediction() {
    const intent = analyzeIntentHeuristic(projectText);
    const generated = evaluateIntent(intent);
    const nextPredictions = [...generated, ...predictions].slice(0, 8);
    setPredictions(nextPredictions);
    persist(permits, nextPredictions, chat);
  }

  function upsertPermit(next: Permit) {
    const exists = permits.some((item) => item.id === next.id);
    const nextPermits = exists ? permits.map((item) => (item.id === next.id ? next : item)) : [next, ...permits];
    setPermits(nextPermits);
    setShowForm(false);
    setEditing(null);
    persist(nextPermits, predictions, chat);
  }

  function removePermit(id: string) {
    const nextPermits = permits.filter((item) => item.id !== id);
    setPermits(nextPermits);
    persist(nextPermits, predictions, chat);
  }

  function nextStage(id: string) {
    const nextPermits = permits.map((item) => (item.id === id ? advancePermit(item) : item));
    setPermits(nextPermits);
    persist(nextPermits, predictions, chat);
  }

  function sendChat(input: string) {
    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    const interim = [...chat, userMessage];
    setChat(interim);
    setChatTyping(true);

    setTimeout(() => {
      const response = routeChatMessage(input, permits, predictions);
      const nextChat = [...interim, response];
      setChat(nextChat);
      setChatTyping(false);
      persist(permits, predictions, nextChat);
    }, 500);
  }

  function resetAll() {
    const seed = resetDemoState();
    setPermits(seed.permits);
    setPredictions(seed.predictions);
    setChat(seed.chat);
    setProjectText('Build a 240 sqft backyard deck with stairs in Seattle');
    setEditing(null);
    setShowForm(false);
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">PermitFlow Demo</h1>
              <p className="text-sm text-slate-600">Public sandbox. No authentication required.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={runPrediction} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                <Brain size={16} /> Analyze Intent
              </button>
              <button onClick={() => setShowChat((prev) => !prev)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800">
                <MessageSquare size={16} /> Concierge
              </button>
              <button onClick={resetAll} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800">
                <TimerReset size={16} /> Reset Demo
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-slate-700'
                }`}
              >
                {tab === 'overview' ? <LayoutDashboard size={14} className="mr-1 inline" /> : null}
                {tab === 'theater' ? <Theater size={14} className="mr-1 inline" /> : null}
                {tab === 'analytics' ? <TrendingUp size={14} className="mr-1 inline" /> : null}
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <section className="mt-5 grid gap-4 md:grid-cols-4">
          <Stat title="Permits" value={String(permits.length)} icon={<LayoutDashboard size={16} />} />
          <Stat title="Predictions" value={String(predictions.length)} icon={<Sparkles size={16} />} />
          <Stat title="In Progress" value={String(permits.filter((item) => item.status !== 'APPROVED').length)} icon={<RefreshCw size={16} />} />
          <Stat title="Avg ETA" value={`${Math.round(permits.reduce((sum, p) => sum + p.estimatedDays, 0) / Math.max(1, permits.length))}d`} icon={<TrendingUp size={16} />} />
        </section>

        {activeTab === 'overview' ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-5">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Epic 2: PermitFlow AI Predictions</h2>
                <p className="mt-1 text-sm text-slate-600">Describe project intent. Rule engine returns permit matches and confidence.</p>
                <textarea
                  className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                  value={projectText}
                  onChange={(event) => setProjectText(event.target.value)}
                />
              </article>

              <article className="space-y-3">
                {predictions.map((prediction) => (
                  <PredictionCard key={prediction.id} prediction={prediction} />
                ))}
              </article>
            </div>

            <div className="space-y-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Epic 6: Permit CRUD</h2>
                  <button
                    onClick={() => {
                      setEditing(null);
                      setShowForm((prev) => !prev);
                    }}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    {showForm ? 'Close' : 'New Permit'}
                  </button>
                </div>
                {showForm ? <PermitForm initial={editing} onSave={upsertPermit} onCancel={() => setShowForm(false)} /> : null}
              </article>

              <div className="space-y-3">
                {permits.map((permit) => (
                  <PermitCard
                    key={permit.id}
                    permit={permit}
                    onAdvance={nextStage}
                    onEdit={(item) => {
                      setEditing(item);
                      setShowForm(true);
                    }}
                    onDelete={removePermit}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'theater' && activePermit ? (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Epic 4: Permit Theater Visualization</h2>
            <TheaterStage permit={activePermit} />
          </motion.section>
        ) : null}

        {activeTab === 'analytics' ? (
          <section className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Epic 5: Time Machine Analytics</h2>
            <TimeMachine permit={activePermit} historical={historical} />
          </section>
        ) : null}
      </div>

      {showChat ? (
        <div className="fixed bottom-4 right-4 z-40 w-[min(420px,95vw)]">
          <ChatInterface messages={chat} isTyping={chatTyping} onSend={sendChat} onClose={() => setShowChat(false)} />
        </div>
      ) : null}
    </main>
  );
}

function Stat({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="inline-flex items-center gap-2 text-sm text-slate-600">{icon} {title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}
