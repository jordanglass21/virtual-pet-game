import { useEffect, useRef, useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useGameDispatch, useGameState } from '../../state/GameContext.jsx';
import { SLOT_SYMBOLS, randomSymbol, PAIR_PAYOUT_MULTIPLIER, BET_OPTIONS } from '../../data/slotSymbols.js';

const REEL_STOP_DELAYS_MS = [500, 800, 1100];
const REEL_CYCLE_INTERVAL_MS = 70;

export default function SlotMachineModal({ onClose }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [betAmount, setBetAmount] = useState(BET_OPTIONS[0]);
  const [reels, setReels] = useState(() => [randomSymbol(), randomSymbol(), randomSymbol()]);
  const [spinning, setSpinning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  function resolveSpin(finalSymbols, bet) {
    const counts = {};
    finalSymbols.forEach((s) => {
      counts[s.id] = (counts[s.id] ?? 0) + 1;
    });
    const maxCount = Math.max(...Object.values(counts));

    let payout = 0;
    let outcome = 'lose';
    if (maxCount === 3) {
      const matchedId = Object.keys(counts).find((id) => counts[id] === 3);
      const symbol = SLOT_SYMBOLS.find((s) => s.id === matchedId);
      payout = bet * symbol.matchPayout;
      outcome = 'jackpot';
    } else if (maxCount === 2) {
      payout = bet * PAIR_PAYOUT_MULTIPLIER;
      outcome = 'pair';
    }

    dispatch({ type: 'SLOT_SPIN', payload: { bet, payout } });
    setLastResult({ payout, outcome });
    setSpinning(false);
  }

  function handleSpin() {
    if (spinning || betAmount > state.currency) return;
    setSpinning(true);
    setLastResult(null);

    const finalSymbols = [randomSymbol(), randomSymbol(), randomSymbol()];
    timersRef.current = [];

    REEL_STOP_DELAYS_MS.forEach((delay, reelIndex) => {
      const intervalId = setInterval(() => {
        setReels((prev) => {
          const next = [...prev];
          next[reelIndex] = randomSymbol();
          return next;
        });
      }, REEL_CYCLE_INTERVAL_MS);
      timersRef.current.push(intervalId);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setReels((prev) => {
          const next = [...prev];
          next[reelIndex] = finalSymbols[reelIndex];
          return next;
        });
        if (reelIndex === REEL_STOP_DELAYS_MS.length - 1) {
          resolveSpin(finalSymbols, betAmount);
        }
      }, delay);
      timersRef.current.push(timeoutId);
    });
  }

  return (
    <Modal title="Slot Machine" onClose={onClose}>
      <p style={{ textAlign: 'center', fontSize: 13 }}>You have ${state.currency}</p>

      <div className="slot-reels">
        {reels.map((symbol, i) => (
          <div key={i} className="slot-reel">
            <symbol.Icon />
          </div>
        ))}
      </div>

      <p className="slot-result-line">
        {lastResult?.outcome === 'jackpot' && `Jackpot! +$${lastResult.payout}`}
        {lastResult?.outcome === 'pair' && 'Pair! Bet returned.'}
        {lastResult?.outcome === 'lose' && 'No match - better luck next time!'}
        {!lastResult && ' '}
      </p>

      <div className="slot-bet-chips">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            type="button"
            className={`btn-retro${amount === betAmount ? ' selected' : ''}`}
            disabled={spinning || amount > state.currency}
            onClick={() => setBetAmount(amount)}
          >
            ${amount}
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button type="button" className="btn-retro" onClick={handleSpin} disabled={spinning || betAmount > state.currency}>
          {spinning ? 'Spinning...' : `Spin ($${betAmount})`}
        </button>
      </div>

      <div className="panel-sunken slot-payout-table">
        <div>3x 7 = 20x bet</div>
        <div>3x Star = 10x bet</div>
        <div>3x Bell = 5x bet</div>
        <div>3x Cherry = 3x bet</div>
        <div>Any pair = bet back</div>
      </div>
    </Modal>
  );
}
