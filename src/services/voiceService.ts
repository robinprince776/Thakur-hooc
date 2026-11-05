// J.A.R.V.I.S Global Voice Service & Command Registry

export interface VoiceCommandAction {
  id: string;
  keywords: string[];
  description: string;
  category: 'navigation' | 'system' | 'action';
  execute: (param?: string) => void | string;
  responseVoice: string;
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

class VoiceService {
  private recognition: any = null;
  private isSupported: boolean = false;
  private commands: VoiceCommandAction[] = [];
  private onStateChangeCallback?: (state: VoiceState, text?: string) => void;
  private onTranscriptCallback?: (transcript: string, isFinal: boolean) => void;
  private currentState: VoiceState = 'idle';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-IN'; // Default Hinglish/Indian English
        this.isSupported = true;
        this.setupRecognitionListeners();
      }
    }
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public registerCommand(command: VoiceCommandAction) {
    this.commands.push(command);
  }

  public setCallbacks(
    onStateChange: (state: VoiceState, text?: string) => void,
    onTranscript: (transcript: string, isFinal: boolean) => void
  ) {
    this.onStateChangeCallback = onStateChange;
    this.onTranscriptCallback = onTranscript;
  }

  private setState(state: VoiceState, message?: string) {
    this.currentState = state;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(state, message);
    }
  }

  private setupRecognitionListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.setState('listening', 'J.A.R.V.I.S is listening...');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      if (this.onTranscriptCallback && activeText) {
        this.onTranscriptCallback(activeText, Boolean(finalTranscript));
      }

      if (finalTranscript) {
        this.setState('processing', 'Analyzing command...');
        this.executeCommand(finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      const err = event.error;
      console.warn('Speech recognition warning:', err);
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        this.setState('error', 'Microphone permission denied. Click mic icon and allow permission.');
      } else if (err === 'no-speech') {
        this.setState('idle', 'No speech detected.');
      } else {
        this.setState('error', `Voice input note: ${err}`);
      }
      setTimeout(() => {
        if (this.currentState === 'error') {
          this.setState('idle');
        }
      }, 4000);
    };

    this.recognition.onend = () => {
      if (this.currentState === 'listening') {
        this.setState('idle');
      }
    };
  }

  public cancelSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (this.currentState === 'speaking') {
      this.setState('idle');
    }
  }

  public startListening(lang: 'en-IN' | 'hi-IN' | 'en-US' = 'en-IN') {
    if (!this.isSupported || !this.recognition) {
      this.setState('error', 'Speech recognition not supported in this browser.');
      return;
    }

    try {
      this.recognition.lang = lang;
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.setState('idle');
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.0;
      utterance.rate = 1.05;

      // Select natural sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.includes('en-IN') || v.name.includes('Google') || v.name.includes('Natural')
      );
      if (preferred) utterance.voice = preferred;

      this.setState('speaking', text);

      utterance.onend = () => {
        this.setState('idle');
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.setState('idle');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }

  public executeCommand(rawUtterance: string): boolean {
    const text = rawUtterance.toLowerCase().trim();

    // Find best matching registered command
    for (const cmd of this.commands) {
      for (const kw of cmd.keywords) {
        if (text.includes(kw.toLowerCase())) {
          // Found match
          try {
            cmd.execute(text);
            this.speak(cmd.responseVoice);
            return true;
          } catch (err) {
            console.error('Command execution failed:', err);
            this.speak('Encountered an issue executing that command.');
            return false;
          }
        }
      }
    }

    // Fallback: search or report unrecognized
    this.speak(`Command not recognized: "${rawUtterance}". Try saying "Open Cyber Lab" or "Show My Progress".`);
    setTimeout(() => this.setState('idle'), 2500);
    return false;
  }
}

export const voiceService = new VoiceService();
