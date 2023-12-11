document.getElementById('loginButton').addEventListener('click', () => {
  const email = prompt('Please enter your email:');
  const password = prompt('Please enter your password:');

  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('authToken', data.token);
    alert('Logged in successfully');
  })
  .catch(error => {
    alert(error.message);
  });
});

document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('authToken');
  alert('Logged out successfully');
});
