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
    }


    // ================================
    // HOME PAGE (after login)
    // ================================
    if (path.endsWith("/home.html")) {
        const h1 = document.querySelector("h1");
        if (h1) {
            // keep username span intact
            const span = document.getElementById("usernameDisplay");
            h1.textContent = STRINGS.HOME_WELCOME || "Welcome, ";
            if (span) h1.appendChild(span);
        }

        const apiCallDisplay = document.getElementById("apiCallsDisplay");
        if (apiCallDisplay) apiCallDisplay.textContent = STRINGS.START_TOKEN_COUNT;
    }


    // ================================
    // JOBS PAGE
    // ================================
    if (path.endsWith("/jobs.html")) {

        const h1 = document.querySelector("h1");
        if (h1) h1.textContent = STRINGS.JOBS_HEADER || "Find Jobs";

        const findBtn = document.getElementById("findJobsBtn");
        if (findBtn) findBtn.textContent = STRINGS.SEARCHING_JOBS_BTN;
    }


    // ================================
    // LEETCODE PAGE
    // ================================
    if (path.endsWith("/leetcode.html")) {

        const header = document.querySelector(".leetcode-container h1");
        if (header) header.textContent = STRINGS.LEETCODE_HEADER;

        const submitBtn = document.getElementById("submitBtn");
        if (submitBtn) submitBtn.textContent = STRINGS.GET_QUESTIONS;
    }


    // ================================
    // LOGIN PAGE
    // ================================
    if (path.endsWith("/login.html")) {

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
        if (improveBtn) improveBtn.textContent = STRINGS.IMPROVING_RESUME;
    }

});
