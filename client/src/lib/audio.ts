export class AudioManager {
  private audioContext: AudioContext | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.3;

  constructor() {
    // Initialize audio context on first user interaction
    document.addEventListener('click', this.initAudioContext.bind(this), { once: true });
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async loadBackgroundMusic(url?: string) {
    // For now, we'll create a simple oscillator for ambient sound
    // In production, you would load actual audio files
    if (!this.audioContext) {
      this.initAudioContext();
    }
  }

  toggleMusic(): boolean {
    if (!this.audioContext) {
      this.initAudioContext();
    }

    if (this.isPlaying) {
      this.stopMusic();
    } else {
      this.playMusic();
    }

    return this.isPlaying;
  }

  private playMusic() {
    if (!this.audioContext) return;

    // Create ambient sound using Web Audio API
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(55, this.audioContext.currentTime); // Low ambient tone
    gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);

    oscillator.start();
    
    // Create a slowly changing ambient effect
    setInterval(() => {
      if (this.isPlaying && oscillator.frequency) {
        const variation = Math.sin(Date.now() / 5000) * 10;
        oscillator.frequency.setValueAtTime(55 + variation, this.audioContext!.currentTime);
      }
    }, 100);

    this.isPlaying = true;
  }

  private stopMusic() {
    this.isPlaying = false;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  playUISound(frequency: number = 800, duration: number = 100) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }
}

export const audioManager = new AudioManager();
