document.addEventListener('DOMContentLoaded', function () {
  if (!AuthGateway.requireAuth()) {
    return;
  }

  const user = AuthGateway.getSessionUser();
  const usernameOutput = document.getElementById('username-output');
  const output = document.getElementById('api-output');
  const message = document.getElementById('api-message');

  usernameOutput.textContent = user.username;

  document.getElementById('sign-out-btn').addEventListener('click', function () {
    AuthGateway.clearSession();
    window.location.href = AuthGateway.getAuthUrl();
  });

  document.getElementById('get-btn').addEventListener('click', async function () {
    message.textContent = 'Loading GET response...';

    try {
      const response = await ApiClient.requestJson('/posts?_limit=3', { token: user.token });
      message.textContent = 'GET succeeded.';
      output.textContent = JSON.stringify(response, null, 2);
    } catch (error) {
      if (ApiClient.handleUnauthorized(error)) {
        return;
      }

      message.textContent = error.message;
      output.textContent = '';
    }
  });

  document.getElementById('post-btn').addEventListener('click', async function () {
    message.textContent = 'Loading POST response...';

    try {
      const response = await ApiClient.requestJson('/posts', {
        method: 'POST',
        token: user.token,
        body: {
          title: 'Brain Bucket sample',
          body: `Created by ${user.username}`,
          userId: 1
        }
      });

      message.textContent = 'POST succeeded.';
      output.textContent = JSON.stringify(response, null, 2);
    } catch (error) {
      if (ApiClient.handleUnauthorized(error)) {
        return;
      }

      message.textContent = error.message;
      output.textContent = '';
    }
  });
});
