interface MentalHealthTrack {
  name: string;
  url: string;
  type: 'meditation' | 'ambient' | 'nature' | 'healing';
  duration: number;
}

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.3;
  private currentTrackIndex: number = 0;
  private tracks: MentalHealthTrack[] = [];

  constructor() {
    this.initializeTracks();
    document.addEventListener('click', this.initAudioContext.bind(this), { once: true });
  }

  private initializeTracks() {
    this.tracks = [
      {
        name: 'Peaceful Mind',
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        type: 'meditation',
        duration: 300
      },
      {
        name: 'Ocean Waves',
        url: 'https://www.soundjay.com/nature/sounds/ocean-wave-1.wav',
        type: 'nature',
        duration: 600
      },
      {
        name: 'Gentle Rain',
        url: 'https://www.soundjay.com/nature/sounds/rain-02.wav',
        type: 'nature',
        duration: 450
      },
      {
        name: 'Healing Frequencies',
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        type: 'healing',
        duration: 420
      }
    ];
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async loadTrack(index: number = 0) {
    if (index >= this.tracks.length) index = 0;
    
    const track = this.tracks[index];
    this.currentTrackIndex = index;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    try {
      this.currentAudio = new Audio();
      this.currentAudio.volume = this.volume;
      this.currentAudio.loop = true;
      
      // Fallback to generated ambient sound if track fails to load
      this.currentAudio.onerror = () => {
        console.log('Audio track failed to load, using generated ambient sound');
        this.playGeneratedAmbient();
      };

      // For demo purposes, we'll use generated ambient sound
      this.playGeneratedAmbient();
      
    } catch (error) {
      console.log('Loading generated ambient sound');
      this.playGeneratedAmbient();
    }
  }

  private playGeneratedAmbient() {
    if (!this.audioContext) this.initAudioContext();
    if (!this.audioContext) return;

    // Create multiple oscillators for rich ambient sound
    const frequencies = [55, 110, 165, 220]; // Bass frequencies for calm effect
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
      oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
      
      // Subtle volume for each layer
      gainNode.gain.setValueAtTime(this.volume * 0.05 / frequencies.length, this.audioContext!.currentTime);
      
      oscillator.start();
      oscillators.push(oscillator);
      gainNodes.push(gainNode);
    });

    // Add subtle frequency modulation for organic feel
    setInterval(() => {
      if (this.isPlaying && oscillators.length > 0) {
        oscillators.forEach((osc, index) => {
          if (osc.frequency) {
            const baseFreq = frequencies[index];
            const variation = Math.sin(Date.now() / (3000 + index * 1000)) * 5;
            osc.frequency.setValueAtTime(baseFreq + variation, this.audioContext!.currentTime);
          }
        });
      }
    }, 200);

    this.isPlaying = true;
  }

  toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopMusic();
    } else {
      this.playMusic();
    }
    return this.isPlaying;
  }

  async playMusic() {
    if (!this.isPlaying) {
      await this.loadTrack(this.currentTrackIndex);
    }
  }

  stopMusic() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    this.isPlaying = false;
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (this.isPlaying) {
      this.stopMusic();
      this.playMusic();
    }
  }

  getCurrentTrack(): MentalHealthTrack | null {
    return this.tracks[this.currentTrackIndex] || null;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  playUISound(frequency: number = 800, duration: number = 100) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }
}

export const audioManager = new AudioManager();
