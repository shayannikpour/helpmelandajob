const API_BASE = 'https://helpmelandajob-server.onrender.com';

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const status = document.getElementById('status');

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

   if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
    if (data.isAdmin) {
        window.location.href = 'admin-home.html';
    } else {
        window.location.href = 'home.html';
    }
    } else {
      status.textContent = data.message || 'Login failed';
      status.style.color = 'red';
    }
  } catch (err) {
    console.error('Login error:', err);
    status.textContent = 'Network error';
    status.style.color = 'red';
  }
}



async function handleRegister(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const status = document.getElementById('status');

  // Check if passwords match
  if (password !== confirmPassword) {
    status.textContent = "Passwords do not match";
    status.style.color = 'red';
    return;
  }

  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });



  const data = await res.json();

  if (res.ok) {
    status.textContent = data.message;
    status.style.color = 'green';
  } else {
    status.textContent = data.message || 'Registration failed';
    status.style.color = 'red';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
});



async function verifyLogin() {
  const token = localStorage.getItem('token');
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (loginForm) return;
  if (registerForm) return;

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok) {
      const usernameElem = document.getElementById('usernameDisplay');
      if (usernameElem) usernameElem.textContent = data.username;

      const isAdminStored = localStorage.getItem('isAdmin') === '1';
      if (isAdminStored && !window.location.href.includes('admin-home.html')) {
        window.location.href = 'admin-home.html';
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      window.location.href = 'login.html';
    }
  } catch (err) {
    console.error(err);
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', verifyLogin);

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  if (!loginForm) verifyLogin();
});
