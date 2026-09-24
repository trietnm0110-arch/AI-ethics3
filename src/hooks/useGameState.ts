import { useState, useEffect, useCallback } from 'react';
import { PlayerState, RiskLevel } from '../types/game';
import { SCENARIOS } from '../data/scenarios';
import { sounds } from '../utils/soundEffects';

const STORAGE_KEY = 'integrity_quest_player_state_v2';

const INITIAL_STATE: PlayerState = {
  ethicsScore: 50,
  completedScenarioIds: [],
  decisions: {},
  history: [],
  unlockedCardIds: ['card_plagiarism', 'card_ai_assistance'], // Start with baseline unlocked
  reflections: {},
  currentChapter: 1,
  soundEnabled: true,
};

export function useGameState() {
  const [state, setState] = useState<PlayerState>(() => {
    if (typeof window === 'undefined') return INITIAL_STATE;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load player state from localStorage', e);
    }
    return INITIAL_STATE;
  });

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist player state to localStorage', e);
    }
  }, [state]);

  // Sync sound engine
  useEffect(() => {
    sounds.setEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  const toggleSound = useCallback(() => {
    setState((prev) => {
      const nextVal = !prev.soundEnabled;
      sounds.setEnabled(nextVal);
      if (nextVal) sounds.playBlip();
      return { ...prev, soundEnabled: nextVal };
    });
  }, []);

  const makeChoice = useCallback((scenarioId: string, choiceId: 'A' | 'B' | 'C' | 'D') => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    const choice = scenario.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Play appropriate sound
    if (choice.riskLevel === 'responsible') {
      sounds.playSuccess();
    } else if (choice.riskLevel === 'high_risk') {
      sounds.playWarning();
    } else {
      sounds.playChoiceSelect();
    }

    setState((prev) => {
      // Calculate score delta
      const prevDecision = prev.decisions[scenarioId];
      let newScore = prev.ethicsScore;

      // If replaying, adjust from previous choice delta
      if (prevDecision) {
        const oldChoice = scenario.choices.find((c) => c.id === prevDecision);
        if (oldChoice) {
          newScore -= oldChoice.ethicsScoreDelta;
        }
      }

      newScore = Math.max(0, Math.min(100, newScore + choice.ethicsScoreDelta));

      const updatedCompleted = prev.completedScenarioIds.includes(scenarioId)
        ? prev.completedScenarioIds
        : [...prev.completedScenarioIds, scenarioId];

      const newUnlockedCards = new Set(prev.unlockedCardIds);
      if (choice.unlockKnowledgeCardId) {
        newUnlockedCards.add(choice.unlockKnowledgeCardId);
      }

      const newHistory = [
        ...prev.history.filter((h) => h.scenarioId !== scenarioId),
        {
          scenarioId,
          choiceId,
          scoreDelta: choice.ethicsScoreDelta,
          timestamp: Date.now(),
          riskLevel: choice.riskLevel as RiskLevel,
        },
      ];

      return {
        ...prev,
        ethicsScore: newScore,
        completedScenarioIds: updatedCompleted,
        decisions: {
          ...prev.decisions,
          [scenarioId]: choiceId,
        },
        history: newHistory,
        unlockedCardIds: Array.from(newUnlockedCards),
      };
    });
  }, []);

  const replayScenario = useCallback((scenarioId: string) => {
    sounds.playChoiceSelect();
    setState((prev) => {
      // Keep completed, just allow re-choosing
      return {
        ...prev,
        bookmarkScenarioId: scenarioId,
      };
    });
  }, []);

  const saveReflections = useCallback((reflections: PlayerState['reflections']) => {
    sounds.playSuccess();
    setState((prev) => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        ...reflections,
      },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    sounds.playWarning();
    setState(INITIAL_STATE);
  }, []);

  // Summary statistics
  const totalCompleted = state.completedScenarioIds.length;
  const decisionsMade = Object.keys(state.decisions).length;

  let responsibleCount = 0;
  let riskyCount = 0;
  let moderateCount = 0;

  Object.entries(state.decisions).forEach(([scenId, chId]) => {
    const sc = SCENARIOS.find((s) => s.id === scenId);
    const ch = sc?.choices.find((c) => c.id === chId);
    if (ch) {
      if (ch.riskLevel === 'responsible') responsibleCount++;
      else if (ch.riskLevel === 'high_risk') riskyCount++;
      else moderateCount++;
    }
  });

  return {
    state,
    toggleSound,
    makeChoice,
    replayScenario,
    saveReflections,
    resetProgress,
    stats: {
      totalCompleted,
      decisionsMade,
      responsibleCount,
      riskyCount,
      moderateCount,
      unlockedCardsCount: state.unlockedCardIds.length,
      totalScenarios: SCENARIOS.length,
    },
  };
}
