import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Scale,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  Copy,
  Check,
  Send,
  Building,
  Lock,
  ExternalLink,
  Info,
  DollarSign
} from 'lucide-react';

interface FraudTypeOption {
  id: string;
  title: string;
  sections: string;
  actionGuide: string;
  goldenHourNote: string;
}

const FRAUD_TYPES: FraudTypeOption[] = [
  {
    id: 'upi_qr',
    title: 'UPI / QR Code / Fake Payment Scam',
    sections: 'IT Act 2000 Section 66D (Cheating by Personation) & BNS Sec 318(4) / IPC 420',
    actionGuide: 'Scammer sent a fake payment screenshot or asked you to scan a QR code to "receive" money.',
    goldenHourNote: 'Pehle 2 ghante me call karne par CFCFRMS software recipient bank account ko debit freeze kar deta hai.'
  },
  {
    id: 'job_part_time',
    title: 'Telegram / WhatsApp Part-Time Task Fraud',
    sections: 'IT Act Sec 66D, 66C (Identity Theft) & Organized Cyber Syndicates',
    actionGuide: 'YouTube video like ya hotel rating task ke bahane crypto/USDT ya task wallet me paisa invest karwaya gaya.',
    goldenHourNote: 'Mule bank accounts ki chain ko todne ke liye transaction UTR number sabse critical hota hai.'
  },
  {
    id: 'apk_screenshare',
    title: 'Fake APK / AnyDesk / Screen-Share Malware',
    sections: 'IT Act Sec 43 (Damage to Computer System), Sec 66 (Hacking) & 66C',
    actionGuide: 'Electricity bill update ya courier delivery ke bahane malicious APK install karwa ke OTP steal kiya gaya.',
    goldenHourNote: 'Turant phone ko Airplane Mode me daalein aur mobile banking passwords kisi doosre safe device se reset karein.'
  },
  {
    id: 'sextortion_blackmail',
    title: 'Video Call / Sextortion / Intimidation',
    sections: 'IT Act Sec 66E (Privacy Violation), Sec 67/67A & BNS Extortion',
    actionGuide: 'WhatsApp video call record karke morphed video viral karne ki dhamki dekar paise maange gaye.',
    goldenHourNote: 'Paise bilkul transfer NA karein! Callers ko block karein aur sabhi chats aur call logs ka screenshot lein.'
  },
  {
    id: 'account_hack',
    title: 'Instagram / Facebook / Email Hacking',
    sections: 'IT Act Sec 66 (Unauthorized Access) & Sec 66C (Identity Theft)',
    actionGuide: 'Account ka recovery email aur phone number hacker ne change kar diya hai aur doston se paise maang raha hai.',
    goldenHourNote: 'Hacked platform ke security recovery flow ko invoke karein aur doston ko broadcast alert bhejein.'
  }
];

export const CyberCellAssistant: React.FC = () => {
  const [selectedFraud, setSelectedFraud] = useState<string>('upi_qr');
  const [victimName, setVictimName] = useState('');
  const [victimPhone, setVictimPhone] = useState('');
  const [victimEmail, setVictimEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [suspectInfo, setSuspectInfo] = useState('');
  const [amountLost, setAmountLost] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [incidentDescription, setIncidentDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'fir' | 'bank_letter' | 'sop'>('fir');
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null);

  const fraud = FRAUD_TYPES.find((f) => f.id === selectedFraud) || FRAUD_TYPES[0];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDoc(type);
    setTimeout(() => setCopiedDoc(null), 2500);
  };

  // Generate Formal Police Cyber Crime FIR Letter
  const generatePoliceFIRLetter = () => {
    return `To,
The Station House Officer (SHO) / Officer-in-Charge,
Cyber Crime Police Station / Local Police Station,
Subject: Complaint regarding Financial Cyber Fraud of ₹${amountLost || '[Amount]'} via ${fraud.title} under IT Act 2000 & Bharatiya Nyaya Sanhita (BNS)

Respected Sir/Madam,

I, ${victimName || '[Your Full Name]'}, residing at [Your Address], mobile number ${victimPhone || '[Your Phone]'}, wish to urgently report a financial cyber fraud committed against me on ${incidentDate}.

1. INCIDENT DETAILS:
- Category of Cybercrime: ${fraud.title}
- Total Amount Siphoned Off: ₹${amountLost || '[Amount Lost]'}
- Date & Time of Incident: ${incidentDate}
- Victim Bank Name: ${bankName || '[Your Bank Name]'}
- Victim Account/Debit Card Ending: ${accountNumber || '[Your Account Number]'}
- Transaction ID / UTR Number: ${utrNumber || '[Bank Reference / UTR Number]'}
- Suspect's Phone / UPI ID / Account: ${suspectInfo || '[Fraudster UPI / Phone / Beneficiary Account]'}

2. FACTUAL NARRATIVE:
${incidentDescription || 'The fraudster deceitfully lured me under the pretext of ' + fraud.actionGuide + ' and fraudulently deducted the money from my account without my authorization.'}

3. LEGAL PROVISIONS APPLICABLE:
- Information Technology Act, 2000:
  * Section 66 (Computer Related Offences)
  * Section 66C (Identity Theft)
  * Section 66D (Cheating by Personation by using Computer Resource)
  * Section 43 (Penalty for damage to computer systems)
- Bharatiya Nyaya Sanhita (BNS), 2023 / Indian Penal Code:
  * Section 318(4) BNS / Section 420 IPC (Cheating and Dishonestly Inducing Delivery of Property)

4. PRAYER:
In view of the above facts, I humbly request you to:
a) Register a formal First Information Report (FIR) under the aforementioned sections.
b) Issue an immediate Freeze Notice under Section 91 CrPC / Section 94 BNSS to the beneficiary bank to prevent withdrawal of the stolen funds.
c) Take strict punitive action against the perpetrators and trace the money trail.

Digital evidence, bank transaction statement, and relevant screenshots are enclosed herewith as per Section 65B of the Indian Evidence Act.

Yours faithfully,

Date: ${incidentDate}
Name: ${victimName || '[Your Full Name]'}
Contact: ${victimPhone || '[Your Phone]'}
Email: ${victimEmail || '[Your Email]'}`;
  };

  // Generate Formal Bank Disputed Transaction Freeze Letter
  const generateBankFreezeLetter = () => {
    return `To,
The Branch Manager / Nodal Cyber Officer,
${bankName || '[Your Bank Name]'},
Subject: URGENT: Disputed Cyber Fraud Transaction of ₹${amountLost || '[Amount]'} - Request for Immediate Chargeback / Beneficiary Account Lien Freeze

Reference:
- Account Number: ${accountNumber || '[Your Account Number]'}
- Transaction UTR / Ref ID: ${utrNumber || '[UTR Number]'}
- Incident Date: ${incidentDate}
- RBI Circular: DBR.No.Leg.BC.78/09.07.005/2017-18 (Customer Protection – Limiting Liability in Unauthorized Electronic Banking Transactions)

Dear Sir/Madam,

I hold an account with your bank bearing Account Number ${accountNumber || '[Your Account]'}. I am writing to urgently dispute and report an unauthorized/fraudulent transaction debited from my account.

TRANSACTION DETAILS:
- Date of Transaction: ${incidentDate}
- Amount Debited: ₹${amountLost || '[Amount]'}
- Transaction UTR/RRN: ${utrNumber || '[UTR / Reference Number]'}
- Fraudster Beneficiary Details: ${suspectInfo || '[Suspect Beneficiary UPI / Bank Details]'}
- National Cyber Crime Portal Acknowledgement: Pending / Lodged via 1930

As per the Reserve Bank of India (RBI) guidelines on "Customer Protection – Limiting Liability of Customers in Unauthorized Electronic Banking Transactions", I am notifying the bank within zero/minimal delay.

I hereby request you to:
1. Immediately log this complaint into the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS).
2. Contact the beneficiary bank nodal officer and place an urgent debit freeze / lien on the recipient account to withhold the siphoned amount.
3. Initiate the formal chargeback / fraud reversal mechanism.
4. Provide me with a formal Dispute Acknowledgment Number.

Thanking you.

Yours sincerely,

Date: ${incidentDate}
Name: ${victimName || '[Your Name]'}
Phone: ${victimPhone || '[Your Phone Number]'}`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Emergency 1930 Golden Hour Alert Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/70 via-red-900/60 to-amber-950/70 border-2 border-rose-500/80 shadow-2xl shadow-rose-950/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-rose-600 text-white shrink-0 animate-pulse">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-wide text-rose-200">
                National Cyber Crime Helpline: 1930
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-black uppercase">
                Golden Hour Active
              </span>
            </div>
            <p className="text-xs text-rose-100/90 leading-relaxed mt-0.5 max-w-xl">
              Agar aapke saath pichhle 2-3 ghante me koi financial online fraud hua hai, toh pehle{' '}
              <strong>1930</strong> par turant call karein! CFCFRMS system recipient bank account ko debit freeze kar deta hai.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:1930"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 1930 Now</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-rose-400/50 text-rose-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Fraud Form & Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fraud Classification & Victim Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step 1: Fraud Classification */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Step 1: Select Fraud Nature</span>
            </div>

            <div className="space-y-2">
              {FRAUD_TYPES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFraud(f.id)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedFraud === f.id
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 shadow-sm'
                      : 'bg-black/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      selectedFraud === f.id ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-200">{f.title}</div>
                    <div className="text-[10px] text-emerald-400/90 font-mono mt-0.5">{f.sections}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Evidence & Incident Details Form */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-lg text-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Step 2: Incident & Transaction Evidence</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Victim Full Name (Aapka Naam)
                </label>
                <input
                  type="text"
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  placeholder="e.g. Priyanshu Thakur"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={victimPhone}
                    onChange={(e) => setVictimPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Amount Lost (₹)</label>
                  <input
                    type="text"
                    value={amountLost}
                    onChange={(e) => setAmountLost(e.target.value)}
                    placeholder="e.g. 25,000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold focus:border-emerald-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Your Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. SBI / HDFC Bank"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 30894726190"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Bank Reference / UTR Number (Sabse Important!)
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 427819038291 (12 digits UTR)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Suspect UPI / Phone / Account (Fraudster ki Details)
                </label>
                <input
                  type="text"
                  value={suspectInfo}
                  onChange={(e) => setSuspectInfo(e.target.value)}
                  placeholder="e.g. scammer@okaxis / +91 9988776655"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-rose-300 font-mono focus:border-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Incident Description (Short summary)
                </label>
                <textarea
                  rows={2}
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  placeholder="e.g. Scammer ne parcel hold bata kar ₹5 refund ka link bheja aur account se ₹25,000 deduct ho gaye..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Legal Complaint & Drafts (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            {/* Document Switcher Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab('fir')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'fir'
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Police Cyber Cell FIR</span>
                </button>

                <button
                  onClick={() => setActiveTab('bank_letter')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'bank_letter'
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Bank Freeze Letter</span>
                </button>

                <button
                  onClick={() => setActiveTab('sop')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'sop'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>1930 Golden SOP</span>
                </button>
              </div>

              {/* Action Buttons */}
              {activeTab !== 'sop' && (
                <button
                  onClick={() => {
                    const text = activeTab === 'fir' ? generatePoliceFIRLetter() : generateBankFreezeLetter();
                    handleCopy(text, activeTab);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  {copiedDoc === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied Draft!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Formal Draft</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Document Content View */}
            {activeTab === 'fir' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-emerald-400 font-bold">
                    📌 Ready-to-Submit Police Cyber Complaint Draft
                  </span>
                  <span className="text-[11px] text-zinc-500">Includes IT Act 2000 & BNS Sec 318</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
                  {generatePoliceFIRLetter()}
                </div>
              </div>
            )}

            {activeTab === 'bank_letter' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-cyan-400 font-bold">
                    🏦 Bank Branch Debit Freeze & Chargeback Letter
                  </span>
                  <span className="text-[11px] text-zinc-500">As per RBI Limiting Liability Circular</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
                  {generateBankFreezeLetter()}
                </div>
              </div>
            )}

            {activeTab === 'sop' && (
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 space-y-2">
                  <h4 className="font-bold text-sm flex items-center gap-1.5 text-amber-300">
                    <Clock className="w-4 h-4" /> 1930 Citizen Financial Fraud SOP (Golden Hour Rule)
                  </h4>
                  <p>
                    Financial fraud hone ke turant baad pehle 2 ghanton ko <strong>Golden Hour</strong> kaha jata hai. Is samay me fraudster ke pass paisa ATM se nikalne ya crypto me convert karne ka time nahi hota.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-400 text-xs">Step 1: Dial 1930</div>
                    <p className="text-[11px] text-slate-400">
                      Helpline officer ko apna Transaction ID/UTR, apna bank account, aur suspect ka UPI ID batayein.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-400 text-xs">Step 2: CFCFRMS Auto-Freeze</div>
                    <p className="text-[11px] text-slate-400">
                      Software beneficiary bank ko real-time auto alert bhej kar uske account ko debit freeze kar deta hai.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-400 text-xs">Step 3: Portal Ticket Number</div>
                    <p className="text-[11px] text-slate-400">
                      Aapke mobile par ek SMS aayega jisme Acknowledgement Number hoga. Us number se cybercrime.gov.in par 24 ghante me login karke full details upload karein.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-400 text-xs">Step 4: Bank Nodal Chargeback</div>
                    <p className="text-[11px] text-slate-400">
                      Bank freeze letter le kar apni home branch me submit karein taaki judicial order ke baad frozen funds aapke account me reverse ho sakein.
                    </p>
                  </div>
                </div>

                {/* Evidence Checklist */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Evidence Checklist (Section 65B Certified):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Bank account statement showing debited transaction</li>
                    <li>Full-screen screenshot of WhatsApp/Telegram chats and phone numbers</li>
                    <li>SMS alert received from your bank with UTR number</li>
                    <li>Phishing URL / QR code image if applicable</li>
                    <li>AnyDesk / TeamViewer / APK installation timestamp if applicable</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
