(function () {
  // --- Navigation helper ---

  // Sends user to auth page.
  function goAuth() {
    window.location.href = '../auth.html';
  }

  // --- Session helpers ---

  // Gets the saved session, or null when missing/invalid.
  function getSession() {
    const text = sessionStorage.getItem('brainBucketSession');
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (_error) {
      sessionStorage.removeItem('brainBucketSession');
      return null;
    }
  }

  // Redirects to auth page if user is not logged in.
  function requireSession() {
    const session = getSession();
    if (!session || !session.username || !session.token) {
      sessionStorage.removeItem('brainBucketSession');
      goAuth();
      return null;
    }

    return session;
  }

  // --- Auth action ---

  // Clears session and signs user out.
  function signOut() {
    sessionStorage.removeItem('brainBucketSession');
    goAuth();
  }

  // --- Page setup ---

  // Main page boot sequence.
  const session = requireSession();
  if (!session) {
    return;
  }

  document.getElementById('username-output').textContent = session.username;
  document.getElementById('sign-out-btn').addEventListener('click', signOut);
})();