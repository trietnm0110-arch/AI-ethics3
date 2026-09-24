export type CharacterId = 'alex' | 'mia' | 'dr_linh' | 'aura' | 'minh' | 'narrator';

export type CharacterMood = 'normal' | 'worried' | 'strict' | 'happy' | 'thinking' | 'surprised';

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  avatarBg: string;
  avatarIcon: string;
  textColor: string;
  badge: string;
  description: string;
}

export type RiskLevel = 'responsible' | 'moderate' | 'high_risk' | 'grey_zone';

export type IntegrityCategory =
  | 'Plagiarism'
  | 'Academic Misconduct'
  | 'Unauthorized Assistance'
  | 'Non-Disclosure'
  | 'Fabrication & Hallucination'
  | 'Patchwriting'
  | 'Responsible AI Co-work'
  | 'Collusion'
  | 'Falsification'
  | 'Data Falsification';

export interface ConsequenceSceneNode {
  speaker: CharacterId;
  text: string;
  emotion?: CharacterMood;
}

export interface ChoiceConsequence {
  immediateScene: ConsequenceSceneNode[];
  summaryTitle: string;
  summaryDesc: string;
  academicImpact: string;
  gradeStatus: 'Thành công' | 'Cần rà soát' | 'Nhắc nhở' | 'Khiếu nại / Điểm 0' | 'Được tuyên dương';
  statusColor: 'emerald' | 'amber' | 'rose' | 'indigo';
}

export interface EthicsAnalysis {
  yourDecision: string;
  whatHappened: string;
  whyDoesItMatter: string;
  category: IntegrityCategory;
  categoryVi: string;
  howToHandleBetter: string;
  institutionalDisclaimer: string;
}

export interface Choice {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  description: string;
  riskLevel: RiskLevel;
  ethicsScoreDelta: number;
  consequence: ChoiceConsequence;
  ethicsAnalysis: EthicsAnalysis;
  unlockKnowledgeCardId?: string;
}

export interface Scenario {
  id: string;
  chapterId: number;
  order: number;
  title: string;
  subtitle: string;
  setting: string;
  settingType: 'dorm' | 'library' | 'office' | 'group_room' | 'exam_hall';
  prologueDialogues: ConsequenceSceneNode[];
  dilemmaPrompt: string;
  choices: Choice[];
}

export interface Chapter {
  id: number;
  title: string;
  titleVi: string;
  description: string;
  scenarioIds: string[];
  iconName: string;
  colorTheme: string;
}

export interface KnowledgeCard {
  id: string;
  title: string;
  titleVi: string;
  category: string;
  summary: string;
  icon: string;
  keyPrinciples: string[];
  doAndDont: {
    do: string[];
    dont: string[];
  };
  universityPolicyQuote: string;
}

export interface PlayerHistoryEntry {
  scenarioId: string;
  choiceId: 'A' | 'B' | 'C' | 'D';
  scoreDelta: number;
  timestamp: number;
  riskLevel: RiskLevel;
}

export interface PlayerState {
  ethicsScore: number; // 0 to 100
  completedScenarioIds: string[];
  decisions: Record<string, 'A' | 'B' | 'C' | 'D'>;
  history: PlayerHistoryEntry[];
  unlockedCardIds: string[];
  reflections: {
    hardestScenario?: string;
    boundaryReflection?: string;
    verificationSource?: string;
  };
  currentChapter: number;
  soundEnabled: boolean;
}
