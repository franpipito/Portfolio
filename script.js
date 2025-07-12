document.getElementById("hamburger").addEventListener("click", () => {
document.getElementById("nav-links").classList.toggle("open");
});

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("load", () => {
tsParticles.load("tsparticles", {
    background: {
    color: {
    value: "#121212"
    }
},
particles: {
    number: {
    value: 40,
    density: {
        enable: true,
        area: 800
    }
    },
    color: {
    value: "#BB86FC"
    },
    shape: {
    type: "circle"
    },
    opacity: {
    value: 0.6
    },
    size: {
    value: { min: 2, max: 4 }
    },
    move: {
    enable: true,
    speed: 1,
    direction: "none",
    outModes: "bounce"
    }
},
interactivity: {
    events: {
    onHover: {
        enable: true,
        mode: "repulse"
    }
    },
    modes: {
    repulse: {
        distance: 100
    }
    }
},
fullScreen: {
    enable: false
}
});
});

// Animaciones con IntersectionObserver
const faders = document.querySelectorAll('.fade-in');

const options = {
threshold: 0.3
};

const observer = new IntersectionObserver((entries, obs) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    obs.unobserve(entry.target); // Se ejecuta una sola vez
}
});
}, options);

faders.forEach(el => observer.observe(el));


