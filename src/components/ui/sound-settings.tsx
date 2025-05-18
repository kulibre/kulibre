import React from 'react';
import { useSound } from '@/components/providers/SoundProvider';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { Volume2, VolumeX, Volume } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export function SoundSettings() {
  const { soundEnabled, toggleSound, volume, setVolume } = useSound();
  const { playToggle } = useSoundEffects();

  const handleToggle = () => {
    playToggle();
    toggleSound();
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <div className="flex items-center space-x-4 p-2 rounded-md bg-background border">
      <button 
        onClick={handleToggle}
        className="p-2 rounded-md hover:bg-muted transition-colors"
        aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
      >
        {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
      
      {soundEnabled && (
        <div className="flex items-center space-x-2 w-32">
          <Volume className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}