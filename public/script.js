// ===================================
// Navegación y menú mobile
// ===================================

const navbar = document.getElementById("navbar")
const menuToggle = document.getElementById("menuToggle")
const navLinks = document.getElementById("navLinks")

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30)
}, { passive: true })

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("active")
  menuToggle.classList.toggle("active", open)
  menuToggle.setAttribute("aria-expanded", String(open))
})

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active")
    navLinks.classList.remove("active")
    menuToggle.setAttribute("aria-expanded", "false")
  })
})

// ===================================
// Barra de progreso de scroll
// ===================================

const scrollProgress = document.getElementById("scrollProgress")

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%"
}, { passive: true })

// ===================================
// Glow que sigue al cursor + spotlight en cards
// ===================================

const cursorGlow = document.getElementById("cursorGlow")
const spotlightCards = document.querySelectorAll(".bento-card, .project-card")
const finePointer = window.matchMedia("(pointer: fine)").matches

if (finePointer) {
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`
    cursorGlow.style.top = `${e.clientY}px`
  }, { passive: true })

  spotlightCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`)
      card.style.setProperty("--my", `${e.clientY - rect.top}px`)
    })
  })
} else {
  cursorGlow.style.display = "none"
}

// ===================================
// Terminal: tipeo en loop
// ===================================

const terminalTyped = document.getElementById("terminalTyped")
const commands = [
  "npx expo run:ios --configuration Release",
  "npm run deploy -- --production",
  "node sync-meli.js --account=all",
  'git commit -m "ship it 🚀"',
]
let cmdIndex = 0
let charIndex = 0
let deleting = false

function typeLoop() {
  if (!terminalTyped) return
  const current = commands[cmdIndex]

  if (!deleting) {
    charIndex++
    terminalTyped.textContent = current.slice(0, charIndex)
    if (charIndex === current.length) {
      deleting = true
      setTimeout(typeLoop, 2200)
      return
    }
    setTimeout(typeLoop, 55 + Math.random() * 60)
  } else {
    charIndex--
    terminalTyped.textContent = current.slice(0, charIndex)
    if (charIndex === 0) {
      deleting = false
      cmdIndex = (cmdIndex + 1) % commands.length
      setTimeout(typeLoop, 500)
      return
    }
    setTimeout(typeLoop, 25)
  }
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

if (reducedMotion) {
  if (terminalTyped) terminalTyped.textContent = commands[0]
} else {
  setTimeout(typeLoop, 900)
}

// ===================================
// Reveal on scroll + contadores animados
// ===================================

function animateCount(el) {
  const target = Number.parseFloat(el.dataset.count)
  const suffix = el.dataset.suffix || ""
  const decimals = el.dataset.count.includes(".") ? 1 : 0
  const duration = 1400
  const start = performance.now()

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = (target * eased).toFixed(decimals) + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return
    entry.target.classList.add("in-view")
    entry.target.querySelectorAll("[data-count]").forEach((counter) => {
      if (!reducedMotion) {
        animateCount(counter)
      } else {
        counter.textContent = counter.dataset.count + (counter.dataset.suffix || "")
      }
    })
    observer.unobserve(entry.target)
  })
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" })

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el))

// ===================================
// Formulario: validación y envío (Netlify Forms)
// ===================================

const contactForm = document.getElementById("contactForm")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const messageInput = document.getElementById("message")
const subjectInput = document.getElementById("emailSubject")
const formSuccess = document.getElementById("formSuccess")
const formError = document.getElementById("formError")
const submitButton = contactForm.querySelector('button[type="submit"]')

function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&")
}

function validateName(name) {
  return name.trim().length >= 2
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showError(inputId, message) {
  document.getElementById(`${inputId}Error`).textContent = message
}

function clearError(inputId) {
  document.getElementById(`${inputId}Error`).textContent = ""
}

nameInput.addEventListener("blur", () => {
  if (!validateName(nameInput.value)) {
    showError("name", "El nombre debe tener al menos 2 caracteres")
  } else {
    clearError("name")
  }
})

emailInput.addEventListener("blur", () => {
  if (!validateEmail(emailInput.value)) {
    showError("email", "Por favor ingresá un email válido")
  } else {
    clearError("email")
  }
})

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  clearError("name")
  clearError("email")
  clearError("message")
  formSuccess.classList.remove("show")
  formError.classList.remove("show")

  let isValid = true

  if (!validateName(nameInput.value)) {
    showError("name", "El nombre debe tener al menos 2 caracteres")
    isValid = false
  }

  if (!validateEmail(emailInput.value)) {
    showError("email", "Por favor ingresá un email válido")
    isValid = false
  }

  if (isValid) {
    const originalLabel = submitButton.innerHTML
    submitButton.disabled = true
    submitButton.textContent = "Enviando..."
    const senderName = nameInput.value.trim()
    subjectInput.value = senderName
      ? `Nuevo contacto desde portfolio: ${senderName}`
      : "Nuevo contacto desde portfolio"

    const payload = {
      "form-name": contactForm.getAttribute("name"),
      subject: subjectInput.value,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      "bot-field": "",
    }

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeFormData(payload),
      })

      if (!response.ok) {
        throw new Error("Error al enviar formulario")
      }

      formSuccess.classList.add("show")
      contactForm.reset()

      setTimeout(() => {
        formSuccess.classList.remove("show")
      }, 5000)
    } catch (error) {
      console.error("Contact form error:", error)
      formError.classList.add("show")

      setTimeout(() => {
        formError.classList.remove("show")
      }, 6000)
    } finally {
      submitButton.disabled = false
      submitButton.innerHTML = originalLabel
    }
  }
})

// ===================================
// Smooth scroll con offset del navbar
// ===================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"))
    if (!target) return
    e.preventDefault()
    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 70
    window.scrollTo({ top: offsetTop, behavior: reducedMotion ? "auto" : "smooth" })
  })
})

// ===================================
// Mensaje en consola
// ===================================

console.log("%c¡Hola! 👋", "font-size: 20px; font-weight: bold; color: #4ade80;")
console.log(
  "%cGracias por visitar mi portfolio. Si estás viendo esto, probablemente nos llevemos bien.",
  "font-size: 14px; color: #93a89a;",
)
console.log("%c→ franpipito7@gmail.com", "font-size: 14px; color: #22c55e;")
