// Database de usuários (em produção, isso ficaria no servidor)
const users = {
  programacao: { password: "python2024", role: "student", name: "Fulano de Tal" },
  professor: { password: "scratch123", role: "teacher", name: "Prof. Silva" },
  aluno1: { password: "aula2024", role: "student", name: "Maria Santos" },
  aluno2: { password: "scratch456", role: "student", name: "João Oliveira" },
  admin: { password: "admin123", role: "admin", name: "Administrador" },
}

// Função para adicionar novo usuário
function addUser(username, password, role = "student", name = "") {
  users[username] = { password, role, name }
  localStorage.setItem("users", JSON.stringify(users))
  console.log(`Usuário ${username} adicionado com sucesso!`)
}

// Carregar usuários salvos do localStorage
function loadUsers() {
  const savedUsers = localStorage.getItem("users")
  if (savedUsers) {
    Object.assign(users, JSON.parse(savedUsers))
  }
}

// Login functionality
document.addEventListener("DOMContentLoaded", () => {
  loadUsers() // Carrega usuários salvos

  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const username = document.getElementById("username").value
      const password = document.getElementById("password").value

      // Verificar se usuário existe e senha está correta
      if (users[username] && users[username].password === password) {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("username", username)
        localStorage.setItem("userRole", users[username].role)
        localStorage.setItem("userName", users[username].name)

        // Redirecionar baseado no papel do usuário
        if (users[username].role === "teacher" || users[username].role === "admin") {
          window.location.href = "teacher-dashboard.html" // Dashboard do professor
        } else {
          window.location.href = "dashboard.html"
        }
      } else {
        alert("Usuário ou senha incorretos!")
      }
    })
  }

  // Check if user is logged in
  if (window.location.pathname !== "/" && window.location.pathname !== "/index.html") {
    if (!localStorage.getItem("isLoggedIn")) {
      window.location.href = "index.html"
    }
  }
})

// Navigation functions
function goBack() {
  window.history.back()
}

function goToPage(page) {
  window.location.href = page
}

// Materials functions
function downloadFile(filename) {
  // Simulate file download
  alert(`Baixando arquivo: ${filename}`)

  // In a real application, you would trigger an actual download
  // const link = document.createElement('a');
  // link.href = `/files/${filename}`;
  // link.download = filename;
  // link.click();
}

function editFile(filename) {
  // Verificar permissões antes de permitir edição
  const userRole = localStorage.getItem("userRole")

  if (userRole !== "teacher" && userRole !== "admin") {
    alert("Você não tem permissão para editar materiais. Apenas professores e administradores podem fazer isso.")
    return
  }

  // Redirecionar para página de gerenciamento de materiais
  window.location.href = "teacher-materials.html"
}

// Activity functions - MELHORADA
function submitActivity() {
  const form = document.getElementById("activityForm")
  if (form) {
    const formData = new FormData(form)
    const answers = {}

    for (const [key, value] of formData.entries()) {
      answers[key] = value
    }

    // Check required fields
    const requiredFields = form.querySelectorAll("[required]")
    let allFilled = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        allFilled = false
        field.style.borderColor = "red"
      } else {
        field.style.borderColor = "#ddd"
      }
    })

    if (!allFilled) {
      alert("Por favor, preencha todos os campos obrigatórios (marcados com *)")
      return
    }

    // Save answers (in a real app, this would be sent to a server)
    localStorage.setItem("activityAnswers", JSON.stringify(answers))
    alert("Atividade enviada com sucesso!")
    window.location.href = "activities.html"
  }
}

// NOVA FUNÇÃO: Enviar atividade e ir para feedback
function submitActivityAndGoToFeedback() {
  const form = document.getElementById("activityForm")
  if (form) {
    const formData = new FormData(form)
    const answers = {}

    for (const [key, value] of formData.entries()) {
      answers[key] = value
    }

    // Check required fields
    const requiredFields = form.querySelectorAll("[required]")
    let allFilled = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        allFilled = false
        field.style.borderColor = "red"
      } else {
        field.style.borderColor = "#ddd"
      }
    })

    if (!allFilled) {
      alert("Por favor, preencha todos os campos obrigatórios (marcados com *)")
      return
    }

    // Save answers
    localStorage.setItem("activityAnswers", JSON.stringify(answers))

    // Ir direto para o feedback
    alert("Atividade enviada! Agora avalie a aula.")
    window.location.href = "feedback1.html"
  }
}

function submitFeedback() {
  const form = document.getElementById("feedbackForm")
  if (form) {
    const formData = new FormData(form)
    const feedback = {}

    for (const [key, value] of formData.entries()) {
      feedback[key] = value
    }

    // Check required fields
    const requiredFields = form.querySelectorAll("[required]")
    let allFilled = true

    requiredFields.forEach((field) => {
      if (!field.checked && field.type === "radio") {
        const radioGroup = form.querySelectorAll(`[name="${field.name}"]`)
        const isGroupChecked = Array.from(radioGroup).some((radio) => radio.checked)
        if (!isGroupChecked) {
          allFilled = false
        }
      }
    })

    if (!allFilled) {
      alert("Por favor, responda todas as perguntas obrigatórias (marcadas com *)")
      return
    }

    // Save feedback (in a real app, this would be sent to a server)
    localStorage.setItem("feedback", JSON.stringify(feedback))
    alert("Feedback enviado com sucesso! Obrigado pela sua avaliação.")
    window.location.href = "dashboard.html" // Volta para o dashboard
  }
}

// Logout function
function logout() {
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("username")
  localStorage.removeItem("userRole")
  localStorage.removeItem("userName")
  window.location.href = "index.html"
}

// Add logout functionality to user avatar
document.addEventListener("DOMContentLoaded", () => {
  const userAvatar = document.querySelector(".user-avatar")
  if (userAvatar) {
    userAvatar.addEventListener("click", () => {
      if (confirm("Deseja fazer logout?")) {
        logout()
      }
    })
    userAvatar.style.cursor = "pointer"
    userAvatar.title = "Clique para fazer logout"
  }
})

// Form validation helpers
function validateForm(formId) {
  const form = document.getElementById(formId)
  if (!form) return false

  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (field.type === "radio") {
      const radioGroup = form.querySelectorAll(`[name="${field.name}"]`)
      const isGroupChecked = Array.from(radioGroup).some((radio) => radio.checked)
      if (!isGroupChecked) {
        isValid = false
        // Highlight the radio group
        radioGroup.forEach((radio) => {
          radio.parentElement.style.color = "red"
        })
      } else {
        radioGroup.forEach((radio) => {
          radio.parentElement.style.color = ""
        })
      }
    } else {
      if (!field.value.trim()) {
        isValid = false
        field.style.borderColor = "red"
      } else {
        field.style.borderColor = "#ddd"
      }
    }
  })

  return isValid
}

// Auto-save functionality for forms
function setupAutoSave() {
  const textareas = document.querySelectorAll("textarea")
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"]')
  ;[...textareas, ...inputs].forEach((field) => {
    field.addEventListener("input", () => {
      const key = `autosave_${field.name || field.id}`
      localStorage.setItem(key, field.value)
    })

    // Restore saved content
    const key = `autosave_${field.name || field.id}`
    const savedValue = localStorage.getItem(key)
    if (savedValue) {
      field.value = savedValue
    }
  })
}

// Initialize auto-save on form pages
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("form")) {
    setupAutoSave()
  }
})

// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu")
  navMenu.classList.toggle("mobile-open")
}

// Add mobile menu styles
const style = document.createElement("style")
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu.mobile-open {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #4a90e2;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
    }
`
document.head.appendChild(style)
