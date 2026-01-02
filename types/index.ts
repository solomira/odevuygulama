export interface GradeSettings {
  midtermWeight: number;
  finalWeight: number;
  minimumFinalGrade: number;
  minimumSemesterGrade: number;
  letterGradesEnabled: boolean;
  letterGradeRanges: LetterGradeRange[];
}

export interface LetterGradeRange {
  letter: string;
  min: number;
  max: number;
  passing: boolean;
}

export interface GradeInput {
  midterm: number | null;
  final: number | null;
}

export interface CalculationResult {
  semesterGrade: number;
  passed: boolean;
  reasons: string[];
  letterGrade?: string;
  breakdown: {
    midtermContribution: number;
    finalContribution: number;
  };
  timestamp: Date;
}

export interface GoalInput {
  midterm: number | null;
  final: number | null;
  targetType: 'pass' | 'score' | 'letter';
  targetValue: number | string | null;
}

export interface GoalResult {
  requiredFinal: number | null;
  possible: boolean;
  message: string;
}

export const DEFAULT_SETTINGS: GradeSettings = {
  midtermWeight: 40,
  finalWeight: 60,
  minimumFinalGrade: 50,
  minimumSemesterGrade: 60,
  letterGradesEnabled: true,
  letterGradeRanges: [
    { letter: 'AA', min: 90, max: 100, passing: true },
    { letter: 'BA', min: 85, max: 89, passing: true },
    { letter: 'BB', min: 80, max: 84, passing: true },
    { letter: 'CB', min: 75, max: 79, passing: true },
    { letter: 'CC', min: 70, max: 74, passing: true },
    { letter: 'DC', min: 65, max: 69, passing: true },
    { letter: 'DD', min: 60, max: 64, passing: true },
    { letter: 'FD', min: 50, max: 59, passing: false },
    { letter: 'FF', min: 0, max: 49, passing: false },
  ],
};

