(function () {
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

  // Sends user to home page.
  function goHome() {
    window.location.href = 'index.html';
  }

  // Saves username + token to sessionStorage.
  function saveSession(username, token) {
    sessionStorage.setItem(
      'brainBucketSession',
      JSON.stringify({
        username,
        token
      })
    );
  }

  // --- UI helpers ---

  // Updates auth status message style + text.
  function showMessage(messageElement, text, type) {
    messageElement.textContent = text;
    messageElement.className = `small mt-3 mb-2 text-${type}`;
  }

  // --- API helper ---

  // Calls login API and returns response JSON.
  async function login(password) {
    const response = await fetch('https://authn.barrycumbie.com/api/authn/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    const loginJson = await response.json();
    return { response, loginJson };
  }

  // --- Page setup ---

  // If user is already logged in, leave auth page.
  const existingSession = getSession();
  if (existingSession && existingSession.username && existingSession.token) {
    goHome();
    return;
  }

  // Wires login form submission.
  const form = document.getElementById('login-form');
  const message = document.getElementById('auth-message');
  const output = document.getElementById('auth-output');

  // Handles login form submit from the auth page.
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const displayName = form.displayName.value.trim();
    const password = form.password.value.trim();

    if (!displayName || !password) {
      showMessage(message, 'Display name and password are required.', 'danger');
      return;
    }

    showMessage(message, 'Calling POST https://authn.barrycumbie.com/api/authn/login...', 'muted');
    output.textContent = '';

    try {
      const result = await login(password);

      if (!result.response.ok) {
        if (result.response.status === 401) {
          showMessage(message, 'Login failed (401). Demo password is incorrect.', 'danger');
        } else {
          showMessage(message, `Login failed (${result.response.status}).`, 'danger');
        }

        output.textContent = JSON.stringify(result.loginJson, null, 2);
        return;
      }

      saveSession(displayName, result.loginJson.token);
      sessionStorage.setItem('brainBucketLoginFlash', `Login succeeded for ${displayName}.`);

      showMessage(message, 'Login succeeded. Redirecting to index.html...', 'success');
      output.textContent = JSON.stringify(result.loginJson, null, 2);

      setTimeout(goHome, 1000);
    } catch (_error) {
      showMessage(message, 'Network error: unable to reach the API.', 'danger');
      output.textContent = '';
    }
  });
})();