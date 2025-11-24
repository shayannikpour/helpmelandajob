import { STRINGS } from "../lang/en/user.js";

document.addEventListener("DOMContentLoaded", () => {

    const path = window.location.pathname;

    // ================================
    // INDEX PAGE
    // ================================
    if (path.endsWith("/index.html") || path === "/" || path.endsWith("/")) {

        console.log("Index page");

        const h1 = document.querySelector("h1");
        const h2 = document.querySelector("h2");

        if (h1) h1.textContent = STRINGS.HOMEPAGE_TITLE;
        if (h2) h2.textContent = STRINGS.HOMEPAGE_SUBTITLE;

        const loginBtn = document.querySelector('.form-footer a[href="pages/login.html"]');
        if (loginBtn) loginBtn.textContent = STRINGS.LOGIN_BTN;

        const registerBtn = document.querySelector('.form-footer a[href="pages/register.html"]');
        if (registerBtn) registerBtn.textContent = STRINGS.REGISTER_BTN;
    }


    // ================================
    // ACCOUNT PAGE
    // ================================
    if (path.endsWith("/account.html")) {

        const accountHeader = document.querySelector("h1");
        if (accountHeader) accountHeader.textContent = STRINGS.ACCOUNT_HEADER;

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.textContent = STRINGS.LOGOUT;
    }


    // ================================
    // ADMIN HOME PAGE
    // ================================
    if (path.endsWith("/admin-home.html")) {

        const adminTitle = document.querySelector("h1");
        if (adminTitle) {
            // Preserve the username span
            const span = adminTitle.querySelector("span#usernameDisplay");
            adminTitle.textContent = STRINGS.ADMIN_WELCOME;
            if (span) adminTitle.appendChild(span);
        }

        const userTable = document.getElementById("usersTable");
        if (userTable) {
            const th = userTable.querySelectorAll("th");
            if (th[0]) th[0].textContent = STRINGS.USERNAME_LABEL;
            if (th[1]) th[1].textContent = STRINGS.API_CALLS_LABEL;
            if (th[2]) th[2].textContent = STRINGS.ADMIN_LABEL;
            if (th[3]) th[3].textContent = STRINGS.STATUS_LABEL;
        }

        const endpointsTable = document.getElementById("endpointsTable");
        if (endpointsTable) {

            // Set the <h2> above the table
            const endpointsHeader = document.querySelector('h2:nth-of-type(2)');
            if (endpointsHeader) {
                endpointsHeader.textContent = STRINGS.ENDPOINTS_HEADER;
            }

            const th2 = endpointsTable.querySelectorAll("th");

            if (th2[0]) th2[0].textContent = STRINGS.ENDPOINTS_ID_LABEL;
            if (th2[1]) th2[1].textContent = STRINGS.ENDPOINTS_METHOD_LABEL;
            if (th2[2]) th2[2].textContent = STRINGS.ENDPOINTS_ENDPOINT_LABEL;
            if (th2[3]) th2[3].textContent = STRINGS.ENDPOINTS_REQUESTS_LABEL;
        }
    }


    // ================================
    // HOME PAGE (after login)
    // ================================
    if (path.endsWith("/home.html")) {
        const apiCallsLabel = document.querySelector("p");
        if (apiCallsLabel) apiCallsLabel.textContent = STRINGS.API_CALLS_LABEL + ":";

        const apiCallDisplay = document.getElementById("apiCallsDisplay");
        if (apiCallDisplay) apiCallDisplay.textContent = STRINGS.START_TOKEN_COUNT;
    }


    // ================================
    // JOBS PAGE
    // ================================
    if (path.endsWith("/jobs.html")) {

        const h1 = document.getElementById("jobsTitle");
        if (h1) h1.textContent = STRINGS.JOBS_HEADER;

        const findBtn = document.getElementById("findJobsBtn");
        if (findBtn) findBtn.textContent = STRINGS.SEARCHING_JOBS_BTN;
    }


    // ================================
    // LEETCODE PAGE
    // ================================
    // ================================
    // LEETCODE PAGE
    // ================================
    if (path.endsWith("/leetcode.html")) {

        console.log("LeetCode page");

        // Header text
        const header = document.querySelector(".leetcode-container h1");
        if (header) header.textContent = STRINGS.LEETCODE_HEADER;

        // Label: programming language
        const langLabel = document.querySelector('label[for="language"]')
            || document.querySelector('.form-group label:nth-of-type(1)');
        if (langLabel) langLabel.textContent = STRINGS.LEETCODE_LANG_LABEL;

        // Label: difficulty
        const diffLabel = document.querySelector('label[for="difficulty"]')
            || document.querySelector('.form-group label:nth-of-type(2)');
        if (diffLabel) diffLabel.textContent = STRINGS.LEETCODE_DIFF_LABEL;

        // Populate languages
        const langSelect = document.getElementById("language");
        if (langSelect) {
            langSelect.innerHTML = `
            <option value="">${STRINGS.LEETCODE_SELECT_PLACEHOLDER}</option>
            <option>${STRINGS.LANG_PYTHON}</option>
            <option>${STRINGS.LANG_JAVASCRIPT}</option>
            <option>${STRINGS.LANG_JAVA}</option>
            <option>${STRINGS.LANG_CPP}</option>
            <option>${STRINGS.LANG_C}</option>
            <option>${STRINGS.LANG_CSHARP}</option>
            <option>${STRINGS.LANG_GO}</option>
            <option>${STRINGS.LANG_RUBY}</option>
            <option>${STRINGS.LANG_SWIFT}</option>
            <option>${STRINGS.LANG_KOTLIN}</option>
        `;
        }

        // Populate difficulties
        const diffSelect = document.getElementById("difficulty");
        if (diffSelect) {
            diffSelect.innerHTML = `
            <option value="">${STRINGS.LEETCODE_SELECT_PLACEHOLDER}</option>
            <option>${STRINGS.DIFF_EASY}</option>
            <option>${STRINGS.DIFF_MEDIUM}</option>
            <option>${STRINGS.DIFF_HARD}</option>
        `;
        }

        // Submit button
        const submitBtn = document.getElementById("submitBtn");
        if (submitBtn) submitBtn.textContent = STRINGS.GET_QUESTIONS;

        const loadingDiv = document.getElementById("loadingDiv");
        if (loadingDiv) loadingDiv.textContent = STRINGS.LEETCODE_LOADING;
    }



    // ================================
    // LOGIN PAGE
    // ================================
    if (path.endsWith("/login.html")) {
        console.log("Login page");

        const h1 = document.querySelector("h1");
        if (h1) h1.textContent = STRINGS.LOGIN_HEADER;

        const email = document.querySelector('label[for="username"]');
        if (email) email.textContent = STRINGS.EMAIL_LABEL;

        const pass = document.querySelector('label[for="password"]');
        if (pass) pass.textContent = STRINGS.PASSWORD_LABEL;

        const btn = document.querySelector("button");
        if (btn) btn.textContent = STRINGS.LOGIN_BTN;

        const registerLink = document.querySelector('.form-footer a[href="register.html"]');
        if (registerLink) registerLink.textContent = STRINGS.REGISTER_BTN;
    }


    // ================================
    // REGISTER PAGE
    // ================================
    if (path.endsWith("/register.html")) {
        console.log("Register page");

        const h1 = document.querySelector("h1");
        if (h1) h1.textContent = STRINGS.REGISTER_HEADER;

        const email = document.querySelector('label[for="username"]');
        if (email) email.textContent = STRINGS.EMAIL_LABEL;

        const pass = document.querySelector('label[for="password"]');
        if (pass) pass.textContent = STRINGS.PASSWORD_LABEL;

        const confirm = document.querySelector('label[for="confirmPassword"]');
        if (confirm) confirm.textContent = STRINGS.CONFIRM_PASSWORD_LABEL;

        const btn = document.querySelector("button");
        if (btn) btn.textContent = STRINGS.REGISTER_BTN;

        const loginLink = document.querySelector('.form-footer a[href="login.html"]');
        if (loginLink) loginLink.textContent = STRINGS.LOGIN_BTN;
    }


    // ================================
    // SKILLS PAGE
    // ================================
    if (path.endsWith("/skills.html")) {

        const h1 = document.querySelector("h1");
        if (h1) h1.textContent = STRINGS.SKILLS_HEADER;

        const addSkillBtn = document.getElementById("addSkillBtn");
        if (addSkillBtn) addSkillBtn.textContent = STRINGS.ADD_SKILL;
    }


    // ================================
    // RESUME PAGE
    // ================================
    if (path.endsWith("/resume.html")) {

        const h1 = document.querySelector("h1");
        if (h1) h1.textContent = STRINGS.RESUME_HEADER || "Current Resume:";

        const addBtn = document.getElementById("addResumeBtn");
        if (addBtn) addBtn.textContent = STRINGS.ADD_NEW_RESUME;

        const improveBtn = document.getElementById("improveResumeBtn");
        if (improveBtn) improveBtn.textContent = STRINGS.IMPROVE_RESUME_BTN;
    }



    // ================================
    // UNIVERSAL NAVIGATION TEXT
    // ================================
    const navResume = document.querySelector('nav a[href="resume.html"]');
    if (navResume) navResume.textContent = STRINGS.NAV_RESUME;

    const navSkills = document.querySelector('nav a[href="skills.html"]');
    if (navSkills) navSkills.textContent = STRINGS.NAV_SKILLS;

    const navJobs = document.querySelector('nav a[href="jobs.html"]');
    if (navJobs) navJobs.textContent = STRINGS.NAV_JOBS;

    const navLeetcode = document.querySelector('nav a[href="leetcode.html"]');
    if (navLeetcode) navLeetcode.textContent = STRINGS.NAV_LEETCODE;

    const navAccount = document.querySelector('nav a[href="account.html"]');
    if (navAccount) navAccount.textContent = STRINGS.NAV_ACCOUNT;

    // Admin link (only appears on some pages)
    const navAdmin = document.querySelector('#adminLink');
    if (navAdmin) navAdmin.textContent = STRINGS.NAV_ADMIN;

    // Header title
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) headerTitle.textContent = STRINGS.NAV_TITLE;


});
