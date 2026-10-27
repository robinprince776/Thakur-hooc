import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, BookOpen, Stethoscope } from 'lucide-react';

interface MediCoreDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const MediCoreDisclaimerModal: React.FC<MediCoreDisclaimerModalProps> = ({
  isOpen,
  onAccept
}) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-teal-500/30 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col space-y-6">
        {/* Header with Icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-teal-950 text-teal-300 border border-teal-700">
                MediCore Pro
              </span>
              <span className="text-xs text-slate-400">Clinical Reference Standard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Clinical &amp; Legal Disclaimer
            </h2>
          </div>
        </div>

        {/* Disclaimer Text Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Strict Reference &amp; Educational Purpose Only:</strong>{' '}
              MediCore Pro is an academic and clinical reference tool designed for registered pharmacists,
              pharmacy professionals (D-Pharma/B-Pharma), and healthcare trainees.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <Stethoscope className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">No Medical Prescription:</strong> This application does{' '}
              <strong className="text-rose-400">NOT</strong> diagnose patients, provide medical advice,
              or generate automatic prescriptions. It does not replace the expert clinical diagnosis of a
              Registered Medical Practitioner (RMP).
            </span>
          </p>

          <p className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Professional Responsibility:</strong> Dosage guidelines,
              contraindications, and drug interactions are for general pharmacological reference. Always
              cross-verify against official manufacturer packaging and national pharmacopeial standards.
            </span>
          </p>
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-slate-700 text-teal-500 focus:ring-teal-400 bg-slate-950 accent-teal-500 cursor-pointer"
          />
          <span className="text-xs text-slate-300 font-medium">
            I understand that MediCore Pro is strictly for academic and professional pharmacy reference.
            I will always adhere to statutory drug dispensing laws and physician oversight.
          </span>
        </label>

        {/* Accept Button */}
        <button
          disabled={!isChecked}
          onClick={onAccept}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            isChecked
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 shadow-teal-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I Acknowledge &amp; Enter MediCore Pro</span>
        </button>
      </div>
    </div>
  );
};
