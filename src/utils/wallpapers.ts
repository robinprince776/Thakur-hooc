import { NatureWallpaper } from '../types';

export interface WallpaperOption {
  id: NatureWallpaper;
  title: string;
  url: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'misty-lake',
    title: 'Misty Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'emerald-rain',
    title: 'Emerald Rain',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'deep-forest',
    title: 'Deep Forest',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'alpine-dawn',
    title: 'Alpine Dawn',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
];

export function getWallpaperUrl(id: NatureWallpaper): string {
  const found = WALLPAPERS.find((w) => w.id === id);
  return found ? found.url : WALLPAPERS[0].url;
}
