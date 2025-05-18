import { useCallback } from 'react';
import soundEffects from '@/utils/soundEffects';

export function useSoundEffects() {
  // Basic UI interaction sounds
  const playButtonClick = useCallback((volume = 0.5) => {
    // Use random variant for more dynamic feel
    soundEffects.playRandomVariant('buttonClick', volume);
  }, []);

  const playButtonHover = useCallback((volume = 0.4) => {
    soundEffects.play('buttonHover', volume);
  }, []);

  const playToggle = useCallback((volume = 0.5) => {
    soundEffects.play('toggle', volume);
  }, []);

  // Feedback sounds
  const playSuccess = useCallback((volume = 0.5) => {
    soundEffects.play('success', volume);
  }, []);

  const playError = useCallback((volume = 0.5) => {
    soundEffects.play('error', volume);
  }, []);

  const playNotification = useCallback((volume = 0.5) => {
    soundEffects.play('notification', volume);
  }, []);

  // Navigation sounds
  const playPageTransition = useCallback((volume = 0.5) => {
    soundEffects.play('pageTransition', volume);
  }, []);

  const playMenuOpen = useCallback((volume = 0.5) => {
    soundEffects.play('menuOpen', volume);
  }, []);

  const playMenuClose = useCallback((volume = 0.5) => {
    soundEffects.play('menuClose', volume);
  }, []);

  // Form interaction sounds
  const playFormSubmit = useCallback((volume = 0.5) => {
    soundEffects.play('formSubmit', volume);
  }, []);

  const playInputFocus = useCallback((volume = 0.3) => {
    soundEffects.play('inputFocus', volume);
  }, []);

  const playInputType = useCallback((volume = 0.2) => {
    soundEffects.play('inputType', volume);
  }, []);

  // Special interaction sounds
  const playLevelUp = useCallback((volume = 0.6) => {
    soundEffects.play('levelUp', volume);
  }, []);

  const playUnlock = useCallback((volume = 0.6) => {
    soundEffects.play('unlock', volume);
  }, []);

  const playPowerUp = useCallback((volume = 0.6) => {
    soundEffects.play('powerUp', volume);
  }, []);

  const playAchievement = useCallback((volume = 0.6) => {
    soundEffects.play('achievement', volume);
  }, []);

  return {
    // Basic UI interactions
    playButtonClick,
    playButtonHover,
    playToggle,
    
    // Feedback sounds
    playSuccess,
    playError,
    playNotification,
    
    // Navigation sounds
    playPageTransition,
    playMenuOpen,
    playMenuClose,
    
    // Form interaction sounds
    playFormSubmit,
    playInputFocus,
    playInputType,
    
    // Special interaction sounds
    playLevelUp,
    playUnlock,
    playPowerUp,
    playAchievement
  };
}