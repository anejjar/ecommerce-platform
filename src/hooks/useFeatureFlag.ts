'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to check if a feature flag is enabled
 * @param featureName - The name of the feature flag to check
 * @returns boolean indicating if the feature is enabled
 */
export function useFeatureFlag(featureName: string): boolean {
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkFeature() {
            try {
                const response = await fetch(`/api/features/check/${featureName}`);
                const data = await response.json();
                setEnabled(data.enabled || false);
            } catch (error) {
                console.error(`Error checking feature flag ${featureName}:`, error);
                setEnabled(false);
            } finally {
                setLoading(false);
            }
        }

        checkFeature();
    }, [featureName]);

    return enabled;
}
