// Safe TTS Audio Utility (Read Aloud only - Voice Recognition removed)

export type TtsState = 'idle' | 'speaking';

class TextToSpeechService {
  private currentState: TtsState = 'idle';

  public cancelSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.currentState = 'idle';
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.0;
        utterance.rate = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          (v) => v.lang.includes('en-IN') || v.name.includes('Google') || v.name.includes('Natural')
        );
        if (preferred) utterance.voice = preferred;

        this.currentState = 'speaking';

        utterance.onend = () => {
          this.currentState = 'idle';
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          this.currentState = 'idle';
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        this.currentState = 'idle';
        if (onEnd) onEnd();
      }
    } else {
      if (onEnd) onEnd();
    }
  }

  public getState(): TtsState {
    return this.currentState;
  }
}

export const ttsService = new TextToSpeechService();
export const voiceService = ttsService; // backward compatibility

