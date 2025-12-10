import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, ClipboardList, MessageSquare, FileText, X, Send } from 'lucide-react';
import { useState } from 'react';

type ActionType = 'session' | 'assessment' | 'prompt' | 'note' | null;

const recentActions = [
  { id: 1, type: 'session', patient: 'Sarah Chen', action: 'Scheduled follow-up session', time: '2 hours ago', therapist: 'Dr. Martinez' },
  { id: 2, type: 'prompt', patient: 'Michael Torres', action: 'Sent meditation reminder', time: '5 hours ago', therapist: 'Dr. Martinez' },
  { id: 3, type: 'note', patient: 'Emma Williams', action: 'Added clinical note', time: '1 day ago', therapist: 'Dr. Martinez' },
  { id: 4, type: 'assessment', patient: 'James Anderson', action: 'Requested PHQ-9 assessment', time: '1 day ago', therapist: 'Dr. Martinez' },
  { id: 5, type: 'session', patient: 'Olivia Martinez', action: 'Completed therapy session', time: '2 days ago', therapist: 'Dr. Martinez' },
  { id: 6, type: 'prompt', patient: 'David Kim', action: 'Sent journaling prompt', time: '2 days ago', therapist: 'Dr. Martinez' },
];

const promptSuggestions = [
  'How are you feeling today?',
  'What brought you joy this week?',
  'Describe a moment of peace you experienced.',
  'What challenges are you currently facing?',
  'What are you grateful for today?',
];

export function TherapistActionsPanel() {
  const [activeModal, setActiveModal] = useState<ActionType>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'session': return <Calendar className="size-4" />;
      case 'assessment': return <ClipboardList className="size-4" />;
      case 'prompt': return <MessageSquare className="size-4" />;
      case 'note': return <FileText className="size-4" />;
      default: return null;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'session': return 'bg-orange-50 text-orange-600';
      case 'assessment': return 'bg-blue-50 text-blue-600';
      case 'prompt': return 'bg-green-50 text-green-600';
      case 'note': return 'bg-purple-50 text-purple-600';
      default: return 'bg-neutral-50 text-neutral-600';
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 p-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
              <ArrowLeft className="size-5" />
              <span>Back to Profile</span>
            </button>
            <div className="w-px h-6 bg-neutral-300" />
            <div>
              <h1 className="text-neutral-900 mb-1">Therapist Actions</h1>
              <p className="text-neutral-600">Sarah Chen • Quick Actions & History</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Action Buttons - Left 8 cols */}
          <div className="col-span-8 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
            >
              <h3 className="text-neutral-900 mb-6">Quick Actions</h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveModal('session')}
                  className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-2xl border border-orange-200 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="size-6 text-white" />
                  </div>
                  <p className="text-neutral-900 mb-1">Assign Session</p>
                  <p className="text-neutral-600 text-sm">Schedule therapy appointment</p>
                </button>

                <button
                  onClick={() => setActiveModal('assessment')}
                  className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl border border-blue-200 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ClipboardList className="size-6 text-white" />
                  </div>
                  <p className="text-neutral-900 mb-1">Request Assessment</p>
                  <p className="text-neutral-600 text-sm">Send PHQ-9, GAD-7, or custom</p>
                </button>

                <button
                  onClick={() => setActiveModal('prompt')}
                  className="p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl border border-green-200 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquare className="size-6 text-white" />
                  </div>
                  <p className="text-neutral-900 mb-1">Send Prompt</p>
                  <p className="text-neutral-600 text-sm">Journaling or reflection prompt</p>
                </button>

                <button
                  onClick={() => setActiveModal('note')}
                  className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl border border-purple-200 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="size-6 text-white" />
                  </div>
                  <p className="text-neutral-900 mb-1">Add Clinical Note</p>
                  <p className="text-neutral-600 text-sm">Document session or observation</p>
                </button>
              </div>
            </motion.div>

            {/* Prompt Modal Content (when active) */}
            <AnimatePresence>
              {activeModal === 'prompt' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="size-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-neutral-900">Send Prompt to Sarah Chen</h3>
                        <p className="text-neutral-600 text-sm">Choose a preset or write custom message</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <X className="size-5 text-neutral-600" />
                    </button>
                  </div>

                  {/* Preset Suggestions */}
                  <div className="mb-4">
                    <p className="text-neutral-700 text-sm mb-3">Suggested Prompts:</p>
                    <div className="space-y-2">
                      {promptSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedSuggestion(suggestion);
                            setCustomMessage(suggestion);
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-sm transition-all ${selectedSuggestion === suggestion
                              ? 'bg-green-50 border-green-300 text-green-900'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-green-200'
                            }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Message */}
                  <div className="mb-4">
                    <label className="text-neutral-700 text-sm mb-2 block">Custom Message:</label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Write a custom prompt or reflection question..."
                      className="w-full h-32 p-4 border border-neutral-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                      <Send className="size-4" />
                      Send Prompt
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Note Modal Content */}
            <AnimatePresence>
              {activeModal === 'note' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                        <FileText className="size-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-neutral-900">Add Clinical Note</h3>
                        <p className="text-neutral-600 text-sm">Document session or observation</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <X className="size-5 text-neutral-600" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="text-neutral-700 text-sm mb-2 block">Note Title:</label>
                    <input
                      type="text"
                      placeholder="e.g., Session Summary - Feb 20"
                      className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-neutral-700 text-sm mb-2 block">Note Content:</label>
                    <textarea
                      placeholder="Document observations, progress, concerns, or treatment plan updates..."
                      className="w-full h-40 p-4 border border-neutral-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors">
                      Save Note
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Actions Log - Right 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-4 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <h3 className="text-neutral-900 mb-6">Recent Actions</h3>

            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {recentActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-orange-200 hover:bg-orange-50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getActionColor(action.type)}`}>
                      {getActionIcon(action.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-900 text-sm mb-1 truncate">{action.patient}</p>
                      <p className="text-neutral-600 text-xs mb-2">{action.action}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-xs">{action.time}</span>
                        <span className="text-neutral-400 text-xs">{action.therapist}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors text-sm">
              View All Actions
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
