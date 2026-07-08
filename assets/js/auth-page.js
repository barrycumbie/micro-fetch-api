document.addEventListener('DOMContentLoaded', function () {
  if (AuthGateway.isAuthenticated()) {
    window.location.href = AuthGateway.getHomeUrl();
    return;
  }

  const form = document.getElementById('login-form');
  const message = document.getElementById('auth-message');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (!username || !password) {
      message.textContent = 'Username and password are required.';
      return;
    }

    const session = {
      username,
      token: `demo-token-${Date.now()}`
    };

    sessionStorage.setItem(AuthGateway.SESSION_KEY, JSON.stringify(session));
    window.location.href = AuthGateway.getHomeUrl();
  });
});
