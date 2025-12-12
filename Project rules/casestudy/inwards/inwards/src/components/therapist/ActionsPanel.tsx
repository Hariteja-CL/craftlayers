import { useState } from 'react';
import { BookOpen, Send, ClipboardCheck, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ActionType = 'module' | 'prompt' | 'assessment' | 'note' | null;

export function ActionsPanel() {
  const [activeModal, setActiveModal] = useState<ActionType>(null);
  const [formData, setFormData] = useState({
    module: '',
    prompt: '',
    assessmentType: '',
    note: '',
  });

  const handleSubmit = (type: ActionType) => {
    // Handle form submission
    console.log(`Submitting ${type}:`, formData);
    setActiveModal(null);
    // Reset form
    setFormData({
      module: '',
      prompt: '',
      assessmentType: '',
      note: '',
    });
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-2">Therapist Actions</h2>
        <p className="text-neutral-600">Manage patient care and assign therapeutic activities</p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Assign Module */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-50 rounded-xl">
              <BookOpen className="size-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-neutral-900 mb-1">Assign Module</h3>
              <p className="text-neutral-600 text-sm">
                Assign therapeutic modules, exercises, or educational content to patients
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('module')}
            className="w-full px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            Assign New Module
          </button>
        </motion.div>

        {/* Send Prompt */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Send className="size-6 text-indigo-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-neutral-900 mb-1">Send Journal Prompt</h3>
              <p className="text-neutral-600 text-sm">
                Send a custom journaling prompt to encourage reflection and self-awareness
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('prompt')}
            className="w-full px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Create Prompt
          </button>
        </motion.div>

        {/* Request Assessment */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-green-50 rounded-xl">
              <ClipboardCheck className="size-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-neutral-900 mb-1">Request Assessment</h3>
              <p className="text-neutral-600 text-sm">
                Request clinical assessments or self-report measures from patients
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('assessment')}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          >
            Request Assessment
          </button>
        </motion.div>

        {/* Add Note */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-orange-50 rounded-xl">
              <FileText className="size-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-neutral-900 mb-1">Add Clinical Note</h3>
              <p className="text-neutral-600 text-sm">
                Document session notes, observations, or treatment plan updates
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('note')}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Add Note
          </button>
        </motion.div>
      </div>

      {/* Recent Actions */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-neutral-900 mb-6">Recent Actions</h3>
        <div className="space-y-3">
          {[
            { type: 'Module', patient: 'Sarah Mitchell', action: 'Assigned: Mindfulness Basics', time: '2 hours ago' },
            { type: 'Prompt', patient: 'James Chen', action: 'Sent: Daily Gratitude Exercise', time: '5 hours ago' },
            { type: 'Assessment', patient: 'Emily Rodriguez', action: 'Requested: PHQ-9 Assessment', time: '1 day ago' },
            { type: 'Note', patient: 'Michael Thompson', action: 'Added: Session Notes', time: '2 days ago' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-lg">
                    {item.type}
                  </span>
                  <span className="text-neutral-900 text-sm">{item.patient}</span>
                </div>
                <p className="text-neutral-600 text-sm">{item.action}</p>
              </div>
              <span className="text-neutral-500 text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-over Modals */}
      <AnimatePresence>
        {activeModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Slide-over Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-200">
                  <h3 className="text-neutral-900">
                    {activeModal === 'module' && 'Assign Module'}
                    {activeModal === 'prompt' && 'Send Journal Prompt'}
                    {activeModal === 'assessment' && 'Request Assessment'}
                    {activeModal === 'note' && 'Add Clinical Note'}
                  </h3>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <X className="size-5 text-neutral-500" />
                  </button>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {/* Patient Selection */}
                  <div>
                    <label className="block text-neutral-700 text-sm mb-2">Select Patient</label>
                    <select className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Sarah Mitchell</option>
                      <option>James Chen</option>
                      <option>Emily Rodriguez</option>
                      <option>Michael Thompson</option>
                    </select>
                  </div>

                  {/* Module-specific fields */}
                  {activeModal === 'module' && (
                    <div>
                      <label className="block text-neutral-700 text-sm mb-2">Select Module</label>
                      <select
                        value={formData.module}
                        onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Choose a module...</option>
                        <option>Mindfulness Basics</option>
                        <option>Cognitive Restructuring</option>
                        <option>Breathing Techniques</option>
                        <option>Sleep Hygiene</option>
                      </select>
                    </div>
                  )}

                  {/* Prompt-specific fields */}
                  {activeModal === 'prompt' && (
                    <div>
                      <label className="block text-neutral-700 text-sm mb-2">Journal Prompt</label>
                      <textarea
                        value={formData.prompt}
                        onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                        placeholder="Enter your journal prompt..."
                        rows={6}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  )}

                  {/* Assessment-specific fields */}
                  {activeModal === 'assessment' && (
                    <div>
                      <label className="block text-neutral-700 text-sm mb-2">Assessment Type</label>
                      <select
                        value={formData.assessmentType}
                        onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Choose assessment...</option>
                        <option>PHQ-9 (Depression)</option>
                        <option>GAD-7 (Anxiety)</option>
                        <option>PSS (Stress)</option>
                        <option>WEMWBS (Wellbeing)</option>
                      </select>
                    </div>
                  )}

                  {/* Note-specific fields */}
                  {activeModal === 'note' && (
                    <div>
                      <label className="block text-neutral-700 text-sm mb-2">Clinical Note</label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Enter session notes, observations, or treatment updates..."
                        rows={8}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      />
                    </div>
                  )}

                  {/* Due Date */}
                  {(activeModal === 'module' || activeModal === 'assessment') && (
                    <div>
                      <label className="block text-neutral-700 text-sm mb-2">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}

                  {/* Notes/Instructions */}
                  <div>
                    <label className="block text-neutral-700 text-sm mb-2">
                      {activeModal === 'note' ? 'Additional Notes' : 'Instructions (Optional)'}
                    </label>
                    <textarea
                      placeholder="Add any additional notes or instructions..."
                      rows={3}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-neutral-200">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit(activeModal)}
                    className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
