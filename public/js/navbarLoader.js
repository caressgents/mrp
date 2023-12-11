document.addEventListener('DOMContentLoaded', () => {
  fetch('/partials/navbar.html')
    .then(response => response.text())
    .then(navbarHtml => {
      document.getElementById('navbarContainer').innerHTML = navbarHtml;
      // Additional script to handle login/logout buttons if needed
    })
    .catch(error => console.error('Failed to load the navbar:', error));
});
