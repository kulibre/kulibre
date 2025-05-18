// Sound effects utility for the application
interface SoundEffects {
  sounds: Record<string, HTMLAudioElement>;
  play: (soundName: string, volume?: number) => void;
  init: () => void;
  playRandomVariant: (baseSound: string, volume?: number) => void;
}

const soundEffects: SoundEffects = {
  // Sound instances with modern gaming UI sounds
  sounds: {
    // Basic UI interactions
    buttonClick: new Audio('/sounds/ui-click.mp3'),
    buttonHover: new Audio('/sounds/ui-hover.mp3'),
    toggle: new Audio('/sounds/ui-toggle.mp3'),
    
    // Feedback sounds
    success: new Audio('/sounds/success-achievement.mp3'),
    error: new Audio('/sounds/error-alert.mp3'),
    notification: new Audio('/sounds/notification-alert.mp3'),
    
    // Navigation sounds
    pageTransition: new Audio('/sounds/page-swipe.mp3'),
    menuOpen: new Audio('/sounds/menu-open.mp3'),
    menuClose: new Audio('/sounds/menu-close.mp3'),
    
    // Form interaction sounds
    formSubmit: new Audio('/sounds/form-submit.mp3'),
    inputFocus: new Audio('/sounds/input-focus.mp3'),
    inputType: new Audio('/sounds/input-type.mp3'),
    
    // Variants for randomization
    buttonClick1: new Audio('/sounds/ui-click-1.mp3'),
    buttonClick2: new Audio('/sounds/ui-click-2.mp3'),
    buttonClick3: new Audio('/sounds/ui-click-3.mp3'),
    
    // Special interaction sounds
    levelUp: new Audio('/sounds/level-up.mp3'),
    unlock: new Audio('/sounds/unlock.mp3'),
    powerUp: new Audio('/sounds/power-up.mp3'),
    achievement: new Audio('/sounds/achievement.mp3'),
  },

  // Play a sound effect
  play: function(soundName: string, volume: number = 0.5): void {
    if (this.sounds[soundName]) {
      // Reset the audio to the beginning
      this.sounds[soundName].currentTime = 0;
      // Set volume (0.0 to 1.0)
      this.sounds[soundName].volume = volume;
      // Play the sound
      this.sounds[soundName].play().catch(e => {
        // Handle autoplay restrictions gracefully
        console.log('Sound play prevented:', e);
      });
    }
  },
  
  // Play a random variant of a sound for more dynamic feel
  playRandomVariant: function(baseSound: string, volume: number = 0.5): void {
    // Find all variants of this sound (e.g., buttonClick1, buttonClick2, etc.)
    const variants = Object.keys(this.sounds).filter(key => 
      key === baseSound || key.startsWith(`${baseSound}`)
    );
    
    if (variants.length > 0) {
      // Pick a random variant
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      this.play(randomVariant, volume);
    }
  },

  // Initialize sound effects (preload sounds)
  init: function(): void {
    // Set all sounds to preload
    Object.values(this.sounds).forEach(sound => {
      // Type assertion to HTMLAudioElement
      (sound as HTMLAudioElement).preload = 'auto';
    });
    
    // Set all sounds to low volume by default
    Object.values(this.sounds).forEach(sound => {
      // Type assertion to HTMLAudioElement
      (sound as HTMLAudioElement).volume = 0.5;
    });
  }
};

// Initialize sounds when imported
soundEffects.init();

export default soundEffects;
