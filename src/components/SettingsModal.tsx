import React, { useEffect, useRef, useState } from 'react';
import { UserSettings } from '../types';
import {
  X,
  KeyRound,
  User,
  Volume2,
  Shield,
  Hash,
  Save,
  HardDrive,
  Download,
  Upload,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import {
  exportEncryptedBackup,
  getVaultStorageStats,
  importEncryptedBackup,
  VaultStorageStats,
} from '../utils/backupVault';
import { useTranslation } from '../store/useLanguageStore';

export interface SettingsModalProps {
  isOpen?: boolean;
  initialTab?: 'vault' | 'data';
  settings: UserSettings;
  onUpdateSettings?: (newSettings: UserSettings) => void;
  onSave?: (newSettings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen = true,
  initialTab = 'vault',
  settings,
  onUpdateSettings,
  onSave,
  onClose,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'vault' | 'data'>(initialTab);
  const [pin, setPin] = useState(settings.secretPin);
  const [duressPin, setDuressPin] = useState(settings.duressPin || '0000');
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [roomId, setRoomId] = useState(settings.roomId || '');
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState(settings.hapticsEnabled);
  const [e2eeEnabled, setE2eeEnabledState] = useState(settings.e2eeEnabled ?? true);
  const [antiShoulderSurfing, setAntiShoulderSurfing] = useState(settings.antiShoulderSurfing ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data Vault state
  const [stats, setStats] = useState<VaultStorageStats>(() => getVaultStorageStats());
  const [backupPassphrase, setBackupPassphrase] = useState('');
  const [vaultBusy, setVaultBusy] = useState(false);
  const [vaultStatus, setVaultStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    needsReload?: boolean;
  } | null>(null);
  const [drivePreviewOpen, setDrivePreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setStats(getVaultStorageStats());
      setVaultStatus(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim() || '1307';
    const cleanDuressPin = duressPin.trim() || '0000';
    const cleanName = displayName.trim() || 'Dost';
    const cleanRoom = roomId.trim().toLowerCase() || 'direct';

    const updated: UserSettings = {
      ...settings,
      secretPin: cleanPin,
      duressPin: cleanDuressPin,
      displayName: cleanName,
      roomId: cleanRoom,
      soundEnabled,
      hapticsEnabled,
      e2eeEnabled,
      antiShoulderSurfing,
    };
    if (onUpdateSettings) onUpdateSettings(updated);
    if (onSave) onSave(updated);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleExportGhost = async () => {
    setVaultBusy(true);
    setVaultStatus(null);
    try {
      const result = await exportEncryptedBackup(backupPassphrase);
      setStats(getVaultStorageStats());
      setVaultStatus({
        type: 'success',
        message: `Exported ${result.keyCount} storage records (${result.sizeKb} KB) to ${result.filename}`,
      });
    } catch (err: any) {
      setVaultStatus({
        type: 'error',
        message: err?.message || 'Backup export failed.',
      });
    } finally {
      setVaultBusy(false);
    }
  };

  const handleImportFile = async (file?: File | null) => {
    if (!file) return;
    setVaultBusy(true);
    setVaultStatus(null);
    try {
      const result = await importEncryptedBackup(file, backupPassphrase);
      setStats(getVaultStorageStats());
      setVaultStatus({
        type: 'success',
        message: `Restored ${result.restoredKeys} records from backup (${result.exportedAt.slice(0, 10)}). Reload to apply everywhere.`,
        needsReload: true,
      });
    } catch (err: any) {
      setVaultStatus({
        type: 'error',
        message: err?.message || 'Backup restore failed.',
      });
    } finally {
      setVaultBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
              {activeTab === 'data' ? <HardDrive className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">
                {activeTab === 'data' ? t('settingsDataTitle') : 'Vault & Security Settings'}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {activeTab === 'data'
                  ? 'AES-256 Encrypted LocalStorage Portability'
                  : 'Secret Passcode, E2EE & Preferences'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Tab Bar */}
        <div className="px-5 py-3 bg-slate-900/70 border-b border-slate-800/80 shrink-0">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              className={`h-10 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'vault'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>{t('settingsVaultTab')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('data');
                setStats(getVaultStorageStats());
              }}
              className={`h-10 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'data'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardDrive className="w-4 h-4 shrink-0" />
              <span>{t('settingsDataTab')}</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'vault' ? (
            <form onSubmit={handleSave} className="space-y-3.5">
              {/* Secret PIN */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                  <KeyRound size={13} className="text-amber-300" />
                  <span>Secret Passcode (Real Vault)</span>
                </label>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="e.g. 1307"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter this passcode in the calculator to open your private vault.
                </p>
              </div>

              {/* Duress PIN */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                  <KeyRound size={13} className="text-purple-400" />
                  <span>Duress / Decoy PIN</span>
                </label>
                <input
                  type="text"
                  value={duressPin}
                  onChange={(e) => setDuressPin(e.target.value)}
                  placeholder="e.g. 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Opens a benign decoy study room when entered.
                </p>
              </div>

              {/* Display Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                    <User size={13} className="text-emerald-400" />
                    <span>Chat Display Name</span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                    <Hash size={13} className="text-cyan-400" />
                    <span>Private Room Code</span>
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="direct"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Security Toggles */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Shield size={14} className="text-emerald-400" />
                    <span>Web Crypto AES-GCM 256 E2EE</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={e2eeEnabled}
                    onChange={(e) => setE2eeEnabledState(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Shield size={14} className="text-cyan-400" />
                    <span>Anti-Shoulder-Surfing Blur</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={antiShoulderSurfing}
                    onChange={(e) => setAntiShoulderSurfing(e.target.checked)}
                    className="accent-cyan-500 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Volume2 size={14} className="text-amber-400" />
                    <span>Sound Effects</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                  <span className="pl-6">Haptic Vibrations</span>
                  <input
                    type="checkbox"
                    checked={hapticsEnabled}
                    onChange={(e) => setHapticsEnabled(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              <button
                type="submit"
                className={`w-full h-11 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  savedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                <Save size={15} />
                <span>{savedSuccess ? 'Settings Saved' : 'Save Settings'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Storage Snapshot Summary */}
              <div className="space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('settingsDataDesc')}
                </p>
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Stored Keys</div>
                    <div className="text-base font-bold text-white font-mono tabular-nums mt-0.5">
                      {stats.totalKeys}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Vault Size</div>
                    <div className="text-base font-bold text-cyan-300 font-mono tabular-nums mt-0.5">
                      {stats.sizeKb} KB
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Saved XP</div>
                    <div className="text-base font-bold text-emerald-300 font-mono tabular-nums mt-0.5">
                      {stats.xpAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono tabular-nums pt-0.5">
                  <span>{stats.bookmarksCount} Bookmarks</span>
                  <span aria-hidden="true">·</span>
                  <span>{stats.quickNotesCount} Notes</span>
                  <span aria-hidden="true">·</span>
                  <span>{stats.portfolioCount} Portfolio Projects</span>
                </div>
              </div>

              {/* Optional Encryption Passphrase */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('passphraseLabel')}</span>
                </label>
                <input
                  type="password"
                  value={backupPassphrase}
                  onChange={(e) => setBackupPassphrase(e.target.value)}
                  placeholder={t('passphrasePlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Export & Import Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={vaultBusy}
                  onClick={handleExportGhost}
                  className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>{vaultBusy ? 'Encrypting...' : t('exportBackupBtn')}</span>
                </button>

                <button
                  type="button"
                  disabled={vaultBusy}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 text-slate-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t('importBackupBtn')}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ghost,.json,application/octet-stream"
                  onChange={(e) => handleImportFile(e.target.files?.[0])}
                  className="hidden"
                />
              </div>

              {/* Feedback Banner */}
              {vaultStatus && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex flex-col gap-2.5 ${
                    vaultStatus.type === 'success'
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {vaultStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{vaultStatus.message}</span>
                  </div>
                  {vaultStatus.needsReload && (
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reload Workspace Now</span>
                    </button>
                  )}
                </div>
              )}

              {/* Cloud Sync (Mock UI for Future Release) */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-xs font-bold text-white">{t('cloudSyncTitle')}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Preview</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('cloudSyncNote')}
                </p>

                <button
                  type="button"
                  onClick={() => setDrivePreviewOpen((prev) => !prev)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/35 text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Cloud className="w-4 h-4 shrink-0" />
                  <span>{t('cloudSyncBtn')}</span>
                </button>

                {drivePreviewOpen && (
                  <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 text-[11px] text-sky-200 leading-relaxed">
                    Google Drive zero-knowledge sync is queued for our upcoming cloud milestone. Your local <span className="font-mono text-white">.ghost</span> archive already uses AES-256-GCM encryption and can be stored safely in any Drive folder manually right now.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
