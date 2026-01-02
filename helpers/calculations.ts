import { GradeSettings, GradeInput, CalculationResult, GoalInput, GoalResult, LetterGradeRange } from '../types';
import { Translations } from '../context/LanguageContext';

export const validateGrade = (grade: number | null): boolean => {
  if (grade === null || grade === undefined) return false;
  return grade >= 0 && grade <= 100;
};

export const calculateSemesterGrade = (
  midterm: number,
  final: number,
  settings: GradeSettings
): number => {
  const totalWeight = settings.midtermWeight + settings.finalWeight;
  if (totalWeight === 0) return 0;
  
  const midtermContribution = (midterm * settings.midtermWeight) / totalWeight;
  const finalContribution = (final * settings.finalWeight) / totalWeight;
  return midtermContribution + finalContribution;
};

export const checkPassFail = (
  midterm: number,
  final: number,
  semesterGrade: number,
  settings: GradeSettings,
  t: Translations
): { passed: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  let passed = true;

  if (final < settings.minimumFinalGrade) {
    passed = false;
    reasons.push(
      t.calculations.finalBelowMinimum
        .replace('{final}', final.toFixed(1))
        .replace('{minimum}', settings.minimumFinalGrade.toString())
    );
  }

  if (semesterGrade < settings.minimumSemesterGrade) {
    passed = false;
    reasons.push(
      t.calculations.semesterBelowMinimum
        .replace('{semester}', semesterGrade.toFixed(1))
        .replace('{minimum}', settings.minimumSemesterGrade.toString())
    );
  }

  if (settings.letterGradesEnabled) {
    const letterGrade = getLetterGrade(semesterGrade, settings.letterGradeRanges);
    if (letterGrade) {
      const letterRange = settings.letterGradeRanges.find((r) => r.letter === letterGrade);
      if (letterRange && !letterRange.passing) {
        passed = false;
        reasons.push(
          t.calculations.letterGradeFail
            .replace('{letter}', letterGrade)
        );
      } else if (letterRange && letterRange.passing) {
        if (passed) {
          reasons.push(
            t.calculations.letterGradePass
              .replace('{letter}', letterGrade)
          );
        }
      }
    }
  }

  if (passed && reasons.length === 0) {
    reasons.push(
      t.calculations.congratulations.replace('{grade}', semesterGrade.toFixed(1))
    );
  }

  return { passed, reasons };
};

export const getLetterGrade = (
  semesterGrade: number,
  letterGradeRanges: LetterGradeRange[]
): string | undefined => {
  for (const range of letterGradeRanges) {
    if (semesterGrade >= range.min && semesterGrade <= range.max) {
      return range.letter;
    }
  }
  return undefined;
};

export const performCalculation = (
  input: GradeInput,
  settings: GradeSettings,
  t: Translations
): CalculationResult | null => {
  if (!validateGrade(input.midterm) || !validateGrade(input.final)) {
    return null;
  }

  const midterm = input.midterm!;
  const final = input.final!;

  const semesterGrade = calculateSemesterGrade(midterm, final, settings);
  const { passed, reasons } = checkPassFail(midterm, final, semesterGrade, settings, t);

  let letterGrade: string | undefined;
  if (settings.letterGradesEnabled) {
    letterGrade = getLetterGrade(semesterGrade, settings.letterGradeRanges);
  }

  const totalWeight = settings.midtermWeight + settings.finalWeight;
  const midtermContribution = totalWeight > 0 ? (midterm * settings.midtermWeight) / totalWeight : 0;
  const finalContribution = totalWeight > 0 ? (final * settings.finalWeight) / totalWeight : 0;

  return {
    semesterGrade,
    passed,
    reasons,
    letterGrade,
    breakdown: {
      midtermContribution,
      finalContribution,
    },
    timestamp: new Date(),
  };
};

export const calculateGoal = (
  goalInput: GoalInput,
  settings: GradeSettings,
  t: Translations
): GoalResult => {
  if (!validateGrade(goalInput.midterm)) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.invalidMidterm,
    };
  }

  const midterm = goalInput.midterm!;

  if (goalInput.final !== null && validateGrade(goalInput.final)) {
    const final = goalInput.final;
    const semesterGrade = calculateSemesterGrade(midterm, final, settings);
    const { passed, reasons } = checkPassFail(midterm, final, semesterGrade, settings, t);
    
    if (goalInput.targetType === 'pass') {
      if (passed) {
        return {
          requiredFinal: final,
          possible: true,
          message: t.calculations.currentStatusPass
            .replace('{semester}', semesterGrade.toFixed(1))
            .replace('{final}', final.toFixed(1)),
        };
      } else {
        const totalWeight = settings.midtermWeight + settings.finalWeight;
        if (totalWeight === 0 || settings.finalWeight === 0) {
          return {
            requiredFinal: null,
            possible: false,
            message: t.calculations.invalidWeights,
          };
        }
        
        const midtermContribution = (midterm * settings.midtermWeight) / totalWeight;
        const requiredFinalContribution = settings.minimumSemesterGrade - midtermContribution;
        const requiredFinal = (requiredFinalContribution * totalWeight) / settings.finalWeight;
        
        let adjustedRequiredFinal = requiredFinal;
        if (requiredFinal < settings.minimumFinalGrade) {
          adjustedRequiredFinal = settings.minimumFinalGrade;
          const adjustedSemesterGrade = calculateSemesterGrade(midterm, adjustedRequiredFinal, settings);
          if (adjustedSemesterGrade < settings.minimumSemesterGrade) {
            return {
              requiredFinal: null,
              possible: false,
              message: t.calculations.impossiblePass
                .replace('{minimumFinal}', settings.minimumFinalGrade.toString())
                .replace('{minimumSemester}', settings.minimumSemesterGrade.toString()),
            };
          }
        }
        
        return {
          requiredFinal: adjustedRequiredFinal,
          possible: true,
          message: t.calculations.currentStatusFail
            .replace('{semester}', semesterGrade.toFixed(1))
            .replace('{final}', final.toFixed(1))
            .replace('{required}', adjustedRequiredFinal.toFixed(1)),
        };
      }
    } else if (goalInput.targetType === 'score') {
      if (!goalInput.targetValue || typeof goalInput.targetValue !== 'number') {
        return {
          requiredFinal: null,
          possible: false,
          message: t.calculations.invalidTargetScore,
        };
      }
      const targetScore = goalInput.targetValue as number;
      
      if (semesterGrade >= targetScore) {
        return {
          requiredFinal: final,
          possible: true,
          message: t.calculations.currentStatusScoreAchieved
            .replace('{semester}', semesterGrade.toFixed(1))
            .replace('{target}', targetScore.toString()),
        };
      } else {
        const totalWeight = settings.midtermWeight + settings.finalWeight;
        if (totalWeight === 0 || settings.finalWeight === 0) {
          return {
            requiredFinal: null,
            possible: false,
            message: t.calculations.invalidWeights,
          };
        }
        
        const midtermContribution = (midterm * settings.midtermWeight) / totalWeight;
        const requiredFinalContribution = targetScore - midtermContribution;
        const requiredFinal = (requiredFinalContribution * totalWeight) / settings.finalWeight;
        
        if (requiredFinal > 100) {
          return {
            requiredFinal: null,
            possible: false,
            message: t.calculations.impossibleGoal,
          };
        }
        
        if (requiredFinal < settings.minimumFinalGrade) {
          return {
            requiredFinal: null,
            possible: false,
            message: t.calculations.needFinalBelowMinimum
              .replace('{required}', requiredFinal.toFixed(1))
              .replace('{minimum}', settings.minimumFinalGrade.toString()),
          };
        }
        
        return {
          requiredFinal: requiredFinal,
          possible: true,
          message: t.calculations.currentStatusScoreNotAchieved
            .replace('{semester}', semesterGrade.toFixed(1))
            .replace('{target}', targetScore.toString())
            .replace('{required}', requiredFinal.toFixed(1)),
        };
      }
    }
  }

  let targetSemesterGrade: number;

  if (goalInput.targetType === 'pass') {
    targetSemesterGrade = settings.minimumSemesterGrade;
  } else if (goalInput.targetType === 'score') {
    if (!goalInput.targetValue || typeof goalInput.targetValue !== 'number') {
      return {
        requiredFinal: null,
        possible: false,
        message: t.calculations.invalidTargetScore,
      };
    }
    targetSemesterGrade = goalInput.targetValue as number;
  } else {
    if (!goalInput.targetValue || typeof goalInput.targetValue !== 'string') {
      return {
        requiredFinal: null,
        possible: false,
        message: t.calculations.invalidLetterGrade,
      };
    }
    const targetLetter = goalInput.targetValue as string;
    const letterRange = settings.letterGradeRanges.find((r) => r.letter === targetLetter);
    if (!letterRange) {
      return {
        requiredFinal: null,
        possible: false,
        message: t.calculations.invalidLetterSelected,
      };
    }
    targetSemesterGrade = letterRange.min;
  }

  const totalWeight = settings.midtermWeight + settings.finalWeight;
  if (totalWeight === 0 || settings.finalWeight === 0) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.invalidWeights,
    };
  }
  
  const midtermContribution = (midterm * settings.midtermWeight) / totalWeight;
  const requiredFinalContribution = targetSemesterGrade - midtermContribution;
  const requiredFinal = (requiredFinalContribution * totalWeight) / settings.finalWeight;

  if (requiredFinal < 0) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.impossibleGoal,
    };
  }

  if (requiredFinal > 100) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.impossibleGoal,
    };
  }

  if (goalInput.targetType === 'pass' && requiredFinal < settings.minimumFinalGrade) {
    const adjustedRequiredFinal = settings.minimumFinalGrade;
    const adjustedSemesterGrade = calculateSemesterGrade(midterm, adjustedRequiredFinal, settings);
    
    if (adjustedSemesterGrade < settings.minimumSemesterGrade) {
      return {
        requiredFinal: null,
        possible: false,
        message: t.calculations.impossiblePass
          .replace('{minimumFinal}', settings.minimumFinalGrade.toString())
          .replace('{minimumSemester}', settings.minimumSemesterGrade.toString()),
      };
    }

    return {
      requiredFinal: adjustedRequiredFinal,
      possible: true,
      message: t.calculations.needFinalToPass
        .replace('{final}', adjustedRequiredFinal.toFixed(1))
        .replace('{minimum}', settings.minimumFinalGrade.toString()),
    };
  }

  if (requiredFinal < settings.minimumFinalGrade) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.needFinalBelowMinimum
        .replace('{required}', requiredFinal.toFixed(1))
        .replace('{minimum}', settings.minimumFinalGrade.toString()),
    };
  }

  let message = t.calculations.needFinalForGoal.replace('{final}', requiredFinal.toFixed(1));
  if (goalInput.targetType === 'pass') {
    message += ' ' + t.calculations.toPass;
  } else if (goalInput.targetType === 'score') {
    message += ' ' + t.calculations.toAchieveScore.replace('{score}', targetSemesterGrade.toString());
  } else {
    message += ' ' + t.calculations.toAchieveLetter.replace('{letter}', goalInput.targetValue as string);
  }

  return {
    requiredFinal,
    possible: true,
    message,
  };
};
