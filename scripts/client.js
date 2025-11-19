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
  const button = document.getElementById('apiButton');
  const outputDiv = document.getElementById('apiOutput');
  const chatContainer = document.getElementById('chat-container');
   const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');
  const responseContainer = document.getElementById('responseContainer');

  if (chatContainer) {
   sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) {
      responseContainer.textContent = 'Please enter a message.';
      return;
    }

    responseContainer.textContent = 'Thinking...';

    try {
      const res = await fetch('https://teamv5.duckdns.org/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }]
        })
      });

      if (!res.ok) {
        responseContainer.textContent = `Error: ${res.status} ${res.statusText}`;
        return;
      }

      const data = await res.json();

      const content = data?.choices?.[0]?.message?.content || 'No response received.';
      responseContainer.innerHTML = `<strong>Assistant:</strong><br>${content.replace(/\n/g, '<br>')}`;

    } catch (err) {
      responseContainer.textContent = `Request failed: ${err.message}`;
    }
  });
}
  

  if (button || outputDiv){
 button.addEventListener('click', async () => {
  outputDiv.textContent = 'Loading...';

  try {
    const res = await fetch('https://167.172.116.168:8000/jobs/search?keyword=programming&location=Vancouver%2C%20BC&limit=5');
    if (!res.ok) {
      outputDiv.textContent = `Error: ${res.status} ${res.statusText}`;
      return;
    }

    const data = await res.json();

    if (data.error) {
      outputDiv.textContent = `Error: ${data.error}`;
      return;
    }

    if (!data.jobs || data.jobs.length === 0) {
      outputDiv.textContent = 'No jobs found.';
      return;
    }

    outputDiv.innerHTML = '';

    data.jobs.forEach(job => {
      const jobDiv = document.createElement('div');
      jobDiv.style.border = '1px solid #ccc';
      jobDiv.style.padding = '10px';
      jobDiv.style.marginBottom = '10px';
      jobDiv.style.borderRadius = '5px';
      jobDiv.style.backgroundColor = '#f9f9f9';

      jobDiv.innerHTML = `
        <h3><a href="${job.url}" target="_blank">${job.title}</a></h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Summary:</strong> ${job.summary}</p>
        <p><strong>URL:</strong> <a href="${job.url}" target="_blank">${job.url}</a></p>
      `;

      outputDiv.appendChild(jobDiv);
    });

  } catch (err) {
    outputDiv.textContent = `Network error: ${err.message}`;
  }
});
  }




  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  if (!loginForm) verifyLogin();
});

function setupResumeDropdown() {
    const addResumeBtn = document.getElementById('addResumeBtn');
    const resumeContainer = document.getElementById('resumeContainer');

    if (!addResumeBtn || !resumeContainer) return;

    let isVisible = false;

    addResumeBtn.addEventListener('click', async () => {
        if (!isVisible) {

            if (!document.getElementById('resumeText')) {
                const textarea = document.createElement('textarea');
                textarea.id = 'resumeText';
                textarea.placeholder = 'Paste your resume text here...';
                textarea.style.width = '100%';
                textarea.style.height = '300px';
                textarea.style.padding = '10px';
                textarea.style.fontSize = '16px';
                resumeContainer.appendChild(textarea);

                // Add a save button
                const saveBtn = document.createElement('button');
                saveBtn.id = 'saveResumeBtn';
                saveBtn.textContent = 'Save Resume';
                saveBtn.style.marginTop = '10px';
                resumeContainer.appendChild(saveBtn);

                saveBtn.addEventListener('click', async () => {
                    const resumeText = textarea.value.trim();
                    if (!resumeText) {
                        alert('Please paste your resume first.');
                        return;
                    }

                    const token = localStorage.getItem('token');
                    if (!token) {
                        alert('You must be logged in to save your resume.');
                        return;
                    }

                    try {
                        const res = await fetch(`${API_BASE}/user/resume`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ resume: resumeText })
                        });

                        const data = await res.json();
                        if (res.ok) {
                            alert('Resume saved successfully!');
                        } else {
                            alert(`Failed to save resume: ${data.message || res.status}`);
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Network error while saving resume.');
                    }
                });

                // Load existing resume
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const res = await fetch(`${API_BASE}/user/resume`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const data = await res.json();
                        if (res.ok || data.resume !== undefined) {
                            textarea.value = data.resume || '';
                        }
                    } catch (err) {
                        console.error('Failed to load existing resume:', err);
                    }
                }
            }

            resumeContainer.style.display = 'block';
            addResumeBtn.textContent = 'Hide Resume';
            isVisible = true;

        } else {
            resumeContainer.style.display = 'none';
            addResumeBtn.textContent = 'Add new Resume';
            isVisible = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', setupResumeDropdown);
