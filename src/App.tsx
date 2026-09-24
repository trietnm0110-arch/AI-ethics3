import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { SCENARIOS } from './data/scenarios';
import { Choice } from './types/game';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ChapterSelect } from './components/ChapterSelect';
import { VisualNovelScreen } from './components/VisualNovelScreen';
import { EthicsAnalysisScreen } from './components/EthicsAnalysisScreen';
import { FinalReflectionScreen } from './components/FinalReflectionScreen';
import { DrLinhChatModal } from './components/DrLinhChatModal';
import { KnowledgeCardsModal } from './components/KnowledgeCardsModal';
import { DecisionMapModal } from './components/DecisionMapModal';
import { TutorialModal } from './components/TutorialModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { sounds } from './utils/soundEffects';

type AppView = 'landing' | 'chapters' | 'scenario' | 'analysis' | 'reflection';

export default function App() {
  const {
    state,
    toggleSound,
    makeChoice,
    replayScenario,
    saveReflections,
    resetProgress,
    stats,
  } = useGameState();

  // Navigation views
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [analysisChoice, setAnalysisChoice] = useState<Choice | null>(null);

  // Modals state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isKnowledgeCardsOpen, setIsKnowledgeCardsOpen] = useState(false);
  const [isDecisionMapOpen, setIsDecisionMapOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);

  // Active scenario object
  const activeScenario =
    SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // Check if current scenario has a next one
  const currentIndex = SCENARIOS.findIndex((s) => s.id === activeScenario.id);
  const hasNextScenario = currentIndex < SCENARIOS.length - 1;

  // Handlers
  const handleStartGame = () => {
    // Pick first uncompleted scenario or scenario 1
    const uncompleted = SCENARIOS.find(
      (s) => !state.completedScenarioIds.includes(s.id)
    );
    setActiveScenarioId(uncompleted ? uncompleted.id : SCENARIOS[0].id);
    setCurrentView('scenario');
  };

  const handleSelectScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setCurrentView('scenario');
  };

  const handleScenarioChoice = (scenarioId: string, choiceId: 'A' | 'B' | 'C' | 'D') => {
    makeChoice(scenarioId, choiceId);
  };

  const handleOpenAnalysis = (choice: Choice) => {
    setAnalysisChoice(choice);
    setCurrentView('analysis');
  };

  const handleNextFromAnalysis = () => {
    if (hasNextScenario) {
      const nextScenario = SCENARIOS[currentIndex + 1];
      setActiveScenarioId(nextScenario.id);
      setCurrentView('scenario');
    } else {
      setCurrentView('reflection');
    }
  };

  const handleReplayCurrentScenario = () => {
    setCurrentView('scenario');
  };

  const handleSelectScenarioToReplay = (scenarioId: string) => {
    setIsDecisionMapOpen(false);
    replayScenario(scenarioId);
    setActiveScenarioId(scenarioId);
    setCurrentView('scenario');
  };

  const handleOpenKnowledgeCard = (cardId: string) => {
    setIsKnowledgeCardsOpen(true);
  };

  const handleOpenChatWithTopic = (topic: string) => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Header with Ethics Meter */}
      <Header
        ethicsScore={state.ethicsScore}
        completedCount={state.completedScenarioIds.length}
        totalScenarios={SCENARIOS.length}
        soundEnabled={state.soundEnabled}
        onToggleSound={toggleSound}
        onOpenKnowledgeCards={() => setIsKnowledgeCardsOpen(true)}
        onOpenDecisionMap={() => setIsDecisionMapOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
        onReset={() => {
          resetProgress();
          setCurrentView('landing');
        }}
        onGoHome={() => setCurrentView('landing')}
      />

      {/* Sub-nav quick link bar when playing */}
      {currentView !== 'landing' && (
        <div className="border-b border-slate-900 bg-slate-950/60 px-4 py-2 text-xs flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playBlip();
                setCurrentView('chapters');
              }}
              className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 font-medium"
            >
              ← Danh sách các Chương
            </button>
            {currentView === 'scenario' && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-slate-200 font-semibold truncate max-w-xs sm:max-w-md">
                  Hồi {activeScenario.chapterId}: {activeScenario.title}
                </span>
              </>
            )}
            {currentView === 'analysis' && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-indigo-300 font-semibold truncate max-w-xs sm:max-w-md">
                  Phân tích Đạo đức: {activeScenario.title}
                </span>
              </>
            )}
            {currentView === 'reflection' && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-purple-300 font-semibold">Bản Tự Phản Tư Cuối Khóa</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playBlip();
                setIsTutorialOpen(true);
              }}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Hướng dẫn
            </button>
          </div>
        </div>
      )}

      {/* Main Body View Switching */}
      <main className="flex-1 px-3 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        {currentView === 'landing' && (
          <LandingPage
            completedCount={state.completedScenarioIds.length}
            totalScenarios={SCENARIOS.length}
            onStart={handleStartGame}
            onContinue={() => setCurrentView('chapters')}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {currentView === 'chapters' && (
          <ChapterSelect
            completedScenarioIds={state.completedScenarioIds}
            decisions={state.decisions}
            onSelectScenario={handleSelectScenario}
            onOpenKnowledgeCards={() => setIsKnowledgeCardsOpen(true)}
            onOpenReflection={() => setCurrentView('reflection')}
          />
        )}

        {currentView === 'scenario' && (
          <VisualNovelScreen
            scenario={activeScenario}
            currentChoiceId={state.decisions[activeScenario.id]}
            onMakeChoice={handleScenarioChoice}
            onOpenAnalysis={handleOpenAnalysis}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {currentView === 'analysis' && analysisChoice && (
          <EthicsAnalysisScreen
            scenario={activeScenario}
            choice={analysisChoice}
            onNextScenario={handleNextFromAnalysis}
            onReplayScenario={handleReplayCurrentScenario}
            onOpenKnowledgeCard={handleOpenKnowledgeCard}
            onOpenChatWithTopic={handleOpenChatWithTopic}
            hasNextScenario={hasNextScenario}
          />
        )}

        {currentView === 'reflection' && (
          <FinalReflectionScreen
            stats={stats}
            ethicsScore={state.ethicsScore}
            savedReflections={state.reflections}
            onSaveReflections={saveReflections}
            onReplayFromStart={() => {
              resetProgress();
              setActiveScenarioId(SCENARIOS[0].id);
              setCurrentView('scenario');
            }}
            onOpenKnowledgeCards={() => setIsKnowledgeCardsOpen(true)}
            onBackToChapters={() => setCurrentView('chapters')}
            onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      <DrLinhChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentScenarioTitle={currentView === 'scenario' ? activeScenario.title : undefined}
      />

      <KnowledgeCardsModal
        isOpen={isKnowledgeCardsOpen}
        onClose={() => setIsKnowledgeCardsOpen(false)}
        unlockedCardIds={state.unlockedCardIds}
      />

      <DecisionMapModal
        isOpen={isDecisionMapOpen}
        onClose={() => setIsDecisionMapOpen(false)}
        completedScenarioIds={state.completedScenarioIds}
        decisions={state.decisions}
        onSelectScenarioToReplay={handleSelectScenarioToReplay}
      />

      <GoogleDriveModal
        isOpen={isGoogleDriveOpen}
        onClose={() => setIsGoogleDriveOpen(false)}
        reflectionData={{
          ethicsScore: state.ethicsScore,
          stats,
          savedReflections: state.reflections,
        }}
        unlockedCardsCount={state.unlockedCardIds.length}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onStartPlaying={() => {
          setIsTutorialOpen(false);
          handleStartGame();
        }}
      />
    </div>
  );
}
