const API_BASE = 'https://helpmelandajob-server.onrender.com';


async function loadAdminPage() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const nameSpan = document.getElementById("usernameDisplay");
  if (nameSpan && username) nameSpan.textContent = username;

  const usersTable = document.getElementById("usersTable");
  if (!usersTable) return; // Not on admin page

  const errorBox = document.getElementById("adminError");

  try {
    const res = await fetch("https://helpmelandajob-server.onrender.com/admin/users", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load users");

    const tbody = usersTable.querySelector("tbody");
    tbody.innerHTML = "";

    data.users.forEach(u => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${u.username}</td>
        <td>${u.api_calls}</td>
        <td>${u.isadmin ? "✔️" : "❌"}</td>
        <td>
            <button class="delete-btn" onclick="deleteUser(${u.id})">
                Delete
            </button>

            <button class="admin-btn" onclick="toggleAdmin(${u.id}, ${u.isadmin})">
                ${u.isadmin ? "Remove Admin" : "Make Admin"}
            </button>
        </td>
    `;

      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Admin page error:", err);
    errorBox.textContent = err.message;
    errorBox.style.display = "block";
  }
}



window.deleteUser = async function (id) {
  if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `https://helpmelandajob-server.onrender.com/admin/users/${id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to delete user");
      return;
    }

    // Refresh user list
    loadAdminPage();

  } catch (err) {
    console.error("Delete user error:", err);
    alert("Server error while deleting user.");
  }
};



window.toggleAdmin = async function (id, currentStatus) {
  const token = localStorage.getItem("token");

  const newStatus = !currentStatus;

  const confirmMsg = newStatus
    ? "Grant admin access to this user?"
    : "Remove admin access from this user?";

  if (!confirm(confirmMsg)) return;

  try {
    const res = await fetch(
      `https://helpmelandajob-server.onrender.com/admin/users/${id}/isAdmin`,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isAdmin: newStatus })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to update admin status");
      return;
    }

    loadAdminPage();

  } catch (err) {
    console.error("Admin toggle error:", err);
    alert("Server error while updating admin status.");
  }
};




document.addEventListener("DOMContentLoaded", loadAdminPage);

async function loadEndpoints() {
  const token = localStorage.getItem("token");

  const table = document.getElementById("endpointsTable");
  if (!table) return; // Do nothing if not on admin page

  const errorBox = document.getElementById("endpointsError");

  try {
    const res = await fetch("https://helpmelandajob-server.onrender.com/admin/endpoints", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load endpoints");

    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    data.endpoints.forEach(ep => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${ep.id}</td>
                <td>${ep.method}</td>
                <td>${ep.endpoint}</td>
                <td>${ep.requests}</td>
            `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Endpoints load error:", err);
    errorBox.textContent = err.message;
    errorBox.style.display = "block";
  }
}


document.addEventListener("DOMContentLoaded", loadEndpoints);


function getLeetCodeQuestions() {

  if (!document.getElementById("leetcodeForm")) return;

  document.getElementById("leetcodeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const lang = document.getElementById("language").value;
    const diff = document.getElementById("difficulty").value;
    const submitBtn = document.getElementById("submitBtn");
    const loadingDiv = document.getElementById("loadingDiv");
    const errorDiv = document.getElementById("errorDiv");
    const questionsContainer = document.getElementById("questionsContainer");

    errorDiv.style.display = "none";
    questionsContainer.innerHTML = "";
    loadingDiv.style.display = "block";
    submitBtn.disabled = true;

    const token = localStorage.getItem("token");
    if (!token) {
      loadingDiv.style.display = "none";
      submitBtn.disabled = false;
      errorDiv.textContent = "You must be logged in to use this feature.";
      errorDiv.style.display = "block";
      return;
    }

    if (!lang || !diff) {
      loadingDiv.style.display = "none";
      submitBtn.disabled = false;
      errorDiv.textContent = "Please select both language and difficulty.";
      errorDiv.style.display = "block";
      return;
    }

    // Drop JSON, use QUESTION/ANSWER markers instead – much more robust
    const prompt = `
You are generating LeetCode-style coding interview questions.

Respond in EXACTLY this format, with these two sections and nothing else:

QUESTION:
<problem statement, max 3 sentences, max 400 characters, for ${lang} at ${diff} difficulty>

ANSWER:
<complete working ${lang} solution code plus a 1–3 sentence explanation>

Rules:
- Do NOT include any JSON.
- Do NOT include markdown like \`\`\` fences.
- Do NOT repeat these instructions.
- Start the first line with "QUESTION:".
- Later, on a new line, start the answer section with "ANSWER:".
`;

    try {
      const response = await fetch(`${API_BASE}/ai/leetcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(`Server error (${response.status}): ${errText || "Unable to get question"}`);
      }

      const data = await response.json();
      const raw = data?.choices?.[0]?.message?.content || "";
      console.log("AI RAW:", raw);

      if (!raw || typeof raw !== "string") {
        throw new Error("Empty or invalid AI response.");
      }

      const qa = parseQuestionAnswer(raw);

      if (!qa || !qa.question) {
        throw new Error("AI response was not in the expected format. Please try again.");
      }

      displayQuestions([qa]);

    } catch (err) {
      console.error(err);
      errorDiv.textContent = err.message || "Something went wrong.";
      errorDiv.style.display = "block";
    } finally {
      loadingDiv.style.display = "none";
      submitBtn.disabled = false;
    }
  });



  // Parse "QUESTION: ... ANSWER: ..." format
  function parseQuestionAnswer(raw) {
    const parts = raw.split(/ANSWER:/i);
    if (parts.length < 2) {
      return null;
    }

    const questionPart = parts[0].replace(/QUESTION:/i, "").trim();
    const answerPart = parts.slice(1).join("ANSWER:").trim(); // in case "ANSWER:" appears again

    // Basic sanity checks
    if (!questionPart || questionPart.length < 10) {
      return null;
    }

    return {
      question: questionPart,
      answer: answerPart || "No answer provided."
    };
  }

  function displayQuestions(questions) {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";

    if (!Array.isArray(questions) || questions.length === 0) {
      container.innerHTML = '<div class="error-message">No questions returned.</div>';
      return;
    }

    questions.forEach((q, index) => {
      const card = document.createElement("div");
      card.className = "question-card";

      const id = `answer-${index}`;

      const questionText = q.question || "No question text provided.";
      const answerText = q.answer || "No answer provided.";

      card.innerHTML = `
                <h3>Question ${index + 1}</h3>
                <div class="question-content">${formatText(questionText)}</div>
                <button class="reveal-btn" onclick="toggleAnswer('${id}', this)">Reveal Answer</button>
                <div id="${id}" class="answer-content">${formatText(answerText)}</div>
            `;

      container.appendChild(card);
    });
  }

  function formatText(text) {
    if (!text) return "";
    // Preserve newlines from the model
    return text.replace(/\r\n/g, "\n").replace(/\n/g, "<br>");
  }

  window.toggleAnswer = function (id, btn) {
    const box = document.getElementById(id);
    const open = box.classList.toggle("revealed");
    btn.textContent = open ? "Hide Answer" : "Reveal Answer";
  };

}

document.addEventListener('DOMContentLoaded', getLeetCodeQuestions);



// Simple UI message helpers to replace alert()
function showGlobalMessage(msg, type = 'error') {
  let g = document.getElementById('globalMessage');
  if (!g) {
    g = document.createElement('div');
    g.id = 'globalMessage';
    g.style.position = 'fixed';
    g.style.top = '12px';
    g.style.right = '12px';
    g.style.zIndex = 9999;
    g.style.padding = '8px 12px';
    g.style.borderRadius = '4px';
    g.style.background = 'rgba(255,255,255,0.95)';
    g.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    document.body.appendChild(g);
  }
  g.textContent = msg;
  g.style.color = type === 'error' ? 'red' : 'green';
  if (g._timeout) clearTimeout(g._timeout);
  g._timeout = setTimeout(() => { g.textContent = ''; }, 5000);
}

function showInlineMessage(targetElem, msg, type = 'error') {
  if (!targetElem) { showGlobalMessage(msg, type); return; }
  // place message directly after the target element
  let parent = targetElem.parentNode || document.body;
  let existing = parent.querySelector('.inline-message');
  if (!existing) {
    existing = document.createElement('div');
    existing.className = 'inline-message';
    existing.style.marginTop = '6px';
    existing.style.fontSize = '0.95em';
    parent.appendChild(existing);
  }
  existing.textContent = msg;
  existing.style.color = type === 'error' ? 'red' : 'green';
  if (existing._timeout) clearTimeout(existing._timeout);
  existing._timeout = setTimeout(() => { existing.textContent = ''; }, 7000);
}

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const status = document.getElementById('status');

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      // credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', data.isAdmin);  // <-- FIXED

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
    console.log("Hello")
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
      // update API calls display (if present on the page)
      fetchAndShowApiCalls().catch(err => console.error('Failed to load api calls:', err));
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

// Fetch the user's api_calls and show "{api_calls}/20" in #apiCallsDisplay (if present)
async function fetchAndShowApiCalls() {
  const el = document.getElementById('apiCallsDisplay');
  if (!el) return;
  const token = localStorage.getItem('token');
  if (!token) {
    el.textContent = `0/20`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/user/api_calls`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      console.error('Failed to fetch api_calls', res.status);
      el.textContent = `0/20`;
      return;
    }
    const data = await res.json();
    const count = typeof data.api_calls === 'number' ? data.api_calls : Number(data.api_calls || 0);
    el.textContent = `${count}/${20}`;
  } catch (err) {
    console.error('Error fetching api_calls:', err);
    el.textContent = `0/20`;
  }
}

document.addEventListener('DOMContentLoaded', verifyLogin);
// Also attempt to populate the api call counter on page load (will use token if present)
document.addEventListener('DOMContentLoaded', () => { fetchAndShowApiCalls().catch(() => { }); });

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


  if (button || outputDiv) {
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
            showInlineMessage(textarea, 'Please paste your resume first.', 'error');
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
              showInlineMessage(resumeContainer, 'Resume saved successfully!', 'success');
              // Update the current resume div
              loadCurrentResume();
            } else {
              showInlineMessage(resumeContainer, `Failed to save resume: ${data.message || res.status}`, 'error');
            }
          } catch (err) {
            console.error(err);
            showInlineMessage(resumeContainer, 'Network error while saving resume.', 'error');
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

document.addEventListener("DOMContentLoaded", () => {
  const adminLink = document.getElementById("adminLink");
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");


  if (adminLink && isAdmin === "true") {
    adminLink.style.display = "inline-block";
  }
});


function improveResume() {
  const improveBtn = document.getElementById('improveResumeBtn');
  const improvedResumeContainer = document.getElementById('improvedResumeContainer');

  if (!improveBtn || !improvedResumeContainer) return;

  improveBtn.addEventListener('click', async () => {
    console.log("Improve Resume button clicked");
    const currentResumeContainer = document.getElementById('currentResumeContainer');
    const resumeText = currentResumeContainer.textContent.trim();
    if (!resumeText || resumeText === 'No resume uploaded yet.' || resumeText === 'Error loading resume') {
      showInlineMessage(improvedResumeContainer, 'Please upload your resume first.', 'error');
      return;
    }
    improvedResumeContainer.textContent = 'Improving your resume, please wait...';

    try {
      // Send resume to server endpoint which proxies to the AI
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/ai/resume/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ resume: resumeText })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        improvedResumeContainer.textContent = `Error: ${res.status} ${errJson.message || res.statusText}`;
        return;
      }

      const data = await res.json();
      const improvedContent = data?.ai?.choices?.[0]?.message?.content || data?.ai?.message || 'No response received.';

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
        if (!token) { showInlineMessage(improvedResumeContainerElem, 'You must be logged in to save your resume.', 'error'); return; }
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
            showInlineMessage(improvedResumeContainerElem, 'Resume saved successfully.', 'success');
          } else {
            showInlineMessage(improvedResumeContainerElem, `Failed to save resume: ${json.message || res2.status}`, 'error');
            if (button) { button.disabled = false; button.textContent = 'Save'; }
          }
        } catch (err) {
          showInlineMessage(improvedResumeContainerElem, `Network error: ${err.message}`, 'error');
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

// --- Skills page: load and add skills ---
async function fetchAndRenderSkills() {
  const container = document.getElementById('skillsContainer');
  if (!container) return;

  const token = localStorage.getItem('token');
  if (!token) {
    container.innerHTML = '<p>Please log in to view your skills.</p>';
    return;
  }

  container.innerHTML = '<p>Loading skills...</p>';

  try {
    const res = await fetch(`${API_BASE}/user/skills`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      container.innerHTML = `<p>Error loading skills: ${res.status}</p>`;
      return;
    }
    const data = await res.json();
    const skills = Array.isArray(data.skills) ? data.skills : [];

    if (skills.length === 0) {
      container.innerHTML = '<p>No skills added yet.</p>';
      return;
    }

    // Render skills as articles similar to the original markup
    container.innerHTML = '';

    // skills.forEach(s => {
    //   const article = document.createElement('article');
    //   article.className = 'skill';
    //   const h2 = document.createElement('h2');
    //   h2.textContent = s;
    //   article.appendChild(h2);
    //   container.appendChild(article);
    // });

    skills.forEach(skill => {
      const article = document.createElement('article');
      article.className = 'skill';

      const h2 = document.createElement('h2');
      h2.textContent = skill;

      const delBtn = document.createElement('button');
      delBtn.textContent = "Delete";
      delBtn.style.marginLeft = "12px";
      delBtn.onclick = () => deleteSkill(skill);

      article.appendChild(h2);
      article.appendChild(delBtn);
      container.appendChild(article);
    });


  } catch (err) {
    console.error('Failed to load skills:', err);
    container.innerHTML = '<p>Error loading skills</p>';
  }
}

async function deleteSkill(skill) {
  const token = localStorage.getItem('token');
  if (!token) {
    showGlobalMessage("You are not logged in.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/user/skills`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ skill })
    });

    const data = await res.json();

    if (res.ok) {
      showGlobalMessage("Skill deleted.", "success");
      fetchAndRenderSkills(); // refresh skills list
    } else {
      showGlobalMessage(data.message || "Failed to delete skill", "error");
    }
  } catch (err) {
    showGlobalMessage("Network error: " + err.message, "error");
  }
}


function setupSkillsPage() {
  const addBtn = document.getElementById('addSkillBtn');
  const container = document.getElementById('skillsContainer');
  if (!addBtn || !container) return;

  // initially populate
  fetchAndRenderSkills();

  addBtn.addEventListener('click', () => {
    // If an input area already exists, toggle visibility
    if (document.getElementById('newSkillInput')) {
      const wrapper = document.getElementById('newSkillWrapper');
      if (wrapper) wrapper.remove();
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'newSkillWrapper';
    wrapper.style.marginTop = '8px';

    const input = document.createElement('input');
    input.id = 'newSkillInput';
    input.type = 'text';
    input.placeholder = 'Enter a skill';
    input.style.padding = '6px';
    input.style.minWidth = '220px';

    const save = document.createElement('button');
    save.textContent = 'Save';
    save.style.marginLeft = '8px';

    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.style.marginLeft = '6px';

    wrapper.appendChild(input);
    wrapper.appendChild(save);
    wrapper.appendChild(cancel);
    addBtn.parentNode.insertBefore(wrapper, addBtn.nextSibling);

    cancel.addEventListener('click', () => { wrapper.remove(); });

    save.addEventListener('click', async () => {
      const skill = input.value.trim();
      if (!skill) { showInlineMessage(wrapper, 'Please enter a skill', 'error'); return; }

      const token = localStorage.getItem('token');
      if (!token) { showInlineMessage(wrapper, 'You must be logged in to add skills', 'error'); return; }

      save.disabled = true; save.textContent = 'Saving...';
      try {
        const res = await fetch(`${API_BASE}/user/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ skill })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          wrapper.remove();
          fetchAndRenderSkills();
        } else {
          showInlineMessage(wrapper, `Failed to add skill: ${data.message || res.status}`, 'error');
          save.disabled = false; save.textContent = 'Save';
        }
      } catch (err) {
        showInlineMessage(wrapper, `Network error: ${err.message}`, 'error');
        save.disabled = false; save.textContent = 'Save';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', setupSkillsPage);

// ==== USER JOB SEARCH PAGE ====

async function setupJobSearchPage() {
  const btn = document.getElementById('findJobsBtn');
  const output = document.getElementById('jobsOutput');
  if (!btn || !output) return;

  btn.addEventListener('click', async () => {
    output.textContent = "Searching jobs...";

    const token = localStorage.getItem('token');
    if (!token) {
      output.textContent = "Please log in first.";
      return;
    }

    try {
      // 1. Get user skills dynamically
      const skillRes = await fetch(`${API_BASE}/user/skills`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const skillData = await skillRes.json();
      const userSkills = Array.isArray(skillData.skills) ? skillData.skills : [];

      if (userSkills.length === 0) {
        output.textContent = "You have no skills saved. Add skills first!";
        return;
      }

      // 2. Call job search API using real user skills
      const res = await fetch(`${API_BASE}/jobs/search_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          job_wanted: "Software Engineer",
          location: "Vancouver",
          skills: userSkills,
          limit: 5
        })
      });

      if (!res.ok) {
        output.textContent = `Error: ${res.status}`;
        return;
      }

      const data = await res.json();

      if (data.error) {
        output.textContent = `Server Error: ${data.error}`;
        return;
      }

      if (!data.jobs || data.jobs.length === 0) {
        output.textContent = "No matching jobs found.";
        return;
      }

      // 3. Render jobs
      output.innerHTML = "";

      data.jobs.forEach(job => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.style.background = "#f9f9f9";

        div.innerHTML = `
        <h3><a href="${job.url}" target="_blank">${job.title}</a></h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location || "N/A"}</p>
        <p><strong>AI Summary:</strong><br>${job.ai_summary || "No summary"}</p>
      `;

        output.appendChild(div);
      });

    } catch (err) {
      output.textContent = `Network error: ${err.message}`;
    }
  });
}
//   btn.addEventListener('click', async () => {
//     output.textContent = "Searching jobs...";

//     const token = localStorage.getItem('token');
//     if (!token) {
//       output.textContent = "Please log in first.";
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/jobs/search_user`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           job_wanted: "Software Engineer",
//           location: "Vancouver",
//           skills: ["Java", "JavaScript", "Python", "SQL"],
//           limit: 5
//         })
//       });

//       if (!res.ok) {
//         output.textContent = `Error: ${res.status}`;
//         return;
//       }

//       const data = await res.json();

//       if (data.error) {
//         output.textContent = `Server Error: ${data.error}`;
//         return;
//       }

//       if (!data.jobs || data.jobs.length === 0) {
//         output.textContent = "No matching jobs found.";
//         return;
//       }

//       // render only FILTERED jobs
//       output.innerHTML = "";

//       data.jobs.forEach(job => {
//         const div = document.createElement("div");
//         div.style.border = "1px solid #ccc";
//         div.style.padding = "10px";
//         div.style.marginBottom = "10px";
//         div.style.background = "#f9f9f9";

//         div.innerHTML = `
//           <h3><a href="${job.url}" target="_blank">${job.title}</a></h3>
//           <p><strong>Company:</strong> ${job.company}</p>
//           <p><strong>Location:</strong> ${job.location || "N/A"}</p>
//           <p><strong>AI Summary:</strong><br>${job.ai_summary || "No summary"}</p>
//         `;

//         output.appendChild(div);
//       });

//     } catch (err) {
//       output.textContent = `Network error: ${err.message}`;
//     }
//   });
// }

document.addEventListener('DOMContentLoaded', setupJobSearchPage);



