/**
 * Spaced Repetition Service
 * 
 * This service implements a scientifically-backed spaced repetition algorithm
 * based on research by Piotr Wozniak (SuperMemo algorithm) and the forgetting curve
 * identified by Hermann Ebbinghaus.
 * 
 * The algorithm adjusts intervals based on:
 * 1. Performance (recall score)
 * 2. Current interval
 * 3. Difficulty of material
 * 4. Previous study history
 */

// Default intervals in days
const DEFAULT_INTERVALS = {
  INITIAL: 0.008, // ~12 minutes (for initial testing right after learning)
  INTRADAY: 0.17, // ~4 hours (same day review)
  INTRAWEEK: 1,    // 1 day
  INTRAMONTH: 6,   // 6 days
  LONG_TERM: 15,   // 15 days
  MAX_INTERVAL: 180 // 6 months
};

// SuperMemo-inspired algorithm constants
const SM_CONSTANTS = {
  DEFAULT_EASE: 2.5,
  MIN_EASE: 1.3,
  EASE_BONUS: 0.15,
  EASE_PENALTY: 0.2
};

/**
 * Calculate the next review interval based on current performance and history
 * @param {number} performance - The recall score (0-100)
 * @param {number} currentInterval - The current interval in days
 * @param {number} ease - The ease factor (defaults to 2.5)
 * @param {number} consecutiveCorrect - Number of consecutive times recalled correctly
 * @returns {object} Next interval info
 */
const calculateNextInterval = (performance, currentInterval = 0, ease = SM_CONSTANTS.DEFAULT_EASE, consecutiveCorrect = 0) => {
  // Adjust ease factor based on performance
  let newEase = ease;
  
  if (performance >= 90) {
    // Excellent performance - increase ease
    newEase += SM_CONSTANTS.EASE_BONUS;
    consecutiveCorrect++;
  } else if (performance >= 70) {
    // Good performance - small increase in ease
    newEase += SM_CONSTANTS.EASE_BONUS / 2;
    consecutiveCorrect++;
  } else if (performance >= 50) {
    // Fair performance - maintain ease
    consecutiveCorrect = 0;
  } else {
    // Poor performance - decrease ease and reset interval
    newEase -= SM_CONSTANTS.EASE_PENALTY;
    consecutiveCorrect = 0;
    
    // For very poor performance, reduce interval more significantly
    if (performance < 30) {
      currentInterval = Math.max(0, currentInterval / 3);
    } else {
      currentInterval = Math.max(0, currentInterval / 2);
    }
  }
  
  // Ensure ease factor doesn't go below minimum
  newEase = Math.max(SM_CONSTANTS.MIN_EASE, newEase);
  
  // Calculate next interval based on performance
  let nextInterval;
  
  if (currentInterval === 0 || performance < 50) {
    // First review or poor performance - start with initial interval
    if (performance < 30) {
      // Very poor performance - review in a few minutes
      nextInterval = DEFAULT_INTERVALS.INITIAL;
    } else if (performance < 50) {
      // Poor performance - review in a few hours
      nextInterval = DEFAULT_INTERVALS.INTRADAY;
    } else {
      // First review with good performance - review next day
      nextInterval = DEFAULT_INTERVALS.INTRAWEEK;
    }
  } else {
    // Calculate next interval based on SM-2 algorithm
    nextInterval = currentInterval * newEase;
    
    // Apply consecutive correct bonus
    if (consecutiveCorrect >= 2) {
      nextInterval *= 1 + (consecutiveCorrect * 0.1);
    }
    
    // Cap maximum interval
    nextInterval = Math.min(DEFAULT_INTERVALS.MAX_INTERVAL, nextInterval);
  }
  
  return {
    interval: nextInterval,
    ease: newEase,
    consecutiveCorrect
  };
};

/**
 * Generate a complete spaced repetition schedule
 * @param {number} performance - Current recall performance (0-100)
 * @param {Array} history - Previous study history
 * @returns {Array} Schedule of future review dates
 */
const generateSchedule = (performance, history = []) => {
  // Extract history data
  let ease = SM_CONSTANTS.DEFAULT_EASE;
  let lastInterval = 0;
  let consecutiveCorrect = 0;
  
  if (history && history.length > 0) {
    // Sort history by date (most recent first)
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
      return dateB - dateA;
    });
    
    // Use the most recent history entry to get current state
    const recentEntry = sortedHistory[0];
    ease = recentEntry.ease || ease;
    lastInterval = recentEntry.interval || lastInterval;
    consecutiveCorrect = recentEntry.consecutiveCorrect || consecutiveCorrect;
  }
  
  // Calculate next interval
  const result = calculateNextInterval(performance, lastInterval, ease, consecutiveCorrect);
  
  // Generate schedule (6 future review dates)
  const schedule = [];
  const now = new Date();
  let currentInterval = result.interval;
  let currentEase = result.ease;
  
  for (let i = 0; i < 6; i++) {
    // Calculate date for this interval
    const reviewDate = new Date(now.getTime() + (currentInterval * 24 * 60 * 60 * 1000));
    schedule.push({
      date: reviewDate,
      interval: currentInterval,
      projectedPerformance: calculateProjectedPerformance(currentInterval, performance)
    });
    
    // Simulate future reviews with good performance
    const nextResult = calculateNextInterval(85, currentInterval, currentEase, i > 0 ? i : 0);
    currentInterval = nextResult.interval;
    currentEase = nextResult.ease;
  }
  
  return {
    nextReview: schedule[0].date,
    interval: result.interval,
    ease: result.ease,
    consecutiveCorrect: result.consecutiveCorrect,
    schedule
  };
};

/**
 * Calculate projected performance based on interval and last performance
 * Uses Ebbinghaus forgetting curve: R = e^(-t/S) where S is strength
 * @param {number} interval - Interval in days
 * @param {number} lastPerformance - Last recall score (0-100)
 * @returns {number} Projected performance (0-100)
 */
const calculateProjectedPerformance = (interval, lastPerformance) => {
  // Calculate memory strength based on last performance
  // Higher performance = stronger memory
  const strength = 2 + (lastPerformance / 20);
  
  // Apply forgetting curve formula
  const retention = Math.exp(-interval / strength) * 100;
  
  // Ensure result is in range 0-100
  return Math.min(100, Math.max(0, Math.round(retention)));
};

/**
 * Analyze study history to provide insights
 * @param {Array} history - Previous study history
 * @returns {object} Analytics and insights
 */
const analyzeHistory = (history = []) => {
  if (!history || history.length === 0) {
    return {
      averagePerformance: 0,
      trend: 'neutral',
      optimalInterval: DEFAULT_INTERVALS.INTRADAY,
      recommendedSessions: 3
    };
  }
  
  // Sort history by date (oldest first for trend analysis)
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
    const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
    return dateA - dateB;
  });
  
  // Calculate average performance
  const totalPerformance = sortedHistory.reduce((sum, entry) => sum + entry.matchPercentage, 0);
  const averagePerformance = totalPerformance / sortedHistory.length;
  
  // Calculate performance trend
  const firstHalf = sortedHistory.slice(0, Math.floor(sortedHistory.length / 2));
  const secondHalf = sortedHistory.slice(Math.floor(sortedHistory.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.matchPercentage, 0) / 
                      (firstHalf.length || 1);
  const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.matchPerformance, 0) / 
                        (secondHalf.length || 1);
  
  let trend = 'neutral';
  if (secondHalfAvg - firstHalfAvg > 5) {
    trend = 'improving';
  } else if (firstHalfAvg - secondHalfAvg > 5) {
    trend = 'declining';
  }
  
  // Calculate optimal interval based on performance
  let optimalInterval = DEFAULT_INTERVALS.INTRADAY;
  if (averagePerformance >= 90) {
    optimalInterval = DEFAULT_INTERVALS.INTRAMONTH;
  } else if (averagePerformance >= 70) {
    optimalInterval = DEFAULT_INTERVALS.INTRAWEEK;
  }
  
  // Recommend number of sessions to reach 90% retention
  let recommendedSessions = 3;
  if (averagePerformance >= 90) {
    recommendedSessions = 1;
  } else if (averagePerformance >= 70) {
    recommendedSessions = 2;
  } else if (averagePerformance < 50) {
    recommendedSessions = 5;
  }
  
  return {
    averagePerformance,
    trend,
    optimalInterval,
    recommendedSessions
  };
};

export default {
  calculateNextInterval,
  generateSchedule,
  calculateProjectedPerformance,
  analyzeHistory,
  DEFAULT_INTERVALS
};
