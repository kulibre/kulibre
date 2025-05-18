import { useAutoSoundEffects } from '@/hooks/use-auto-sound-effects';

/**
 * Component that automatically adds sound effects to UI interactions
 * Just include this component once in your app (ideally near the root)
 * and it will handle adding sound effects to common UI interactions
 */
export function AutoSoundEffects() {
  // This hook sets up all the event listeners
  useAutoSoundEffects();
  
  // This component doesn't render anything
  return null;
}