import { STRINGS } from "../lang/en/user.js";

document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // ACCOUNT PAGE
    // ================================
    const accountHeader = document.querySelector("h1");
    if (accountHeader && accountHeader.textContent.includes("Your Account")) {
        // Replace header
        accountHeader.textContent = STRINGS.ACCOUNT_HEADER || "Your Account";

        // Logout button
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.textContent = STRINGS.LOGOUT || "Logout";
    }

    // ================================
    // ADMIN PAGE
    // ================================
    const adminWelcome = document.querySelector("h1 span#usernameDisplay");
    if (adminWelcome) {
        const title = document.querySelector("h1");
        if (title) title.childNodes[0].textContent = STRINGS.ADMIN_WELCOME || "Welcome to your Admin Page, ";
    }

    const userTable = document.getElementById("usersTable");
    if (userTable) {
        // Replace column headers
        const th = userTable.querySelectorAll("th");
        if (th[0]) th[0].textContent = STRINGS.USERNAME_LABEL || "Username";
        if (th[1]) th[1].textContent = STRINGS.API_CALLS_LABEL || "API Calls";
        if (th[2]) th[2].textContent = STRINGS.ADMIN_LABEL || "Admin";
        if (th[3]) th[3].textContent = STRINGS.STATUS_LABEL || "Status";
    }

    // ================================
    // JOBS PAGE
    // ================================
    const jobsHeader = document.querySelector("h1");
    if (jobsHeader && jobsHeader.textContent.includes("Find Jobs")) {
        const findBtn = document.getElementById("findJobsBtn");
        if (findBtn) findBtn.textContent = STRINGS.SEARCHING_JOBS_BTN || "Find Jobs Based on My Skills";
    }

    // ================================
    // LEETCODE PAGE
    // ================================
    const leetcodeHeader = document.querySelector(".leetcode-container h1");
    if (leetcodeHeader) {
        leetcodeHeader.textContent = STRINGS.LEETCODE_HEADER || "LeetCode Question Recommendations";

        const submitBtn = document.getElementById("submitBtn");
        if (submitBtn) submitBtn.textContent = STRINGS.GET_QUESTIONS || "Get Questions";
    }

    // ================================
    // LOGIN PAGE
    // ================================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        const h1 = document.querySelector("h1");
        if (h1) h1.textContent = STRINGS.LOGIN_HEADER || "Login";

        const usernameLabel = document.querySelector('label[for="username"]');
        if (usernameLabel) usernameLabel.textContent = STRINGS.EMAIL_LABEL || "Email:";

        const passwordLabel = document.querySelector('label[for="password"]');
        if (passwordLabel) passwordLabel.textContent = STRINGS.PASSWORD_LABEL || "Password:";

        const btn = loginForm.querySelector("button");
        if (btn) btn.textContent = STRINGS.LOGIN_BTN || "Login";
    }

    // ================================
    // REGISTER PAGE
    // ================================
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        const h1 = document.querySelector("h1");
        if (h1) h1.textContent = STRINGS.REGISTER_HEADER || "Register";

        const email = document.querySelector('label[for="username"]');
        if (email) email.textContent = STRINGS.EMAIL_LABEL || "Email:";

        const pass = document.querySelector('label[for="password"]');
        if (pass) pass.textContent = STRINGS.PASSWORD_LABEL || "Password:";

        const confirm = document.querySelector('label[for="confirmPassword"]');
        if (confirm) confirm.textContent = STRINGS.CONFIRM_PASSWORD_LABEL || "Confirm Password:";

        const btn = registerForm.querySelector("button");
        if (btn) btn.textContent = STRINGS.REGISTER_BTN || "Register";
    }

    // ================================
    // SKILLS PAGE
    // ================================
    const skillsHeader = document.querySelector("h1");
    if (skillsHeader && skillsHeader.textContent.includes("Your Skills")) {
        const addSkillBtn = document.getElementById("addSkillBtn");
        if (addSkillBtn) addSkillBtn.textContent = STRINGS.ADD_SKILL || "Add new skill";
    }

    // ================================
    // HOMEPAGE (index.html)
    // ================================
    const homepageTitle = document.querySelector("h1");
    const homepageSubtitle = document.querySelector("h2");

    // detect homepage by text (safe)
    if (homepageTitle && homepageTitle.textContent.includes("Help me land a job")) {

        // Title
        homepageTitle.textContent = STRINGS.HOMEPAGE_TITLE || "Help me land a job";

        // Subtitle
        if (homepageSubtitle) {
            homepageSubtitle.textContent =
                STRINGS.HOMEPAGE_SUBTITLE ||
                "The one and only website that's going to help you land a job in todays awful job market";
        }

        // Login button
        const loginBtn = document.querySelector('.form-footer a[href="pages/login.html"]');
        if (loginBtn) loginBtn.textContent = STRINGS.LOGIN_BTN || "Login";

        // Register button
        const registerBtn = document.querySelector('.form-footer a[href="pages/register.html"]');
        if (registerBtn) registerBtn.textContent = STRINGS.REGISTER_BTN || "Register";
    }


});
