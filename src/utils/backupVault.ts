// Offline Encrypted Backup & Restore Vault (.ghost format)
// Uses browser-native Web Crypto API (PBKDF2 + AES-GCM 256) and Blob API for crash-free downloads.

export interface GhostBackupPayload {
  format: 'bcaverse-ghost-backup';
  version: number;
  exportedAt: string;
  keyCount: number;
  entries: Record<string, string>;
}

export interface EncryptedGhostFile {
  magic: 'GHOST_VAULT_V1';
  algorithm: 'AES-GCM-256';
  kdf: 'PBKDF2-SHA256';
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
  protectedWithPassphrase: boolean;
  exportedAt: string;
  keyCount: number;
}

export interface VaultStorageStats {
  totalKeys: number;
  sizeKb: number;
  bookmarksCount: number;
  quickNotesCount: number;
  portfolioCount: number;
  xpAmount: number;
}

const DEFAULT_VAULT_SECRET = 'BCAVERSE_LOCAL_GHOST_VAULT_2026_KEY';
const PBKDF2_ITERATIONS = 100000;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function getVaultStorageStats(): VaultStorageStats {
  let totalKeys = 0;
  let totalBytes = 0;
  let bookmarksCount = 0;
  let quickNotesCount = 0;
  let portfolioCount = 0;
  let xpAmount = 0;

  try {
    totalKeys = localStorage.length;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const v = localStorage.getItem(k) || '';
      totalBytes += (k.length + v.length) * 2;
    }

    const rawBookmarks = localStorage.getItem('bca_buddy_bookmarks');
    if (rawBookmarks) {
      const parsed = JSON.parse(rawBookmarks);
      if (Array.isArray(parsed)) bookmarksCount = parsed.length;
    }

    const rawNotes = localStorage.getItem('os_quick_notes');
    if (rawNotes) {
      const parsed = JSON.parse(rawNotes);
      if (Array.isArray(parsed)) quickNotesCount = parsed.length;
    }

    const rawGamification = localStorage.getItem('bca_gamification_v2');
    if (rawGamification) {
      const parsed = JSON.parse(rawGamification);
      if (typeof parsed?.xp === 'number') xpAmount = parsed.xp;
      if (Array.isArray(parsed?.portfolioProjects)) {
        portfolioCount = parsed.portfolioProjects.length;
      }
    }
  } catch {
    // Graceful fallback if localStorage is restricted
  }

  return {
    totalKeys,
    sizeKb: Math.max(1, Math.round((totalBytes / 1024) * 10) / 10),
    bookmarksCount,
    quickNotesCount,
    portfolioCount,
    xpAmount,
  };
}

export async function exportEncryptedBackup(customPassphrase?: string): Promise<{
  filename: string;
  keyCount: number;
  sizeKb: number;
}> {
  const entries: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key);
      if (value !== null) {
        entries[key] = value;
      }
    }
  } catch {
    throw new Error('Unable to read browser local storage.');
  }

  const exportedAt = new Date().toISOString();
  const keyCount = Object.keys(entries).length;
  const payload: GhostBackupPayload = {
    format: 'bcaverse-ghost-backup',
    version: 1,
    exportedAt,
    keyCount,
    entries,
  };

  const trimmedPass = customPassphrase?.trim() || '';
  const secret = trimmedPass || DEFAULT_VAULT_SECRET;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await deriveAesKey(secret, salt);

  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoded
  );

  const envelope: EncryptedGhostFile = {
    magic: 'GHOST_VAULT_V1',
    algorithm: 'AES-GCM-256',
    kdf: 'PBKDF2-SHA256',
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encryptedBuffer)),
    protectedWithPassphrase: Boolean(trimmedPass),
    exportedAt,
    keyCount,
  };

  const serialized = JSON.stringify(envelope, null, 2);
  const blob = new Blob([serialized], { type: 'application/octet-stream' });
  const dateStamp = exportedAt.slice(0, 10);
  const filename = `bcaverse-backup-${dateStamp}.ghost`;

  const objectUrl = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  }

  return {
    filename,
    keyCount,
    sizeKb: Math.max(1, Math.round((blob.size / 1024) * 10) / 10),
  };
}

export async function importEncryptedBackup(
  file: File,
  customPassphrase?: string
): Promise<{
  restoredKeys: number;
  exportedAt: string;
}> {
  if (!file) {
    throw new Error('Please select a valid .ghost backup file.');
  }

  const rawText = await file.text();
  let envelope: EncryptedGhostFile;
  try {
    envelope = JSON.parse(rawText);
  } catch {
    throw new Error('Invalid backup file format. Expected a .ghost encrypted archive.');
  }

  if (envelope.magic !== 'GHOST_VAULT_V1' || !envelope.ciphertext || !envelope.salt || !envelope.iv) {
    throw new Error('Unrecognized .ghost vault signature.');
  }

  const trimmedPass = customPassphrase?.trim() || '';
  if (envelope.protectedWithPassphrase && !trimmedPass) {
    throw new Error('This backup is locked with a custom passphrase. Enter the passphrase to restore.');
  }

  const secret = trimmedPass || DEFAULT_VAULT_SECRET;
  const salt = base64ToBytes(envelope.salt);
  const iv = base64ToBytes(envelope.iv);
  const ciphertext = base64ToBytes(envelope.ciphertext);

  let decryptedBuffer: ArrayBuffer;
  try {
    const aesKey = await deriveAesKey(secret, salt);
    decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
      aesKey,
      ciphertext.buffer as ArrayBuffer
    );
  } catch {
    throw new Error('Decryption failed. Check your backup passphrase or file integrity.');
  }

  let payload: GhostBackupPayload;
  try {
    const decoded = new TextDecoder().decode(decryptedBuffer);
    payload = JSON.parse(decoded);
  } catch {
    throw new Error('Corrupted backup contents inside .ghost file.');
  }

  if (payload.format !== 'bcaverse-ghost-backup' || !payload.entries || typeof payload.entries !== 'object') {
    throw new Error('Backup payload structure is invalid.');
  }

  const keys = Object.keys(payload.entries);
  try {
    for (const key of keys) {
      const value = payload.entries[key];
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      }
    }
  } catch {
    throw new Error('Browser storage quota exceeded while restoring backup.');
  }

  return {
    restoredKeys: keys.length,
    exportedAt: payload.exportedAt || envelope.exportedAt,
  };
}
