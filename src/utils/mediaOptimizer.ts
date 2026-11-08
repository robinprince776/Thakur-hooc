// Client-side Media Compression & Blob Lifecycle Optimizer

export async function compressImage(
  dataUrlOrFile: string | File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to original
        resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : '');
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = (e) => {
      console.warn('Image compression load error:', e);
      if (typeof dataUrlOrFile === 'string') resolve(dataUrlOrFile);
      else reject(new Error('Failed to load image for compression'));
    };

    if (typeof dataUrlOrFile === 'string') {
      img.src = dataUrlOrFile;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(dataUrlOrFile);
    }
  });
}

// Global active blob tracker to prevent memory leaks
const activeBlobUrls = new Set<string>();

export function registerBlobUrl(url: string) {
  activeBlobUrls.add(url);
}

export function revokeBlobUrl(url?: string) {
  if (url && activeBlobUrls.has(url)) {
    try {
      URL.revokeObjectURL(url);
    } catch {}
    activeBlobUrls.delete(url);
  }
}

export function revokeAllBlobUrls() {
  activeBlobUrls.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch {}
  });
  activeBlobUrls.clear();
}
