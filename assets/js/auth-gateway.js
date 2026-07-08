(function () {
  const SESSION_KEY = 'brainBucketSession';

  function getBasePath() {
    const script = document.currentScript || document.querySelector('script[src*="auth-gateway.js"]');
    if (!script) {
      return '/';
    }

    const src = new URL(script.getAttribute('src'), window.location.href);
    return src.pathname.replace(/\/assets\/js\/auth-gateway\.js$/, '/');
  }

  function getSessionUser() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (_error) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function isAuthenticated() {
    const session = getSessionUser();
    return Boolean(session && session.username && session.token);
  }

  function getAuthUrl() {
    return new URL('auth.html', window.location.origin + getBasePath()).toString();
  }

  function getHomeUrl() {
    return new URL('index.html', window.location.origin + getBasePath()).toString();
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function requireAuth() {
    if (!isAuthenticated()) {
      window.location.href = getAuthUrl();
      return false;
    }
    return true;
  }

  window.AuthGateway = {
    SESSION_KEY,
    isAuthenticated,
    getSessionUser,
    requireAuth,
    getAuthUrl,
    getHomeUrl,
    clearSession
  };
})();
