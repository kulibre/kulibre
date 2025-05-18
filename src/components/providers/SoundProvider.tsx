import React, { createContext, useContext, useState, useEffect } from 'react';
import soundEffects from '@/utils/soundEffects';

type SoundContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (volume: number) => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  // Get initial sound preference from localStorage or default to true
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Get initial volume from localStorage or default to 0.5
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('soundVolume');
    return saved !== null ? JSON.parse(saved) : 0.5;
  });

  // Toggle sound on/off
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Set volume and update all sound instances
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  // Save sound preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
    localStorage.setItem('soundVolume', JSON.stringify(volume));
    
    // Mute all sounds if disabled
    Object.values(soundEffects.sounds).forEach(sound => {
      sound.muted = !soundEnabled;
    });
  }, [soundEnabled, volume]);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}