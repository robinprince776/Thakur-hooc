import { NatureWallpaper } from '../types';

export interface WallpaperOption {
  id: NatureWallpaper;
  title: string;
  url: string;
  emoji: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'starry-night',
    title: 'Dreamy Starry Night ✨',
    emoji: '✨',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'lavender-twilight',
    title: 'Lavender Twilight 🌙',
    emoji: '🌙',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'moonlight-clouds',
    title: 'Moonlit Anime Sky ☁️',
    emoji: '☁️',
    url: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cosmic-aurora',
    title: 'Deep Cosmic Nebula 🌌',
    emoji: '🌌',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'misty-lake',
    title: 'Misty Night Waters 🌊',
    emoji: '🌊',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'emerald-rain',
    title: 'Midnight Emerald Rain 🌿',
    emoji: '🌿',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'deep-forest',
    title: 'Quiet Deep Forest 🌲',
    emoji: '🌲',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'alpine-dawn',
    title: 'Starry Alpine Heights 🏔️',
    emoji: '🏔️',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
];

export function getWallpaperUrl(id: NatureWallpaper): string {
  const found = WALLPAPERS.find((w) => w.id === id);
  return found ? found.url : WALLPAPERS[0].url;
}
