import axios, { AxiosError } from 'axios';
import { IAPIResponse } from '@/types';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

/**
 * Test an API endpoint and return sample data
 */
export async function testApiEndpoint(url: string): Promise<IAPIResponse> {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
            },
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Fetch data for a widget with retry logic
 */
export async function fetchWidgetData(
    url: string,
    retryCount = 0
): Promise<IAPIResponse> {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
            },
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        // Retry logic for network errors
        if (retryCount < MAX_RETRIES && isRetryableError(error)) {
            await delay(RETRY_DELAY * (retryCount + 1));
            return fetchWidgetData(url, retryCount + 1);
        }

        return handleApiError(error);
    }
}

/**
 * Handle API errors and return formatted response
 */
function handleApiError(error: unknown): IAPIResponse {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // Rate limiting
        if (axiosError.response?.status === 429) {
            return {
                success: false,
                error: 'API rate limit exceeded. Please try again later.',
            };
        }

        // CORS error
        if (axiosError.message.includes('Network Error')) {
            return {
                success: false,
                error: 'CORS error or network issue. The API may not allow browser requests.',
            };
        }

        // Timeout
        if (axiosError.code === 'ECONNABORTED') {
            return {
                success: false,
                error: 'Request timeout. The API is taking too long to respond.',
            };
        }

        // Other HTTP errors
        if (axiosError.response) {
            return {
                success: false,
                error: `API error: ${axiosError.response.status} - ${axiosError.response.statusText}`,
            };
        }

        return {
            success: false,
            error: axiosError.message || 'Failed to fetch data from API',
        };
    }

    return {
        success: false,
        error: 'An unexpected error occurred',
    };
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        // Retry on network errors or 5xx server errors
        return (
            !axiosError.response ||
            (axiosError.response.status >= 500 && axiosError.response.status < 600)
        );
    }
    return false;
}

/**
 * Delay helper for retry logic
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
