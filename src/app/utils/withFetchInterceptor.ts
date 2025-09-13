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

    console.log('🌐 Intercepted fetch request:', resource);
    console.log('🌐 Request method:', init?.method || 'GET');
    console.log('🌐 Request body:', init?.body ? 'Present' : 'None');

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

    console.log('🌐 Request headers:', headers);

    try {
      const axiosResponse = await axios({
        method: init?.method || 'GET',
        url: resource,
        headers,
        data: init?.body,
        httpsAgent: agent,
        timeout: 15000
      });

      console.log('✅ HTTP Response status:', axiosResponse.status);
      console.log('✅ HTTP Response headers:', axiosResponse.headers);
      console.log('✅ HTTP Response data type:', typeof axiosResponse.data);
      console.log(
        '✅ HTTP Response data length:',
        typeof axiosResponse.data === 'string'
          ? axiosResponse.data.length
          : Array.isArray(axiosResponse.data)
            ? axiosResponse.data.length
            : axiosResponse.data
              ? Object.keys(axiosResponse.data).length
              : 0
      );

      // Log first 500 chars of response for debugging
      if (typeof axiosResponse.data === 'string') {
        console.log('✅ HTTP Response preview:', axiosResponse.data.substring(0, 500) + '...');
      } else {
        console.log(
          '✅ HTTP Response data:',
          JSON.stringify(axiosResponse.data, null, 2).substring(0, 500) + '...'
        );
      }

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
      console.error('❌ HTTP Request failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  try {
    return await callback();
  } finally {
    // Restore fetch to avoid affecting other parts of the application
    globalThis.fetch = originalFetch;
  }
}
