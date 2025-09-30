// ===================================
// Navigation & Mobile Menu
// ===================================

const navbar = document.getElementById("navbar")
const menuToggle = document.getElementById("menuToggle")
const navLinks = document.getElementById("navLinks")
const navLinkItems = document.querySelectorAll(".nav-links a")

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Mobile menu toggle
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active")
  navLinks.classList.toggle("active")
})

// Close mobile menu when clicking on a link
navLinkItems.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active")
    navLinks.classList.remove("active")
  })
})

// ===================================
// Typing Effect
// ===================================

const typingText = document.getElementById("typingText")
const textToType = "Estudiante avanzado de Ingeniería Informática & Backend Developer"
let charIndex = 0

function typeText() {
  if (charIndex < textToType.length) {
    typingText.textContent = textToType.substring(0, charIndex + 1)
    charIndex++
    setTimeout(typeText, 80)
  }
}

// Start typing effect when page loads
window.addEventListener("load", () => {
  setTimeout(typeText, 500)
})

// ===================================
// Scroll Animations
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

// Observe all sections and cards for fade-in animation
const animatedElements = document.querySelectorAll(
  ".skill-card, .timeline-item, .project-card, .contact-info, .contact-form",
)

animatedElements.forEach((el) => {
  el.classList.add("fade-in")
  observer.observe(el)
})

// ===================================
// Form Validation & Submission
// ===================================

const contactForm = document.getElementById("contactForm")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const messageInput = document.getElementById("message")
const formSuccess = document.getElementById("formSuccess")

// Validation functions
function validateName(name) {
  return name.trim().length >= 2
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateMessage(message) {
  return message.trim().length >= 10
}

// Show error message
function showError(inputId, message) {
  const errorElement = document.getElementById(`${inputId}Error`)
  errorElement.textContent = message
}

// Clear error message
function clearError(inputId) {
  const errorElement = document.getElementById(`${inputId}Error`)
  errorElement.textContent = ""
}

// Real-time validation
nameInput.addEventListener("blur", () => {
  if (!validateName(nameInput.value)) {
    showError("name", "El nombre debe tener al menos 2 caracteres")
  } else {
    clearError("name")
  }
})

emailInput.addEventListener("blur", () => {
  if (!validateEmail(emailInput.value)) {
    showError("email", "Por favor ingresa un email válido")
  } else {
    clearError("email")
  }
})

messageInput.addEventListener("blur", () => {
  if (!validateMessage(messageInput.value)) {
    showError("message", "El mensaje debe tener al menos 10 caracteres")
  } else {
    clearError("message")
  }
})

// Form submission
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Clear previous errors
  clearError("name")
  clearError("email")
  clearError("message")

  let isValid = true

  // Validate all fields
  if (!validateName(nameInput.value)) {
    showError("name", "El nombre debe tener al menos 2 caracteres")
    isValid = false
  }

  if (!validateEmail(emailInput.value)) {
    showError("email", "Por favor ingresa un email válido")
    isValid = false
  }

  if (!validateMessage(messageInput.value)) {
    showError("message", "El mensaje debe tener al menos 10 caracteres")
    isValid = false
  }

  // If form is valid, show success message
  if (isValid) {
    // In a real application, you would send the data to a server here
    console.log("Form data:", {
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value,
    })

    // Show success message
    formSuccess.classList.add("show")

    // Reset form
    contactForm.reset()

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.classList.remove("show")
    }, 5000)
  }
})

// ===================================
// Smooth Scroll Enhancement
// ===================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))

    if (target) {
      const offsetTop = target.offsetTop - 80 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// ===================================
// Performance: Lazy Loading Images
// ===================================

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src || img.src
        img.classList.add("loaded")
        observer.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img").forEach((img) => {
    imageObserver.observe(img)
  })
}

// ===================================
// Console Message
// ===================================

console.log("%c¡Hola! 👋", "font-size: 20px; font-weight: bold; color: #00d9ff;")
console.log(
  "%cGracias por visitar mi portfolio. Si estás viendo esto, ¡probablemente nos llevemos bien!",
  "font-size: 14px; color: #a0a0b0;",
)
console.log("%cContáctame: franpipito7@gmail.com", "font-size: 14px; color: #7c3aed;")
