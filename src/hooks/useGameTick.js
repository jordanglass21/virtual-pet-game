import { useEffect } from 'react';
import { useGameDispatch, useGameState } from '../state/GameContext.jsx';
import { TICK_INTERVAL_MS } from '../data/constants.js';

export function useGameTick() {
  const dispatch = useGameDispatch();
  const hasPet = Boolean(useGameState().pet);

  useEffect(() => {
    if (!hasPet) return undefined;

    dispatch({ type: 'TICK', payload: { now: Date.now() } });
    dispatch({ type: 'CHECK_DAILY_BONUS', payload: { now: Date.now() } });

    const interval = setInterval(() => {
      dispatch({ type: 'TICK', payload: { now: Date.now() } });
    }, TICK_INTERVAL_MS);

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        dispatch({ type: 'TICK', payload: { now: Date.now() } });
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [dispatch, hasPet]);
}
