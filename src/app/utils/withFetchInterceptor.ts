import { Agent } from 'http';
import axios from 'axios';

/**
 * Execute the callback function while intercepting fetch calls
 * that meet the given condition, redirecting them through the proxy.
 *
 * @param agent - Agent (httpsAgent) to use in proxy requests.
 * @param callback - Asynchronous function to be executed while
 * the intercepted fetch is active.
 * @returns The result of the callback.
 */

export async function withFetchInterceptor<T>(
  agent: Agent,
  callback: () => Promise<T>
): Promise<T> {
  const originalFetch = globalThis.fetch;

  // Override fetch temporarily
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const resource = typeof input === 'string' ? input : input.toString();

    // If the URL meets the condition (e.g. YouTube transcript URL)
    if (resource.includes('youtube.com')) {
      // Convert headers to a plain object, if they exist
      let headers: Record<string, string> | undefined;

      if (init?.headers) {
        if (init.headers instanceof Headers) {
          headers = Object.fromEntries(init.headers.entries());
        } else if (Array.isArray(init.headers)) {
          headers = Object.fromEntries(init.headers);
        } else {
          headers = init.headers as Record<string, string>;
        }
      }

      try {
        const axiosResponse = await axios({
          method: init?.method || 'GET',
          url: resource,
          headers,
          data: init?.body,
          httpsAgent: agent,
          timeout: 10000
        });

        // Rebuild headers in Fetch API format
        const responseHeaders = new Headers();
        Object.entries(axiosResponse.headers).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            responseHeaders.set(key, value.join(', '));
          } else {
            responseHeaders.set(key, value);
          }
        });

        return new Response(axiosResponse.data, {
          status: axiosResponse.status,
          statusText: axiosResponse.statusText,
          headers: responseHeaders
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message || 'Error in proxy fetch' : 'Unknown error';
        return new Response(message, { status: 500 });
      }
    }

    // For other URLs, use the original fetch
    return originalFetch(input, init);
  };

  try {
    return await callback();
  } finally {
    // Restore fetch to avoid affecting other parts of the application
    globalThis.fetch = originalFetch;
  }
}
