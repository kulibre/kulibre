// Sound effects utility for the application
const soundEffects = {
  // Sound instances
  sounds: {
    buttonClick: new Audio('/sounds/button-click.mp3'),
    toggle: new Audio('/sounds/toggle-switch.mp3'),
    success: new Audio('/sounds/success-chime.mp3'),
    error: new Audio('/sounds/error-blip.mp3'),
    notification: new Audio('/sounds/notification-ping.mp3'),
    pageTransition: new Audio('/sounds/page-transition-whoosh.mp3'),
  },

  // Play a sound effect
  play: function(soundName, volume = 0.5) {
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

  // Initialize sound effects (preload sounds)
  init: function() {
    // Set all sounds to preload
    Object.values(this.sounds).forEach(sound => {
      sound.preload = 'auto';
    });
    
    // Set all sounds to low volume by default
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });
  }
};

// Initialize sounds when imported
soundEffects.init();

export default soundEffects;