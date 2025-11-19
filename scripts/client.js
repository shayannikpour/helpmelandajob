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
    const currentResumeContainer = document.getElementById('currentResumeContainer');

    if (!addResumeBtn || !resumeContainer || !currentResumeContainer) return;

    let isVisible = false;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Load existing resume and display it in the div
    async function loadCurrentResume() {
        try {
            const res = await fetch(`${API_BASE}/user/resume`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            currentResumeContainer.textContent = data.resume || 'No resume uploaded yet.';
            currentResumeContainer.style.whiteSpace = 'pre-wrap'; // preserve line breaks
            currentResumeContainer.style.border = '1px solid #ccc';
            currentResumeContainer.style.padding = '10px';
            currentResumeContainer.style.marginBottom = '10px';
            currentResumeContainer.style.backgroundColor = '#f9f9f9';
            currentResumeContainer.style.minHeight = '50px';
        } catch (err) {
            console.error('Failed to load resume:', err);
            currentResumeContainer.textContent = 'Error loading resume';
        }
    }

    loadCurrentResume();

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
                            // Update the current resume div
                            loadCurrentResume();
                        } else {
                            alert(`Failed to save resume: ${data.message || res.status}`);
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Network error while saving resume.');
                    }
                });

                // Pre-fill textarea with existing resume
                try {
                    const res = await fetch(`${API_BASE}/user/resume`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    textarea.value = data.resume || '';
                } catch (err) {
                    console.error('Failed to load existing resume:', err);
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

function improveResume() {
    const improveBtn = document.getElementById('improveResumeBtn');
    const improvedResumeContainer = document.getElementById('improvedResumeContainer');

    if (!improveBtn || !improvedResumeContainer) return;

    improveBtn.addEventListener('click', async () => {
      console.log("Improve Resume button clicked");
        const currentResumeContainer = document.getElementById('currentResumeContainer');
        const resumeText = currentResumeContainer.textContent.trim();
        if (!resumeText || resumeText === 'No resume uploaded yet.' || resumeText === 'Error loading resume') {
            alert('Please upload your resume first.');
            return;
        }
        improvedResumeContainer.textContent = 'Improving your resume, please wait...';

        try {
            const res = await fetch('https://teamv5.duckdns.org/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are an expert resume enhancer. Suggest point form improvements for the following resume to make it more appealing to employers.' },
                        { role: 'user', content: `This is the resume:\n\n${resumeText}` }
                    ]
                })
            });
            if (!res.ok) {
                improvedResumeContainer.textContent = `Error: ${res.status} ${res.statusText}`;
                return;
            }
            const data = await res.json();
            const improvedContent = data?.choices?.[0]?.message?.content || 'No response received.';

            // Side-by-side view: AI recommendations (left) and editable current resume (right)
            improvedResumeContainer.innerHTML = `
              <div style="display:flex; gap:16px; align-items:flex-start;">
                <div style="flex:1;">
                  <h3>AI Recommendations</h3>
                  <div id="improvedResumeContent" style="white-space: pre-wrap; border:1px solid #ddd; padding:10px; background:#fff; min-height:200px;">${improvedContent.replace(/\n/g, '<br>')}</div>
                </div>
                <div style="flex:1;">
                  <h3>Your Current Resume (editable)</h3>
                  <textarea id="resumeEditor" style="width:100%; height:320px; padding:8px; font-size:14px;">Loading current resume...</textarea>
                  <div style="margin-top:8px; display:flex; gap:8px;">
                    <button id="saveResumeBtn">Save</button>
                    <button id="cancelResumeBtn">Cancel</button>
                  </div>
                </div>
              </div>
              <div style="margin-top:8px;"><button id="discardImprovementsBtn">Discard</button></div>
            `;

            // Fill editor with current resume text (loaded from page)
            const currentResumeContainerElem = document.getElementById('currentResumeContainer');
            const editor = document.getElementById('resumeEditor');
            const discardBtn = document.getElementById('discardImprovementsBtn');
            const saveBtn = document.getElementById('saveResumeBtn');
            const cancelBtn = document.getElementById('cancelResumeBtn');

            if (editor) {
              // prefer the visible current resume content if present, otherwise empty
              const currentText = (currentResumeContainerElem && currentResumeContainerElem.textContent && currentResumeContainerElem.textContent.trim() !== '')
                ? currentResumeContainerElem.textContent
                : '';
              editor.value = currentText;
            }

            if (discardBtn) {
              discardBtn.addEventListener('click', () => { improvedResumeContainer.innerHTML = ''; });
            }

            // POST helper
            async function postResume(text, button) {
              const token = localStorage.getItem('token');
              if (!token) { alert('You must be logged in to save your resume.'); return; }
              if (button) { button.disabled = true; button.textContent = 'Saving...'; }
              try {
                const res2 = await fetch(`${API_BASE}/user/resume`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({ resume: text })
                });
                const json = await res2.json().catch(() => ({}));
                if (res2.ok) {
                  if (currentResumeContainerElem) {
                    currentResumeContainerElem.textContent = text;
                    currentResumeContainerElem.style.whiteSpace = 'pre-wrap';
                  }
                  improvedResumeContainer.innerHTML = '<p style="color:green;">Resume saved successfully.</p>';
                } else {
                  alert(`Failed to save resume: ${json.message || res2.status}`);
                  if (button) { button.disabled = false; button.textContent = 'Save'; }
                }
              } catch (err) {
                alert(`Network error: ${err.message}`);
                if (button) { button.disabled = false; button.textContent = 'Save'; }
              }
            }

            if (saveBtn && editor) {
              saveBtn.addEventListener('click', async () => { await postResume(editor.value, saveBtn); });
            }

            if (cancelBtn) {
              cancelBtn.addEventListener('click', () => {
                // reset editor to the current shown resume
                if (currentResumeContainerElem && editor) editor.value = currentResumeContainerElem.textContent || '';
              });
            }
        } catch (err) {
            improvedResumeContainer.textContent = `Request failed: ${err.message}`;
        }
    });
}

document.addEventListener('DOMContentLoaded', improveResume);