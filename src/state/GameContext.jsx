import { createContext, useContext, useEffect, useReducer } from 'react';
import { gameReducer } from './gameReducer.js';
import { createInitialState } from './initialState.js';
import { loadGame, saveGame } from './persistence.js';

const GameStateContext = createContext(null);
const GameDispatchContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => loadGame() ?? createInitialState());

  useEffect(() => {
    saveGame(state);
  }, [state]);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>{children}</GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === null) throw new Error('useGameState must be used within a GameProvider');
  return context;
}

export function useGameDispatch() {
  const context = useContext(GameDispatchContext);
  if (context === null) throw new Error('useGameDispatch must be used within a GameProvider');
  return context;
}
