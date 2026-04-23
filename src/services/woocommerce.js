import { encode } from 'base-64';

export const WC_CONFIG = {
    baseURL: 'https://jungleind.com/wp-json',
    wcVersion: 'wc/v3',
    consumerKey: 'ck_f5d6380bb74e1f756b7ad9ac7b475dd2e6ba1a0e',
    consumerSecret: 'cs_0c06b325aa9b45c57439b1c1ac5d3b7e6fbe2e1d',
};

export const fetchWC = async (endpoint, options = {}) => {
    // Some servers strip the Authorization header, so we append keys as query parameters for maximum compatibility
    const url = new URL(`${WC_CONFIG.baseURL}/${WC_CONFIG.wcVersion}/${endpoint}`);
    url.searchParams.append('consumer_key', WC_CONFIG.consumerKey);
    url.searchParams.append('consumer_secret', WC_CONFIG.consumerSecret);

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {}),
    };

    const response = await fetch(url.toString(), {
        ...options,
        headers,
    });

    const text = await response.text();
    try {
        const data = JSON.parse(text);
        if (!response.ok) {
            // Detailed error for common WP REST API issues
            if (response.status === 404) {
                throw new Error(`Endpoint not found: ${endpoint}. Please ensure WooCommerce REST API is enabled.`);
            }
            throw new Error(data.message || `WooCommerce API Error (${response.status})`);
        }
        return data;
    } catch (e) {
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
        }
        return text;
    }
};

export const jwtLogin = async (username, password) => {
    // Try both trailing and non-trailing slash as some WP setups are picky
    const endpoints = [
        `${WC_CONFIG.baseURL}/jwt-auth/v1/token`,
        `${WC_CONFIG.baseURL}/jwt-auth/v1/token/`
    ];
    
    let lastError = null;

    for (const url of endpoints) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.status === 404) {
                continue; // Try next endpoint
            }

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
            }

            if (!response.ok) {
                console.log('JWT Login Error Response:', data);
                throw new Error(data.message || `Login Failed: ${response.status}`);
            }
            
            return data; // Success!
        } catch (error) {
            lastError = error;
            if (error.message.includes('Login Failed') || error.message.includes('non-JSON')) {
                throw error; // Don't retry if it's a real error (like wrong password)
            }
        }
    }

    // If we get here, both 404'd or failed
    throw new Error(
        'Authentication service not found (404). \n\n' +
        'Please verify: \n' +
        '1. The "JWT Authentication for WP REST API" plugin is ACTIVATED.\n' +
        '2. You have "Post name" permalinks enabled in WP Settings > Permalinks.\n' +
        '3. Your server allows Authorization headers (check .htaccess).'
    );
};
