(function () {
  const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

  async function requestJson(path, options) {
    const config = options || {};
    const headers = Object.assign({}, config.headers);

    if (config.token) {
      headers.Authorization = 'Bearer ' + config.token;
    }

    if (config.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: config.method || 'GET',
        headers,
        body: config.body !== undefined ? JSON.stringify(config.body) : undefined
      });

      if (response.status === 401) {
        const unauthorizedError = new Error('Unauthorized (401). Please sign in again.');
        unauthorizedError.code = 'UNAUTHORIZED';
        unauthorizedError.status = 401;
        throw unauthorizedError;
      }

      if (response.status === 403) {
        const forbiddenError = new Error('Forbidden (403). You do not have access to this resource.');
        forbiddenError.code = 'FORBIDDEN';
        forbiddenError.status = 403;
        throw forbiddenError;
      }

      if (!response.ok) {
        const text = await response.text();
        const requestError = new Error(`Request failed (${response.status}): ${text || response.statusText}`);
        requestError.code = 'REQUEST_FAILED';
        requestError.status = response.status;
        throw requestError;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return null;
      }

      return await response.json();
    } catch (error) {
      if (error.code) {
        throw error;
      }

      const networkError = new Error('Network error: unable to reach the API.');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
  }

  function handleUnauthorized(error) {
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
      AuthGateway.clearSession();
      window.location.href = AuthGateway.getAuthUrl();
      return true;
    }
    return false;
  }

  window.ApiClient = {
    API_BASE_URL,
    requestJson,
    handleUnauthorized
  };
})();
