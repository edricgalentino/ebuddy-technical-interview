import { User } from "@ebuddy/shared-types";

/**
 * Determines if a user is recently active based on their recentlyActive timestamp
 * @param recentlyActiveTimestamp - User's recentlyActive timestamp in milliseconds
 * @param thresholdMinutes - Number of minutes to consider a user recently active (default: 5)
 * @returns boolean - Whether the user is recently active within the threshold
 */
export const isRecentlyActive = (recentlyActiveTimestamp?: number, thresholdMinutes = 5): boolean => {
  if (!recentlyActiveTimestamp) return false;

  const thresholdMs = thresholdMinutes * 60 * 1000;
  const now = Date.now();

  return now - recentlyActiveTimestamp < thresholdMs;
};

/**
 * Formats the user's last active time as a human-readable string
 * @param recentlyActiveTimestamp - User's recentlyActive timestamp in milliseconds
 * @returns string - Formatted last active time (e.g., "Just now", "5 minutes ago", "2 hours ago", "3 days ago")
 */
export const formatLastActive = (recentlyActiveTimestamp?: number): string => {
  if (!recentlyActiveTimestamp) return "Unknown";

  const now = Date.now();
  const diffMs = now - recentlyActiveTimestamp;

  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    return "Just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
};

/**
 * Determines and formats a user's presence status
 * @param user - User object
 * @returns string - Formatted status
 */
export const getUserStatusDisplay = (user?: User | null): string => {
  if (!user) return "Unknown";

  if (user.status === "online") {
    return "Online";
  }

  if (user.status === "away") {
    return "Away";
  }

  if (isRecentlyActive(user.recentlyActive)) {
    return "Recently Active";
  }

  return `Last seen ${formatLastActive(user.recentlyActive)}`;
};
