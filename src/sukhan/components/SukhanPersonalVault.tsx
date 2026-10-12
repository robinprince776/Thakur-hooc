import React, { useState, useEffect, useMemo } from 'react';
import {
  BookMarked,
  Folder,
  Plus,
  Search,
  Trash2,
  Edit3,
  Copy,
  Check,
  Download,
  Share2,
  Palette,
  Heart,
  Clock,
  RotateCcw,
  Tag,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { PoetryDraft, PoetryFormat } from '../types';

interface SukhanPersonalVaultProps {
  onOpenDraftInStudio: (draft: PoetryDraft) => void;
  onOpenCardDesigner: (text: string, attribution: string) => void;
}

const VAULT_STORAGE_KEY = 'sukhan_personal_vault_v1';

const INITIAL_VAULT_DRAFTS: PoetryDraft[] = [
  {
    id: 'draft_1',
    title: 'Tanhai Ki Pehli Shaam',
    content: `Khaali kamre mein hawa gungunati hai,
Teri har purani baat yaad aati hai.

Hum toh samjhe the ki bhool jaayenge tujhe,
Par ye tanhai har roz aazmati hai.`,
    format: 'Ghazal',
    language: 'Urdu',
    mood: 'Tanhai',
    radif: 'aati hai',
    qafiya: 'gungunati, aazmati',
    folder: 'Ghazlen',
    isFavorite: true,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 12,
    history: [
      {
        timestamp: Date.now() - 3600000 * 24,
        content: `Khaali kamre mein hawa gungunati hai,\nHar purani baat yaad aati hai.`
      }
    ]
  },
  {
    id: 'draft_2',
    title: 'Akhiyan Da Vichhoda (Punjabi Ballad)',
    content: `Akhiyan udeek diyan raatan nu sajjna,
Dil nu na aave chain.
Chann vi chhupeya baadal pichhe,
Ronde mere naina te rain.`,
    format: 'Punjabi Song',
    language: 'Punjabi',
    mood: 'Judai',
    folder: 'Geet',
    isFavorite: true,
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000 * 3,
    history: []
  },
  {
    id: 'draft_3',
    title: 'Khuddaari Ka Danka',
    content: `Sar jhukaya nahi toh dushman ban gaye saare,
Hum ghareebon ke paas bas apna guroor bacha tha.`,
    format: 'Couplet',
    language: 'Hindi',
    mood: 'Khuddaari',
    folder: 'Mukhtasar Sher',
    isFavorite: false,
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
    history: []
  }
];

export const SukhanPersonalVault: React.FC<SukhanPersonalVaultProps> = ({
  onOpenDraftInStudio,
  onOpenCardDesigner
}) => {
  const [drafts, setDrafts] = useState<PoetryDraft[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_VAULT_DRAFTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<string>(() => drafts[0]?.id || '');

  useEffect(() => {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.warn('Vault storage save error:', e);
    }
  }, [drafts]);

  const folders = ['All', 'Favorites', 'Ghazlen', 'Geet', 'Mukhtasar Sher', 'Azaad Nazm'];

  const filteredDrafts = useMemo(() => {
    return drafts
      .filter((d) => {
        const matchFolder =
          selectedFolder === 'All'
            ? true
            : selectedFolder === 'Favorites'
            ? d.isFavorite
            : d.folder === selectedFolder;
        const matchSearch =
          !searchQuery.trim() ||
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.mood.toLowerCase().includes(searchQuery.toLowerCase());
        return matchFolder && matchSearch;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [drafts, selectedFolder, searchQuery]);

  const activeDraft = useMemo(() => {
    return drafts.find((d) => d.id === selectedDraftId) || filteredDrafts[0];
  }, [drafts, selectedDraftId, filteredDrafts]);

  const handleToggleFavorite = (id: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Kya aap sach me is draft ko delete karna chahte hain?')) {
      const remaining = drafts.filter((d) => d.id !== id);
      setDrafts(remaining);
      if (selectedDraftId === id) {
        setSelectedDraftId(remaining[0]?.id || '');
      }
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTxt = (draft: PoetryDraft) => {
    const textBlob = new Blob(
      [
        `Title: ${draft.title}\nFormat: ${draft.format} (${draft.language})\nMood: ${draft.mood}\nDate: ${new Date(
          draft.updatedAt
        ).toLocaleString()}\n\n---\n\n${draft.content}\n\n(Saved in Sukhan Diary · Made by Prince Thakur)\n`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(textBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.title.replace(/[^a-zA-Z0-9]/g, '_') || 'shayari'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = (draft: PoetryDraft) => {
    const mdBlob = new Blob(
      [
        `# ${draft.title}\n\n**Format:** ${draft.format} | **Language:** ${draft.language} | **Mood:** ${draft.mood}\n\n---\n\n${draft.content}\n\n---\n*Created with SUKHAN Diary · Made by Prince Thakur*\n`
      ],
      { type: 'text/markdown;charset=utf-8' }
    );
    const url = URL.createObjectURL(mdBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.title.replace(/[^a-zA-Z0-9]/g, '_') || 'shayari'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 py-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C6A66B]/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#C6A66B]">
              Personal Vault
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
            <span className="text-xs text-zinc-400">Offline &amp; Private</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#F2E9DC] tracking-wide mt-0.5">
            Meri Diary (Kalam Vault)
          </h1>
          <p className="text-xs text-zinc-400">
            Aapki apni likhi hui shayari, ghazals, geet aur drafts aapke phone me mahfooz hain.
          </p>
        </div>

        {/* Total stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#15151C] border border-[#C6A66B]/30 text-xs font-semibold text-[#F2E9DC]">
            <span className="text-[#C6A66B] font-bold font-mono">{drafts.length}</span> Drafts Saved
          </div>
        </div>
      </div>

      {/* Main Grid: Left List (4 Cols) + Right Viewer/Editor (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Folders + Search + List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Diary me search karein..."
              className="w-full bg-[#15151C] border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F2E9DC] focus:outline-none focus:border-[#C6A66B] transition-colors"
            />
          </div>

          {/* Folder Filter Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedFolder === f
                    ? 'bg-[#C6A66B]/20 border-[#C6A66B] text-[#FFF5EA]'
                    : 'bg-[#15151C] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {f === 'Favorites' ? '★ Favorites' : f}
              </button>
            ))}
          </div>

          {/* Drafts List */}
          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredDrafts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#15151C]/60 border border-zinc-800 text-zinc-500 text-xs">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#C6A66B]" />
                <p className="font-semibold text-zinc-400">Koi draft nahi mila</p>
                <p className="text-[11px] mt-1">Writing Studio se nayi shayari likhein.</p>
              </div>
            ) : (
              filteredDrafts.map((d) => {
                const isSelected = d.id === activeDraft?.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDraftId(d.id)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#59263C]/20 border-[#C6A66B] shadow-md ring-1 ring-[#C6A66B]/30'
                        : 'bg-[#15151C]/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-[#F2E9DC] truncate font-serif">
                        {d.title || 'Untitled Draft'}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(d.id);
                        }}
                        className="text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            d.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 italic font-serif leading-relaxed">
                      {d.content || 'Khali draft...'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2.5 pt-2 border-t border-zinc-800/80">
                      <span className="px-2 py-0.5 rounded bg-[#0B0B0F] border border-zinc-800 font-medium text-zinc-400">
                        {d.format} · {d.mood}
                      </span>
                      <span>
                        {new Date(d.updatedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Draft Viewer / Actions (7 Cols) */}
        <div className="lg:col-span-7 bg-[#15151C]/90 border border-[#C6A66B]/30 rounded-3xl p-6 sm:p-7 space-y-6">
          {activeDraft ? (
            <>
              {/* Draft Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C6A66B]/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#C6A66B]">
                    <span>{activeDraft.format}</span>
                    <span>·</span>
                    <span>{activeDraft.language}</span>
                    <span>·</span>
                    <span>{activeDraft.mood}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif text-[#FFF5EA] mt-0.5">
                    {activeDraft.title}
                  </h2>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => onOpenDraftInStudio(activeDraft)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C6A66B] text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
                    title="Studio me edit karein"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Studio me Kholein</span>
                  </button>

                  <button
                    onClick={() => onOpenCardDesigner(activeDraft.content, activeDraft.title)}
                    className="p-2 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-zinc-400 hover:text-[#C6A66B] transition-colors cursor-pointer"
                    title="Card Designer me banayein"
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy(activeDraft.content, activeDraft.id)}
                    className="p-2 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Text"
                  >
                    {copiedId === activeDraft.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(activeDraft.id)}
                    className="p-2 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Poetry Content Display */}
              <div className="p-6 rounded-2xl bg-[#0B0B0F]/90 border border-zinc-800/80">
                <p className="font-serif italic text-base sm:text-lg text-[#F2E9DC] leading-loose whitespace-pre-line text-center sm:text-left">
                  {activeDraft.content}
                </p>
              </div>

              {/* Export & Technical Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                  <span>
                    Words: {activeDraft.content.trim() ? activeDraft.content.trim().split(/\s+/).length : 0}
                  </span>
                  <span>Lines: {activeDraft.content.split('\n').filter(Boolean).length}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500">Export:</span>
                  <button
                    onClick={() => handleExportTxt(activeDraft)}
                    className="px-2.5 py-1 rounded-lg bg-[#0B0B0F] border border-zinc-800 text-zinc-300 hover:text-[#C6A66B] text-[11px] font-mono cursor-pointer"
                  >
                    .TXT
                  </button>
                  <button
                    onClick={() => handleExportMarkdown(activeDraft)}
                    className="px-2.5 py-1 rounded-lg bg-[#0B0B0F] border border-zinc-800 text-zinc-300 hover:text-[#C6A66B] text-[11px] font-mono cursor-pointer"
                  >
                    .MD
                  </button>
                </div>
              </div>

              {/* Revision History if available */}
              {activeDraft.history && activeDraft.history.length > 0 && (
                <div className="pt-2 border-t border-zinc-800">
                  <div className="text-[11px] font-bold text-[#C6A66B] mb-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>Previous Revisions ({activeDraft.history.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {activeDraft.history.slice(0, 3).map((h, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-[#0B0B0F]/50 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between"
                      >
                        <span className="truncate max-w-xs">{h.content.slice(0, 50)}...</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-zinc-500 space-y-2">
              <FileText className="w-10 h-10 mx-auto opacity-30 text-[#C6A66B]" />
              <p className="text-sm font-semibold text-zinc-400">Koi draft select nahi hai</p>
              <p className="text-xs">Left sidebar se koi draft choose karein.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
