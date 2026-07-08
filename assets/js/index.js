(function () {
  // --- Navigation helper ---

  // Sends user to auth page.
  function goAuth() {
    window.location.href = 'auth.html';
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

  // --- UI helpers ---

  // Shows one-time login success message.
  function showFlashMessage() {
    const flash = document.getElementById('login-flash');
    const flashText = sessionStorage.getItem('brainBucketLoginFlash');
    if (flash && flashText) {
      flash.textContent = flashText;
      flash.classList.remove('d-none');
      sessionStorage.removeItem('brainBucketLoginFlash');
    }
  }

  // Displays username and short token preview.
  function renderUser(session) {
    document.getElementById('username-output').textContent = session.username;
    document.getElementById('token-output').textContent = session.token.slice(0, 16) + '...';
  }

  // --- Auth action ---

  // Clears session and signs user out.
  function signOut() {
    sessionStorage.removeItem('brainBucketSession');
    goAuth();
  }

  // --- API action ---

  // Runs GET /health and prints result.
  async function runHealthCheck(session) {
    const message = document.getElementById('api-message');
    const output = document.getElementById('api-output');

    message.textContent = 'Calling GET https://authn.barrycumbie.com/health...';
    output.textContent = '';

    try {
      const response = await fetch('https://authn.barrycumbie.com/health', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + session.token
        }
      });

      let responseJson = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        responseJson = await response.json();
      }

      if (response.status === 401 || response.status === 403) {
        signOut();
        return;
      }

      if (!response.ok) {
        message.textContent = `GET failed (${response.status}).`;
        output.textContent = responseJson ? JSON.stringify(responseJson, null, 2) : '';
        return;
      }

      message.textContent = 'GET succeeded.';
      output.textContent = JSON.stringify(responseJson, null, 2);
    } catch (_error) {
      message.textContent = 'Network error: unable to reach the API.';
      output.textContent = '';
    }
  }

  // --- Page setup ---

  // Main page boot sequence.
  const session = requireSession();
  if (!session) {
    return;
  }

  renderUser(session);
  showFlashMessage();

  document.getElementById('sign-out-btn').addEventListener('click', signOut);
  document.getElementById('get-btn').addEventListener('click', function () {
    runHealthCheck(session);
  });
})();