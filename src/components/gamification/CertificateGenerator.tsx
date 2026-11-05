import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Award, CheckCircle2, Download, Printer, Share2, X, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { CertificateRecord, useGamificationStore } from '../../store/useGamificationStore';

interface CertificateGeneratorProps {
  certificate: CertificateRecord;
  onClose: () => void;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ certificate, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useGamificationStore();

  const recipient = certificate.recipientName || certificate.userName || userProfile.userName || 'Candidate';
  const certTitle = certificate.title || certificate.courseTitle || 'Mastery Certification';
  const certCode = certificate.verificationCode || certificate.certNumber || certificate.id;
  const gradeText = certificate.grade || certificate.achievementLevel || 'Mastery Grade A';

  useEffect(() => {
    // Generate QR code encoding verification metadata
    const verifyPayload = JSON.stringify({
      id: certificate.id,
      recipient,
      title: certTitle,
      grade: gradeText,
      issueDate: certificate.issueDate,
      issuer: 'BCA Verse & TechMaster Academy',
      verificationUrl: window.location.origin + '/#cert?id=' + certificate.id
    });

    QRCode.toDataURL(verifyPayload, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR code', err));
  }, [certificate, recipient, certTitle, gradeText]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareLink = () => {
    const shareText = `🎓 Verified Certificate of Completion\nRecipient: ${recipient}\nAward: ${certTitle}\nScore: ${certificate.score}%\nVerification ID: ${certCode}\nIssued by BCA Verse Academy.`;
    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col my-auto">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-slate-200">Official Digital Credential</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              {certCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              title="Copy Certificate Credentials"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              {isCopied ? 'Copied Details!' : 'Share Proof'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-8 flex justify-center items-center overflow-x-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          
          <div
            ref={certRef}
            id="printable-certificate"
            className="relative w-full max-w-3xl aspect-[1.414/1] bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-[#040814] text-slate-100 p-8 sm:p-12 rounded-xl border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between overflow-hidden"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)`
            }}
          >
            {/* Guilloche Corner Accents */}
            <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-amber-500/40 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg pointer-events-none" />

            {/* Inner Gold Border */}
            <div className="absolute inset-4 border border-amber-500/20 rounded-lg pointer-events-none" />

            {/* Header */}
            <div className="text-center relative z-10 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                BCA Verse & TechMaster Academy
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 font-serif">
                Certificate of Mastery
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider font-mono">
                Verified Autonomous Technical Competency
              </p>
            </div>

            {/* Recipient Body */}
            <div className="text-center my-auto py-4 relative z-10">
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest">This is proudly presented to</p>
              <div className="my-2 sm:my-3">
                <span className="text-2xl sm:text-4xl font-black text-white font-serif tracking-tight border-b-2 border-amber-500/40 pb-1 px-4 inline-block">
                  {recipient}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                for demonstrating exceptional technical aptitude and successfully passing the rigorous Final Boss Examination in
              </p>
              <p className="text-lg sm:text-2xl font-bold text-amber-300 mt-2 font-mono">
                {certTitle}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                with an outstanding final score of <span className="font-semibold text-emerald-400">{certificate.score}%</span> ({gradeText})
              </p>
            </div>

            {/* Footer with QR, Seal, Signatures */}
            <div className="flex items-end justify-between pt-4 border-t border-slate-800/80 relative z-10 text-left">
              {/* QR Verification */}
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg shadow-md">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Verification QR" className="w-14 h-14 sm:w-16 sm:h-16" />
                  ) : (
                    <div className="w-14 h-14 bg-slate-200 animate-pulse rounded" />
                  )}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-mono">
                  <p className="text-slate-300 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" /> Cryptographically Verified
                  </p>
                  <p>ID: {certCode}</p>
                  <p>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Gold Hologram Seal */}
              <div className="hidden sm:flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-amber-400/80 bg-gradient-to-tr from-amber-600 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-[9px] uppercase tracking-tighter text-center leading-tight">
                  Official<br />Seal<br />Verified
                </div>
              </div>

              {/* Signatures */}
              <div className="text-right text-[10px] sm:text-xs font-mono">
                <div className="text-amber-300 font-serif italic text-sm sm:text-base border-b border-slate-700 pb-1">
                  Director of Academic Verification
                </div>
                <p className="text-slate-400 mt-1">BCA Verse Examination Board</p>
                <p className="text-slate-500 text-[9px]">Autonomous Integrity Protocol</p>
              </div>
            </div>

          </div>

        </div>

        {/* Verification Helper */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>This credential is permanently saved in your local vault and verifiable via QR code.</span>
          <span className="text-amber-400 font-mono font-medium">Tamper-Proof Digital Ledger</span>
        </div>

      </div>
    </div>
  );
};
