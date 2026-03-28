/**
 * Squad Utilities
 * Helper functions for squad management
 */

/**
 * Generates a unique 8-character invite code
 * Format: Uppercase alphanumeric (e.g., "A3K9XM2P")
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

/**
 * Validates invite code format
 * Must be 8 uppercase alphanumeric characters
 */
export function isValidInviteCode(code: string): boolean {
  const pattern = /^[A-Z0-9]{8}$/;
  return pattern.test(code);
}

/**
 * Formats invite code for display
 * Adds dashes for readability: "A3K9-XM2P"
 */
export function formatInviteCode(code: string): string {
  if (code.length !== 8) return code;
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/**
 * Calculates week start (Monday) and end (Sunday) for leaderboard
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate days since Monday
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Start of week (Monday at 00:00:00)
  const start = new Date(now);
  start.setDate(now.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);

  // End of week (Sunday at 23:59:59)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Gets the week range as ISO strings for database queries
 */
export function getCurrentWeekRangeISO(): { start: string; end: string } {
  const { start, end } = getCurrentWeekRange();
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Converts seconds to hours with one decimal place
 */
export function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}

/**
 * Gets medal emoji for leaderboard position
 */
export function getMedalForPosition(position: number): string | null {
  switch (position) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return null;
  }
}
