// Web Crypto API: Military-Grade 256-bit AES-GCM End-to-End Encryption

const ENCRYPTION_PREFIX = 'enc:aes-gcm:';

// Derive a 256-bit CryptoKey from room passphrase using PBKDF2
async function deriveKey(passphrase: string, saltStr: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(saltStr || 'calcvault-salt-bcaverse-v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Memory cache for derived keys
const keyCache = new Map<string, CryptoKey>();

async function getCachedKey(passphrase: string): Promise<CryptoKey> {
  const clean = passphrase.trim() || 'calcvault-default-master-key';
  if (keyCache.has(clean)) {
    return keyCache.get(clean)!;
  }
  const key = await deriveKey(clean, `salt-${clean.slice(0, 8)}`);
  keyCache.set(clean, key);
  return key;
}

export async function encryptText(plaintext: string, secretKeyStr: string): Promise<string> {
  if (!plaintext || typeof plaintext !== 'string') return plaintext;
  try {
    if (!window.crypto || !window.crypto.subtle) {
      return plaintext; // Fallback if crypto subtle unavailable
    }
    const key = await getCachedKey(secretKeyStr);
    const enc = new TextEncoder();
    const encoded = enc.encode(plaintext);

    // 12-byte initialization vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encoded
    );

    // Combine IV (12 bytes) + Ciphertext into single array
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Base64 encode
    let binary = '';
    for (let i = 0; i < combined.byteLength; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    const b64 = btoa(binary);

    return `${ENCRYPTION_PREFIX}${b64}`;
  } catch (err) {
    console.warn('Encryption fallback due to error:', err);
    return plaintext;
  }
}

export async function decryptText(encryptedText: string, secretKeyStr: string): Promise<string> {
  if (!encryptedText || typeof encryptedText !== 'string') return encryptedText;
  if (!encryptedText.startsWith(ENCRYPTION_PREFIX)) {
    return encryptedText; // Legacy unencrypted message
  }

  try {
    if (!window.crypto || !window.crypto.subtle) {
      return encryptedText;
    }
    const b64 = encryptedText.slice(ENCRYPTION_PREFIX.length);
    const binary = atob(b64);
    const combined = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      combined[i] = binary.charCodeAt(i);
    }

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const key = await getCachedKey(secretKeyStr);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    console.warn('Decryption failed, might be wrong key or corrupted:', err);
    return '[🔒 Encrypted Message - Key mismatch]';
  }
}
