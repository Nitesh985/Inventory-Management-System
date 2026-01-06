// src/seed/utils/dateHelpers.ts

// Total days to seed (3 months = ~90 days)
export const SEED_DAYS = 90;

/**
 * Returns a date for a specific day in the 3-month seeding window.
 * Day 0 = 90 days ago (oldest)
 * Day 89 = today (newest)
 * 
 * @param dayOffset - 0 to 89, where 0 is 90 days ago and 89 is today
 * @param randomizeTime - if true, adds random hours/minutes within that day
 */
export function getDateForDay(dayOffset: number, randomizeTime = true): Date {
  const now = new Date();
  const daysAgo = (SEED_DAYS - 1) - dayOffset; // Convert to days ago (0 -> 89 days ago, 89 -> 0 days ago)
  
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  
  if (randomizeTime) {
    // Set to a random time during business hours (6 AM - 9 PM Nepal time)
    date.setHours(
      6 + Math.floor(Math.random() * 15), // 6 AM to 9 PM
      Math.floor(Math.random() * 60),      // Random minute
      Math.floor(Math.random() * 60),      // Random second
      0
    );
  } else {
    date.setHours(10, 0, 0, 0); // Default to 10 AM
  }
  
  return date;
}

/**
 * Get a random date between two day offsets
 * @param fromDay - Start day (0 to SEED_DAYS-1)
 * @param toDay - End day (0 to SEED_DAYS-1)
 */
export function getRandomDateInRange(fromDay: number, toDay: number): Date {
  const randomDay = fromDay + Math.floor(Math.random() * (toDay - fromDay + 1));
  return getDateForDay(randomDay);
}

/**
 * Get dates for the entire 3-month period
 */
export function getDateRange(): { start: Date; end: Date } {
  return {
    start: getDateForDay(0, false),
    end: getDateForDay(SEED_DAYS - 1, false),
  };
}
