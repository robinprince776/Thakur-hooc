import React, { useState } from 'react';
import {
  User,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Trophy,
  FileText,
  Clock,
  Sparkles,
  Edit3,
  X,
  Share2,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
  Download,
  ExternalLink
} from 'lucide-react';
import {
  useGamificationStore,
  calculateLevelFromXp,
  LEVEL_TIERS,
  Badge,
  BadgeRarity
} from '../../store/useGamificationStore';

export interface ProfileDashboardModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onOpenCertificate?: (certId: string) => void;
  onViewCertificate?: (cert: any) => void;
  onOpenExam?: (examId: string) => void;
  onOpenSkillTree?: () => void;
}

export const ProfileDashboardModal: React.FC<ProfileDashboardModalProps> = ({
  isOpen = true,
  onClose,
  onOpenCertificate,
  onViewCertificate,
  onOpenExam,
  onOpenSkillTree
}) => {
  if (!isOpen) return null;
  const {
    xp,
    level,
    levelTitle,
    badges,
    dailyMissions,
    streak,
    userName,
    userAvatar,
    userTitle,
    bio,
    showcasedBadgeIds,
    examHistory,
    certificates,
    updateUserProfile,
    xpHistory
  } = useGamificationStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'missions' | 'certs' | 'edit'>('overview');
  const [badgeFilter, setBadgeFilter] = useState<'All' | BadgeRarity>('All');

  // Edit form state
  const [editName, setEditName] = useState(userName);
  const [editTitle, setEditTitle] = useState(userTitle);
  const [editBio, setEditBio] = useState(bio);
  const [editAvatar, setEditAvatar] = useState(userAvatar);

  if (!isOpen) return null;

  const levelInfo = calculateLevelFromXp(xp);
  const unlockedBadges = badges.filter((b) => b.unlockedAt !== null);
  const totalBadges = badges.length;

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === 'All') return true;
    return b.rarity === badgeFilter;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      userName: editName.trim() || userName,
      userTitle: editTitle.trim() || userTitle,
      bio: editBio.trim() || bio,
      userAvatar: editAvatar
    });
    setActiveTab('overview');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-sans text-slate-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0B1120] border border-cyan-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0E1A34] to-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4 shrink-0 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl">
              {userAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{userName}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LVL {level} · {levelTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400">{userTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-black/40 border-b border-slate-800 px-6 flex items-center gap-2 overflow-x-auto font-mono text-xs shrink-0 py-2">
          {[
            { id: 'overview', label: '📊 Overview & Stats' },
            { id: 'badges', label: `🏆 Badges (${unlockedBadges.length}/${totalBadges})` },
            { id: 'missions', label: '🎯 Daily Missions' },
            { id: 'certs', label: `📜 Certificates (${certificates.length})` },
            { id: 'edit', label: '⚙️ Customize Profile' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Level & XP Progression Card */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-500/40 rounded-3xl p-6 shadow-xl space-y-4 font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                      Gamified Level Status
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-0.5">
                      Level {level}: {levelTitle}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Lifetime XP</span>
                    <div className="text-2xl font-extrabold text-amber-300">
                      {xp.toLocaleString()} XP
                    </div>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Current Tier Progress</span>
                    <span className="text-cyan-300 font-bold">
                      {levelInfo.progressPercent}% to Level {Math.min(10, level + 1)}
                    </span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-3 border border-slate-800 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full transition-all duration-700"
                      style={{ width: `${levelInfo.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{levelInfo.minXp} XP (Tier Start)</span>
                    <span>{levelInfo.maxXp} XP (Tier Cap)</span>
                  </div>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="bg-black/50 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Flame className="w-5 h-5" />
                    <span className="text-xs font-bold">Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{streak} Days</div>
                  <div className="text-[10px] text-slate-400">Active Daily Discipline</div>
                </div>

                <div className="bg-black/50 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Award className="w-5 h-5" />
                    <span className="text-xs font-bold">Badges</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {unlockedBadges.length} / {totalBadges}
                  </div>
                  <div className="text-[10px] text-slate-400">Achievements Mastered</div>
                </div>

                <div className="bg-black/50 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Trophy className="w-5 h-5" />
                    <span className="text-xs font-bold">Exams Cleared</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {examHistory.filter((e) => e.passed).length}
                  </div>
                  <div className="text-[10px] text-slate-400">Final Boss Certifications</div>
                </div>

                <div className="bg-black/50 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-purple-400">
                    <FileText className="w-5 h-5" />
                    <span className="text-xs font-bold">Certificates</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{certificates.length}</div>
                  <div className="text-[10px] text-slate-400">Verified Credentials</div>
                </div>
              </div>

              {/* Showcased Badges Banner */}
              <div className="bg-black/50 border border-slate-800 p-5 rounded-2xl space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    Showcased Badges on Profile
                  </h4>
                  <button
                    onClick={() => setActiveTab('badges')}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View All Badges →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {badges
                    .filter((b) => showcasedBadgeIds.includes(b.id))
                    .map((badge) => (
                      <div
                        key={badge.id}
                        className="bg-slate-900/80 border border-slate-700/80 p-3.5 rounded-xl flex items-center gap-3"
                      >
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-white truncate">{badge.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{badge.description}</div>
                          <div className="text-[9px] text-amber-400 font-bold uppercase mt-0.5">
                            {badge.rarity}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recent XP Activity Feed */}
              <div className="bg-black/50 border border-slate-800 p-5 rounded-2xl space-y-3 font-mono">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Recent XP Activity Ledger
                </h4>

                <div className="divide-y divide-slate-800/80 text-xs">
                  {xpHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-300">{item.source}</span>
                      <span className="text-emerald-400 font-bold">+{item.amount} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BADGES & ACHIEVEMENTS */}
          {activeTab === 'badges' && (
            <div className="space-y-4 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-white">Achievement Showcase</h4>
                  <p className="text-xs text-slate-400">
                    Earn permanent badges by conquering coding challenges, exams, and daily disciplines.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5">
                  {['All', 'Common', 'Rare', 'Epic', 'Legendary'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setBadgeFilter(r as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        badgeFilter === r
                          ? 'bg-cyan-500 text-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBadges.map((badge) => {
                  const isUnlocked = badge.unlockedAt !== null;

                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isUnlocked
                          ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg'
                          : 'bg-black/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="text-3xl p-2 rounded-2xl bg-black/50 border border-slate-800 shrink-0">
                        {badge.icon}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-white truncate">{badge.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              badge.rarity === 'Legendary'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : badge.rarity === 'Epic'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : badge.rarity === 'Rare'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {badge.rarity}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                          {badge.description}
                        </p>

                        <div className="text-[10px] text-slate-500 pt-1">
                          {isUnlocked ? (
                            <span className="text-emerald-400 font-bold">
                              ✓ Unlocked on {badge.unlockedAt}
                            </span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked Objective
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DAILY MISSIONS */}
          {activeTab === 'missions' && (
            <div className="space-y-4 font-mono">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-white">Daily Missions &amp; Active Quests</h4>
                <p className="text-xs text-slate-400">
                  Reset every 24 hours at midnight. Complete tasks to claim bonus XP and maintain your streak.
                </p>
              </div>

              <div className="space-y-3">
                {dailyMissions.map((mission) => {
                  const percent = Math.round((mission.currentCount / mission.targetCount) * 100);

                  return (
                    <div
                      key={mission.id}
                      className="bg-black/50 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                            {mission.category}
                          </span>
                          <span className="font-bold text-xs text-white">{mission.title}</span>
                          <span className="text-[11px] text-amber-400 font-bold">
                            +{mission.xpReward} XP
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-sans">{mission.description}</p>

                        <div className="flex items-center gap-3 pt-1">
                          <div className="w-40 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-cyan-500 h-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {mission.currentCount} / {mission.targetCount} ({percent}%)
                          </span>
                        </div>
                      </div>

                      <div>
                        {mission.claimed ? (
                          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold">
                            Claimed ✓
                          </span>
                        ) : mission.completed ? (
                          <button
                            onClick={() => useGamificationStore.getState().claimMissionReward(mission.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 animate-bounce"
                          >
                            Claim +{mission.xpReward} XP
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs">
                            In Progress...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CERTIFICATES & EXAMS */}
          {activeTab === 'certs' && (
            <div className="space-y-4 font-mono">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-white">Verified Course Credentials</h4>
                <p className="text-xs text-slate-400">
                  Official completion certificates generated upon clearing 70%+ on Hub Final Boss Examinations.
                </p>
              </div>

              {certificates.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Award className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs">No certificates earned yet.</p>
                  <p className="text-[11px] text-slate-600">
                    Pass any Hub Final Boss Exam to generate your verified certificate!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => onViewCertificate?.(cert)}
                      className="bg-gradient-to-br from-slate-900 to-black border border-cyan-500/30 hover:border-amber-500/50 p-5 rounded-2xl shadow-xl space-y-3 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[10px] text-cyan-300 font-bold">{cert.certNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          {cert.achievementLevel}
                        </span>
                      </div>

                      <div>
                        <h5 className="font-bold text-sm text-white">{cert.courseTitle}</h5>
                        <p className="text-xs text-slate-400 mt-0.5">Awarded to: {cert.userName}</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                        <span>Score: {cert.score}%</span>
                        <span>Issued: {cert.issueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EDIT PROFILE */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Scholar Display Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-black/60 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Academic Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-black/60 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Scholar Bio:</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-black/60 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Avatar Symbol:</label>
                <div className="flex items-center gap-2">
                  {['⚡', '🚀', '👑', '🛡️', '💻', '🧠', '⚔️', '🔥'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setEditAvatar(emoji)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all ${
                        editAvatar === emoji
                          ? 'bg-cyan-500/20 border-cyan-400 scale-110'
                          : 'bg-black/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-950 transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
