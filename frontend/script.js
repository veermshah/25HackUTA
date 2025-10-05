function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

const logo = document.querySelector(".nav-logo");
if (logo) {
    logo.addEventListener("click", () => {
        logo.style.opacity = "0.7";
        setTimeout(() => {
            logo.style.opacity = "1";
        }, 200);
    });
}

const demoBtn = document.querySelector(".btn-secondary");
if (demoBtn) {
    demoBtn.addEventListener("click", () => {
        alert(
            "📺 Demo coming soon! A calm, focused reading experience awaits."
        );
    });
}

const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const wordsCount = document.getElementById("wordsCount");
            const kidsCount = document.getElementById("kidsCount");
            const starsCount = document.getElementById("starsCount");

            if (wordsCount && kidsCount && starsCount) {
                animateCounter(wordsCount, 1234, 2000);
                animateCounter(kidsCount, 567, 2000);
                animateCounter(starsCount, 8901, 2000);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector(".stats-preview");
if (statsSection) {
    statsObserver.observe(statsSection);
}

function addScrollEffects() {
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(255, 255, 255, 0.98)";
            navbar.style.boxShadow = "var(--shadow)";
        } else {
            navbar.style.background = "rgba(255, 255, 255, 0.95)";
            navbar.style.boxShadow = "none";
        }
    });
}
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        ".feature-card, .floating-card, .stat-card"
    );
    animateElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });
}

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
const greetings = [
    "Welcome to your focused reading space 🦊",
    "Ready to practice at your own pace? 📖",
    "A calm place to build your reading skills ✨",
    "Your reading journey starts here 📚",
];

console.log(greetings[Math.floor(Math.random() * greetings.length)]);
window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});

// Auth0 configuration and initialization
let auth0Client = null;

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

const login = async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin + "/frontend/profile.html",
        },
    });
};

document.addEventListener("DOMContentLoaded", function () {
    addScrollEffects();
    animateOnScroll();

    // Initialize Auth0
    configureClient();

    const loginBtn = document.getElementById("loginBtn");
    const startReadingBtn = document.getElementById("startReadingBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", login);
    }

    if (startReadingBtn) {
        startReadingBtn.addEventListener("click", login);
    }

    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
            const icon = this.querySelector(".feature-icon");
            if (icon) {
                icon.style.transform = "scale(1.1)";
                icon.style.transition = "transform 0.3s ease";
            }
        });

        card.addEventListener("mouseleave", function () {
            const icon = this.querySelector(".feature-icon");
            if (icon) {
                icon.style.transform = "scale(1)";
            }
        });
    });
});
