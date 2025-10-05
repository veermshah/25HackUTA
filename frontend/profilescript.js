// Auth0 configuration and client
let auth0Client = null;
let currentUser = null;

const configureClient = async () => {
    const response = await fetch("./auth_config.json");
    const config = await response.json();

    auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId,
        authorizationParams: {
            redirect_uri: window.location.origin + "/frontend/profile.html",
        },
    });
};

const handleRedirectCallback = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
    ) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }

    if (await auth0Client.isAuthenticated()) {
        currentUser = await auth0Client.getUser();
        loadUserData();
    } else {
        // Redirect to login if not authenticated
        window.location.href = "index.html";
    }
};

const logout = async () => {
    await auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin + "/frontend/index.html",
        },
    });
};

const userData = {
    name: "Sahas",
    fullName: "Sahas sharma",
    grade: "Grade 3",
    avatar: "ss",
    totalWords: 248,
    totalTime: 12.5,
    accuracy: 87,
    level: "🏆 Gold",
    stars: 156,
    streakDays: 7,
    todayProgress: 75, // percentage
    wordsRemaining: 15,
};

document.addEventListener("DOMContentLoaded", async function () {
    try {
        await configureClient();
        await handleRedirectCallback();
        generateCalendar();
        animateStats();
        initializeEventListeners();
        animateProgressBar();
    } catch (error) {
        console.error("Error initializing Auth0:", error);
        window.location.href = "index.html";
    }
});

function loadUserData() {
    // Use Auth0 user data if available, otherwise use default userData
    const displayName = currentUser
        ? currentUser.name || currentUser.nickname || currentUser.email
        : userData.name;
    const fullName = currentUser ? currentUser.name : userData.fullName;
    const avatar = currentUser
        ? currentUser.picture
            ? `<img src="${currentUser.picture}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
            : userData.avatar
        : userData.avatar;

    // Load user information
    document.getElementById("userName").textContent = displayName;
    document.getElementById("profileName").textContent = fullName;
    document.getElementById("userAvatar").innerHTML =
        typeof avatar === "string" && avatar.includes("<img")
            ? avatar
            : `<span>${avatar}</span>`;

    // Load stats
    document.getElementById("totalWords").textContent = userData.totalWords;
    document.getElementById("totalTime").textContent = userData.totalTime;
    document.getElementById("accuracy").textContent = userData.accuracy + "%";
    document.getElementById("streakDays").textContent = userData.streakDays;

    // Load progress
    const progressPercent = userData.todayProgress + "%";
    document.getElementById("progressPercent").textContent = progressPercent;
    document.getElementById("progressFill").style.width = "0%"; // Start at 0 for animation

    // Update progress text
    const progressText = document.querySelector(".progress-text");
    if (userData.todayProgress >= 100) {
        progressText.textContent = "🎉 Daily goal completed! Great job!";
        progressText.style.color = "var(--accent-coral)";
        progressText.style.fontWeight = "700";
    } else {
        progressText.textContent = `${userData.wordsRemaining} more words to complete today!`;
    }
}

function animateStats() {
    const stats = [
        {
            element: document.getElementById("totalWords"),
            target: userData.totalWords,
        },
        {
            element: document.getElementById("totalTime"),
            target: userData.totalTime,
            decimal: true,
        },
        {
            element: document.getElementById("streakDays"),
            target: userData.streakDays,
        },
    ];

    stats.forEach((stat) => {
        animateCounter(stat.element, stat.target, stat.decimal);
    });
}

function animateCounter(element, target, isDecimal = false) {
    const duration = 1500;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = isDecimal ? target.toFixed(1) : target;
            clearInterval(timer);
        } else {
            element.textContent = isDecimal
                ? current.toFixed(1)
                : Math.floor(current);
        }
    }, 16);
}

function animateProgressBar() {
    setTimeout(() => {
        const progressFill = document.getElementById("progressFill");
        progressFill.style.width = userData.todayProgress + "%";
    }, 500);
}

function generateCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    const today = new Date();
    const currentDay = today.getDay();

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

    const practiceData = {
        0: true, // Sunday
        1: true, // Monday
        2: true, // Tuesday
        3: true, // Wednesday
        4: true, // Thursday
        5: true, // Friday
        6: false, // Saturday (today - in progress)
    };

    // Generate calendar days
    for (let i = 0; i < 7; i++) {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";

        const dayLabel = document.createElement("div");
        dayLabel.className = "calendar-day-label";
        dayLabel.textContent = daysOfWeek[i];

        const dayNumber = document.createElement("div");
        dayNumber.className = "calendar-day-number";

        // Calculate date
        const date = new Date(today);
        date.setDate(today.getDate() - currentDay + i);
        dayNumber.textContent = date.getDate();

        // Determine status
        if (i === currentDay) {
            dayElement.classList.add("today");
        } else if (i < currentDay && practiceData[i]) {
            dayElement.classList.add("completed");
        } else if (i < currentDay && !practiceData[i]) {
            dayElement.classList.add("inactive");
        } else {
            dayElement.classList.add("inactive");
        }

        dayElement.appendChild(dayLabel);
        dayElement.appendChild(dayNumber);
        calendarGrid.appendChild(dayElement);
    }
}

function initializeEventListeners() {
    const homeBtn = document.getElementById("homeBtn");
    const settingsBtn = document.getElementById("settingsBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const editProfileBtn = document.getElementById("editProfileBtn");

    homeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    settingsBtn.addEventListener("click", () => {
        alert("⚙️ Settings coming soon!");
    });

    logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            logout();
        }
    });

    editProfileBtn.addEventListener("click", () => {
        alert("✏️ Profile editing coming soon!");
    });

    const badges = document.querySelectorAll(".badge");
    badges.forEach((badge) => {
        badge.addEventListener("click", function () {
            const title = this.getAttribute("title");
            showNotification(`🎉 ${title} badge earned!`);
        });
    });

    const logo = document.querySelector(".nav-logo");
    logo.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border: 2px solid var(--primary-orange);
        z-index: 10000;
        font-weight: 600;
        color: var(--text-primary);
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

const actionButtons = document.querySelectorAll(".action-btn");
actionButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-5px)";
    });

    btn.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
    });
});

const avatar = document.getElementById("userAvatar");
avatar.addEventListener("click", function () {
    this.style.animation = "none";
    setTimeout(() => {
        this.style.animation = "spin 0.6s ease";
    }, 10);
});

const avatarStyles = document.createElement("style");
avatarStyles.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(avatarStyles);

if (userData.streakDays >= 7) {
    setTimeout(() => {
        const streakIcon = document.querySelector(".streak-icon");
        streakIcon.style.animation = "fire 0.5s ease infinite";
    }, 1000);
}

const fireAnimation = document.createElement("style");
fireAnimation.textContent = `
    @keyframes fire {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(fireAnimation);

// ==================== CALENDAR DAY CLICK ====================
document.addEventListener("click", function (e) {
    if (
        e.target.closest(".calendar-day") &&
        !e.target.closest(".calendar-day.empty")
    ) {
        const day = e.target.closest(".calendar-day");
        const dayNumber = day.querySelector(".calendar-day-number").textContent;

        if (day.classList.contains("completed")) {
            showNotification(`✅ Practiced on day ${dayNumber}!`);
        } else if (day.classList.contains("today")) {
            showNotification(
                `📅 Today's practice: ${userData.todayProgress}% complete!`
            );
        } else {
            showNotification(
                `📆 Day ${dayNumber} - Keep building your streak!`
            );
        }
    }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

const motivationalMessages = [
    "🌟 You're doing great! Keep practicing!",
    "🚀 Every word you learn is progress!",
    "💪 Your hard work is paying off!",
    "🎯 Focus and patience - you've got this!",
    "⭐ Reading champion in the making!",
];

setTimeout(() => {
    const randomMessage =
        motivationalMessages[
            Math.floor(Math.random() * motivationalMessages.length)
        ];
    showNotification(randomMessage);
}, 2000);

document.addEventListener("keydown", function (e) {
    // Press 'P' for practice
    if (e.key === "p" || e.key === "P") {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            window.location.href = "practice.html";
        }
    }

    // Press 'S' for struggle words
    if (e.key === "s" || e.key === "S") {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            window.location.href = "struggle.html";
        }
    }
});

window.addEventListener("load", () => {
    const cards = document.querySelectorAll(
        ".welcome-card, .profile-card, .streak-card"
    );
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        setTimeout(() => {
            card.style.transition = "all 0.6s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 150);
    });
});

console.log(
    "%c🦊 Welcome to DyslexicJit!",
    "color: #FF6B35; font-size: 20px; font-weight: bold;"
);
console.log(
    "%cKeep practicing and you'll become a reading champion! 📚",
    "color: #5A5A5A; font-size: 14px;"
);
console.log(
    '%cKeyboard shortcuts: Press "P" for Practice, "S" for Struggle Words',
    "color: #FF8C42; font-size: 12px;"
);
