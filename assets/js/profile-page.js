document.addEventListener('DOMContentLoaded', function () {
  if (!AuthGateway.requireAuth()) {
    return;
  }

  const user = AuthGateway.getSessionUser();
  document.getElementById('username-output').textContent = user.username;

  document.getElementById('sign-out-btn').addEventListener('click', function () {
    AuthGateway.clearSession();
    window.location.href = AuthGateway.getAuthUrl();
  });
});
