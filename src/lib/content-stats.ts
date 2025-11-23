/**
 * Calculate content statistics for blog posts
 */

export interface ContentStats {
    wordCount: number;
    characterCount: number;
    readingTimeMinutes: number;
}

/**
 * Strip HTML tags from content
 */
function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&[a-z]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Calculate content statistics
 * @param content - HTML or plain text content
 * @param wordsPerMinute - Reading speed (default: 200)
 */
export function calculateContentStats(
    content: string,
    wordsPerMinute: number = 200
): ContentStats {
    if (!content || content.trim() === '') {
        return {
            wordCount: 0,
            characterCount: 0,
            readingTimeMinutes: 0,
        };
    }

    // Strip HTML tags to get plain text
    const plainText = stripHtml(content);

    // Calculate character count (without spaces)
    const characterCount = plainText.replace(/\s/g, '').length;

    // Calculate word count
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Calculate reading time (in minutes, rounded up)
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

    return {
        wordCount,
        characterCount,
        readingTimeMinutes: Math.max(1, readingTimeMinutes), // Minimum 1 minute
    };
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
    if (minutes === 0) return '< 1 min read';
    if (minutes === 1) return '1 min read';
    return `${minutes} min read`;
}
