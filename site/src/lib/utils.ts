import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a GitHub username from a text string by looking for GitHub URLs or @mentions
 * @param text The text to search for GitHub usernames
 * @returns The GitHub username if found, null otherwise
 */
export function inferGitHubUsername(text: string): string | null {
  // Match github.com URLs: github.com/username or github.com/username/
  const githubUrlRegex = /(github|githubusercontent)\.com\/([a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38})/i;
  // Match @username mentions that look like GitHub usernames
  const githubMentionRegex = /@([a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38})/;

  const urlMatch = text.match(githubUrlRegex);
  if (urlMatch) {
    return urlMatch[2];
  }

  const mentionMatch = text.match(githubMentionRegex);
  if (mentionMatch) {
    return mentionMatch[1];
  }

  return null;
}

/**
 * Extracts an X/Twitter username from a text string by looking for twitter.com/x.com URLs or @mentions
 * @param text The text to search for X/Twitter usernames
 * @returns The X/Twitter username if found, null otherwise
 */
export function inferXUsername(text: string): string | null {
  // Match twitter.com or x.com URLs
  const xUrlRegex = /(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]{1,15})/i;
  // Match @username mentions that look like Twitter usernames
  const xMentionRegex = /@([a-zA-Z0-9_]{1,15})\b/;

  const urlMatch = text.match(xUrlRegex);
  if (urlMatch) {
    return urlMatch[1];
  }

  const mentionMatch = text.match(xMentionRegex);
  if (mentionMatch) {
    return mentionMatch[1];
  }

  return null;
}

