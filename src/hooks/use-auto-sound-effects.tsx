import { useEffect, useRef } from 'react';
import { useSoundEffects } from './use-sound-effects';
import { useSound } from '@/components/providers/SoundProvider';

/**
 * Hook to automatically add sound effects to common UI elements
 * This hook will attach event listeners to various elements to play sounds on interaction
 */
export function useAutoSoundEffects() {
  const {
    playButtonClick,
    playButtonHover,
    playToggle,
    playInputFocus,
    playInputType,
    playFormSubmit,
    playMenuOpen,
    playMenuClose
  } = useSoundEffects();
  
  const { soundEnabled, volume } = useSound();
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (initialized.current || !soundEnabled) return;
    initialized.current = true;

    // Function to handle button clicks
    const handleButtonClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.getAttribute('role') === 'button' ||
          target.classList.contains('clickable')) {
        playButtonClick(volume);
      }
    };

    // Function to handle button hover
    const handleButtonHover = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.getAttribute('role') === 'button' ||
          target.classList.contains('clickable')) {
        playButtonHover(volume * 0.8); // Slightly lower volume for hover
      }
    };

    // Function to handle toggle/checkbox/radio changes
    const handleToggleChange = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && 
         (target.getAttribute('type') === 'checkbox' || 
          target.getAttribute('type') === 'radio' ||
          target.getAttribute('type') === 'range')) {
        playToggle(volume);
      }
    };

    // Function to handle input focus
    const handleInputFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        playInputFocus(volume * 0.6);
      }
    };

    // Function to handle typing in inputs
    const handleInputType = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        playInputType(volume * 0.3);
      }
    };

    // Function to handle form submissions
    const handleFormSubmit = (e: Event) => {
      playFormSubmit(volume);
    };

    // Function to handle menu/dropdown opening
    const handleMenuOpen = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('aria-expanded') === 'true' || 
          target.classList.contains('menu-open') ||
          target.classList.contains('dropdown-open')) {
        playMenuOpen(volume);
      }
    };

    // Add event listeners to document
    document.addEventListener('click', handleButtonClick);
    document.addEventListener('mouseenter', handleButtonHover, { capture: true });
    document.addEventListener('change', handleToggleChange);
    document.addEventListener('focus', handleInputFocus, { capture: true });
    document.addEventListener('input', handleInputType);
    document.addEventListener('submit', handleFormSubmit);
    document.addEventListener('click', handleMenuOpen);

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('click', handleButtonClick);
      document.removeEventListener('mouseenter', handleButtonHover, { capture: true });
      document.removeEventListener('change', handleToggleChange);
      document.removeEventListener('focus', handleInputFocus, { capture: true });
      document.removeEventListener('input', handleInputType);
      document.removeEventListener('submit', handleFormSubmit);
      document.removeEventListener('click', handleMenuOpen);
    };
  }, [
    soundEnabled, 
    volume, 
    playButtonClick, 
    playButtonHover, 
    playToggle, 
    playInputFocus, 
    playInputType, 
    playFormSubmit, 
    playMenuOpen, 
    playMenuClose
  ]);

  // This hook doesn't return anything as it works automatically
  return null;
}