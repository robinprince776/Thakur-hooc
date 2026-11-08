// Global Single-Audio Playback Controller
// Ensures only one voice note plays at any time across the entire chat

type StopCallback = () => void;

class AudioPlaybackManager {
  private currentPlayingId: string | null = null;
  private stopCallbacks = new Map<string, StopCallback>();

  public register(id: string, stopFn: StopCallback) {
    this.stopCallbacks.set(id, stopFn);
  }

  public unregister(id: string) {
    this.stopCallbacks.delete(id);
    if (this.currentPlayingId === id) {
      this.currentPlayingId = null;
    }
  }

  public onPlay(id: string) {
    // If another audio is currently playing, immediately pause/stop it
    if (this.currentPlayingId && this.currentPlayingId !== id) {
      const prevStop = this.stopCallbacks.get(this.currentPlayingId);
      if (prevStop) {
        try {
          prevStop();
        } catch (e) {
          console.warn('Error pausing previous audio note:', e);
        }
      }
    }
    this.currentPlayingId = id;
  }

  public onStop(id: string) {
    if (this.currentPlayingId === id) {
      this.currentPlayingId = null;
    }
  }

  public stopAll() {
    this.stopCallbacks.forEach((stopFn) => {
      try {
        stopFn();
      } catch {}
    });
    this.currentPlayingId = null;
  }
}

export const audioPlaybackManager = new AudioPlaybackManager();
