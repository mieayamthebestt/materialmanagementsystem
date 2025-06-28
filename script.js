// Global variables
let materials = JSON.parse(localStorage.getItem("materials")) || []
let usageHistory = JSON.parse(localStorage.getItem("usageHistory")) || []

// Material database with predefined options
const materialDatabase = {
  semen: { name: "Semen", unit: "sak", category: "Material Dasar" },
  pasir: { name: "Pasir", unit: "m3", category: "Material Dasar" },
  kerikil: { name: "Kerikil/Batu Split", unit: "m3", category: "Material Dasar" },
  "batu-bata": { name: "Batu Bata", unit: "pcs", category: "Material Dasar" },
  batako: { name: "Batako", unit: "pcs", category: "Material Dasar" },
  hebel: { name: "Bata Hebel", unit: "pcs", category: "Material Dasar" },
  "besi-beton": { name: "Besi Beton", unit: "batang", category: "Besi & Logam" },
  "besi-siku": { name: "Besi Siku", unit: "batang", category: "Besi & Logam" },
  "kawat-bendrat": { name: "Kawat Bendrat", unit: "kg", category: "Besi & Logam" },
  paku: { name: "Paku", unit: "kg", category: "Besi & Logam" },
  seng: { name: "Seng", unit: "lembar", category: "Besi & Logam" },
  "kayu-balok": { name: "Kayu Balok", unit: "batang", category: "Kayu & Bambu" },
  "kayu-papan": { name: "Kayu Papan", unit: "lembar", category: "Kayu & Bambu" },
  triplek: { name: "Triplek", unit: "lembar", category: "Kayu & Bambu" },
  bambu: { name: "Bambu", unit: "batang", category: "Kayu & Bambu" },
  cat: { name: "Cat", unit: "kaleng", category: "Finishing" },
  keramik: { name: "Keramik", unit: "m2", category: "Finishing" },
  genteng: { name: "Genteng", unit: "pcs", category: "Finishing" },
  kaca: { name: "Kaca", unit: "m2", category: "Finishing" },
  pintu: { name: "Pintu", unit: "pcs", category: "Finishing" },
  jendela: { name: "Jendela", unit: "pcs", category: "Finishing" },
  "pipa-pvc": { name: "Pipa PVC", unit: "batang", category: "Instalasi" },
  "kabel-listrik": { name: "Kabel Listrik", unit: "meter", category: "Instalasi" },
  "fitting-lampu": { name: "Fitting Lampu", unit: "pcs", category: "Instalasi" },
  "stop-kontak": { name: "Stop Kontak", unit: "pcs", category: "Instalasi" },
  saklar: { name: "Saklar", unit: "pcs", category: "Instalasi" },
}

// Initialize material type selector
function initializeMaterialSelector() {
  const materialTypeSelect = document.getElementById("materialType")
  const materialUnitSelect = document.getElementById("materialUnit")
  const customMaterialGroup = document.getElementById("customMaterialGroup")
  const customMaterialName = document.getElementById("customMaterialName")

  if (!materialTypeSelect || !materialUnitSelect) return

  // Remove any existing event listeners
  materialTypeSelect.removeEventListener("change", handleMaterialTypeChange)
  materialTypeSelect.addEventListener("change", handleMaterialTypeChange)
}

// Separate function for handling material type changes
function handleMaterialTypeChange(event) {
  const selectedValue = event.target.value
  const materialUnitSelect = document.getElementById("materialUnit")
  const customMaterialGroup = document.getElementById("customMaterialGroup")
  const customMaterialName = document.getElementById("customMaterialName")

  if (selectedValue === "custom") {
    // Show custom material input
    customMaterialGroup.style.display = "block"
    customMaterialName.required = true

    // Enable unit selector with all options
    materialUnitSelect.disabled = false
    materialUnitSelect.innerHTML = `
      <option value="">Pilih Satuan</option>
      <option value="kg">Kilogram (kg)</option>
      <option value="ton">Ton</option>
      <option value="m3">Meter Kubik (m³)</option>
      <option value="m2">Meter Persegi (m²)</option>
      <option value="meter">Meter</option>
      <option value="pcs">Pieces (pcs)</option>
      <option value="sak">Sak</option>
      <option value="batang">Batang</option>
      <option value="lembar">Lembar</option>
      <option value="kaleng">Kaleng</option>
      <option value="roll">Roll</option>
      <option value="set">Set</option>
    `
  } else if (selectedValue && materialDatabase[selectedValue]) {
    // Hide custom material input
    customMaterialGroup.style.display = "none"
    customMaterialName.required = false
    customMaterialName.value = ""

    // Auto-fill unit based on selected material
    const material = materialDatabase[selectedValue]
    materialUnitSelect.disabled = false
    materialUnitSelect.innerHTML = `<option value="${material.unit}" selected>${getUnitDisplayName(material.unit)}</option>`
  } else {
    // Reset form
    customMaterialGroup.style.display = "none"
    customMaterialName.required = false
    customMaterialName.value = ""
    materialUnitSelect.disabled = true
    materialUnitSelect.innerHTML = '<option value="">Pilih material terlebih dahulu</option>'
  }
}

// Get display name for unit
function getUnitDisplayName(unit) {
  const unitNames = {
    kg: "Kilogram (kg)",
    ton: "Ton",
    m3: "Meter Kubik (m³)",
    m2: "Meter Persegi (m²)",
    meter: "Meter",
    pcs: "Pieces (pcs)",
    sak: "Sak",
    batang: "Batang",
    lembar: "Lembar",
    kaleng: "Kaleng",
    roll: "Roll",
    set: "Set",
  }
  return unitNames[unit] || unit
}

// Login function
function login(role) {
  localStorage.setItem("userRole", role)
  if (role === "admin") {
    window.location.href = "admin.html"
  } else {
    window.location.href = "user.html"
  }
}

// Logout function
function logout() {
  localStorage.removeItem("userRole")
  window.location.href = "index.html"
}

// Show alert function
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type}`
  alertDiv.textContent = message

  const container = document.querySelector(".main-content")
  if (container) {
    container.insertBefore(alertDiv, container.firstChild)

    setTimeout(() => {
      alertDiv.remove()
    }, 5000)
  }
}

// Admin Functions - Perbaikan fungsi addMaterial
function addMaterial(event) {
  console.log("addMaterial function called")
  event.preventDefault()

  const materialTypeElement = document.getElementById("materialType")
  const customNameElement = document.getElementById("customMaterialName")
  const unitElement = document.getElementById("materialUnit")
  const quantityElement = document.getElementById("materialQuantity")

  if (!materialTypeElement || !unitElement || !quantityElement) {
    console.error("Required form elements not found")
    showAlert("Error: Form elements tidak ditemukan!", "error")
    return
  }

  const materialType = materialTypeElement.value
  const customName = customNameElement ? customNameElement.value.trim() : ""
  const unit = unitElement.value
  const quantity = Number.parseFloat(quantityElement.value)

  console.log("Form values:", { materialType, customName, unit, quantity })

  let materialName = ""

  if (materialType === "custom") {
    if (!customName) {
      showAlert("Nama material custom harus diisi!", "error")
      return
    }
    materialName = customName
  } else if (materialType && materialDatabase[materialType]) {
    materialName = materialDatabase[materialType].name
  } else {
    showAlert("Pilih jenis material terlebih dahulu!", "error")
    return
  }

  if (!unit || !quantity || quantity <= 0) {
    showAlert("Semua field harus diisi dengan benar!", "error")
    return
  }

  // Check if material already exists
  const existingMaterial = materials.find((m) => m.name.toLowerCase() === materialName.toLowerCase())
  if (existingMaterial) {
    showAlert("Material dengan nama tersebut sudah ada!", "error")
    return
  }

  // Ensure all numeric values are properly set
  const material = {
    id: Date.now(),
    name: materialName,
    unit: unit,
    initialQuantity: Number(quantity),
    usedQuantity: 0,
    remainingQuantity: Number(quantity),
    category: materialType === "custom" ? "Custom" : materialDatabase[materialType].category,
    createdAt: new Date().toISOString(),
  }

  materials.push(material)
  localStorage.setItem("materials", JSON.stringify(materials))

  showAlert(`Material "${materialName}" berhasil ditambahkan!`, "success")

  // Reset form
  document.getElementById("materialForm").reset()
  document.getElementById("materialUnit").disabled = true
  document.getElementById("materialUnit").innerHTML = '<option value="">Pilih material terlebih dahulu</option>'
  if (document.getElementById("customMaterialGroup")) {
    document.getElementById("customMaterialGroup").style.display = "none"
  }
  if (document.getElementById("customMaterialName")) {
    document.getElementById("customMaterialName").required = false
  }

  loadMaterials()
  updateStats() // Update stats after adding material
  console.log("Material added successfully:", material)
}

function loadMaterials() {
  const materialList = document.getElementById("materialList")
  if (!materialList) return

  if (materials.length === 0) {
    materialList.innerHTML = `
      <div class="empty-state">
        <h3>Belum ada material</h3>
        <p>Tambahkan material pertama untuk memulai</p>
      </div>
    `
    return
  }

  materialList.innerHTML = materials
    .map(
      (material) => `
        <div class="material-item" data-category="${material.category || "Custom"}">
          <div class="material-info">
            <h3>${material.name}</h3>
            <p><strong>Kategori:</strong> ${material.category || "Custom"}</p>
            <p><strong>Kebutuhan Awal:</strong> ${material.initialQuantity} ${material.unit}</p>
            <p><strong>Terpakai:</strong> ${material.usedQuantity} ${material.unit}</p>
            <p><strong>Tersisa:</strong> ${material.remainingQuantity} ${material.unit}</p>
          </div>
          <div class="material-actions">
            <button class="delete-btn" onclick="deleteMaterial(${material.id})">
              Hapus
            </button>
          </div>
        </div>
      `,
    )
    .join("")
}

function deleteMaterial(id) {
  if (confirm("Apakah Anda yakin ingin menghapus material ini?")) {
    materials = materials.filter((m) => m.id !== id)
    localStorage.setItem("materials", JSON.stringify(materials))

    // Also remove related usage history
    usageHistory = usageHistory.filter((u) => u.materialId !== id)
    localStorage.setItem("usageHistory", JSON.stringify(usageHistory))

    showAlert("Material berhasil dihapus!", "success")
    loadMaterials()
    updateStats() // Update stats after deleting material
  }
}

// User Functions
function loadMaterialsForUser() {
  const materialSelect = document.getElementById("selectedMaterial")
  if (!materialSelect) return

  materialSelect.innerHTML = '<option value="">Pilih Material</option>'

  materials.forEach((material) => {
    if (material.remainingQuantity > 0) {
      const option = document.createElement("option")
      option.value = material.id
      option.textContent = `${material.name} (Tersisa: ${material.remainingQuantity} ${material.unit})`
      materialSelect.appendChild(option)
    }
  })

  materialSelect.addEventListener("change", function () {
    const selectedId = Number.parseInt(this.value)
    const material = materials.find((m) => m.id === selectedId)
    const stockInfo = document.getElementById("availableStock")
    const quantityInput = document.getElementById("usageQuantity")

    if (material && stockInfo && quantityInput) {
      stockInfo.textContent = `Stok tersedia: ${material.remainingQuantity} ${material.unit}`
      quantityInput.max = material.remainingQuantity
    }
  })
}

function addUsage(event) {
  event.preventDefault()

  const materialId = Number.parseInt(document.getElementById("selectedMaterial").value)
  const quantity = Number.parseFloat(document.getElementById("usageQuantity").value)
  const week = Number.parseInt(document.getElementById("usageWeek").value)
  const notes = document.getElementById("usageNotes").value.trim()

  if (!materialId || !quantity || !week) {
    showAlert("Semua field wajib harus diisi!", "error")
    return
  }

  const material = materials.find((m) => m.id === materialId)
  if (!material) {
    showAlert("Material tidak ditemukan!", "error")
    return
  }

  if (quantity > material.remainingQuantity) {
    showAlert(`Jumlah melebihi stok tersedia! Maksimal: ${material.remainingQuantity} ${material.unit}`, "error")
    return
  }

  // Update material quantities with proper number conversion
  material.usedQuantity = Number(material.usedQuantity) + Number(quantity)
  material.remainingQuantity = Number(material.remainingQuantity) - Number(quantity)

  // Add to usage history
  const usage = {
    id: Date.now(),
    materialId: materialId,
    materialName: material.name,
    materialUnit: material.unit,
    quantity: Number(quantity),
    week: Number(week),
    notes: notes,
    date: new Date().toISOString(),
  }

  usageHistory.push(usage)

  // Save to localStorage
  localStorage.setItem("materials", JSON.stringify(materials))
  localStorage.setItem("usageHistory", JSON.stringify(usageHistory))

  showAlert(`Penggunaan material "${material.name}" berhasil dicatat!`, "success")
  document.getElementById("weeklyUsageForm").reset()

  // Refresh data
  loadMaterialsForUser()
  loadUsageHistory()
  updateStats()
}

function loadUsageHistory() {
  const tbody = document.getElementById("usageHistoryBody")
  if (!tbody) return

  if (usageHistory.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <div>
            <h3>Belum ada riwayat penggunaan</h3>
            <p>Mulai catat penggunaan material mingguan</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  // Sort by date (newest first)
  const sortedHistory = usageHistory.sort((a, b) => new Date(b.date) - new Date(a.date))

  tbody.innerHTML = sortedHistory
    .map(
      (usage) => `
        <tr>
          <td>${new Date(usage.date).toLocaleDateString("id-ID")}</td>
          <td>${usage.materialName}</td>
          <td>${usage.quantity} ${usage.materialUnit}</td>
          <td>Minggu ${usage.week}</td>
          <td>${usage.notes || "-"}</td>
        </tr>
      `,
    )
    .join("")
}

// Fixed updateStats function
function updateStats() {
  console.log("Updating stats...", materials)

  const totalMaterialsEl = document.getElementById("totalMaterials")
  const usedMaterialsEl = document.getElementById("usedMaterials")
  const remainingMaterialsEl = document.getElementById("remainingMaterials")

  if (!totalMaterialsEl || !usedMaterialsEl || !remainingMaterialsEl) {
    console.log("Stats elements not found")
    return
  }

  // Ensure we have valid materials array
  if (!Array.isArray(materials)) {
    console.log("Materials is not an array")
    materials = []
  }

  // Calculate totals with proper number conversion and validation
  let totalInitial = 0
  let totalUsed = 0
  let totalRemaining = 0

  materials.forEach((material) => {
    const initial = Number(material.initialQuantity) || 0
    const used = Number(material.usedQuantity) || 0
    const remaining = Number(material.remainingQuantity) || 0

    totalInitial += initial
    totalUsed += used
    totalRemaining += remaining
  })

  console.log("Calculated totals:", { totalInitial, totalUsed, totalRemaining })

  // Update display with fallback to 0 if NaN
  totalMaterialsEl.textContent = isNaN(totalInitial) ? "0" : totalInitial.toFixed(1)
  usedMaterialsEl.textContent = isNaN(totalUsed) ? "0" : totalUsed.toFixed(1)
  remainingMaterialsEl.textContent = isNaN(totalRemaining) ? "0" : totalRemaining.toFixed(1)
}

// Event Listeners - Perbaikan utama di sini
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...")

  // Initialize material selector for admin page
  initializeMaterialSelector()

  // Admin page event listeners
  const materialForm = document.getElementById("materialForm")
  if (materialForm) {
    console.log("Material form found, adding event listener")
    materialForm.addEventListener("submit", (event) => {
      console.log("Form submitted!")
      addMaterial(event)
    })
  } else {
    console.log("Material form not found")
  }

  // User page event listeners
  const weeklyUsageForm = document.getElementById("weeklyUsageForm")
  if (weeklyUsageForm) {
    weeklyUsageForm.addEventListener("submit", addUsage)
  }

  // Load initial data and update stats
  loadMaterials()
  loadMaterialsForUser()
  loadUsageHistory()
  updateStats()
})

// Clear localStorage for testing (uncomment if needed)
// localStorage.clear()

// Initialize with sample data if empty
if (materials.length === 0) {
  const sampleMaterials = [
    {
      id: 1,
      name: "Semen",
      unit: "sak",
      initialQuantity: 100,
      usedQuantity: 0,
      remainingQuantity: 100,
      category: "Material Dasar",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Pasir",
      unit: "m3",
      initialQuantity: 50,
      usedQuantity: 0,
      remainingQuantity: 50,
      category: "Material Dasar",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Batu Bata",
      unit: "pcs",
      initialQuantity: 5000,
      usedQuantity: 0,
      remainingQuantity: 5000,
      category: "Material Dasar",
      createdAt: new Date().toISOString(),
    },
  ]

  // Add sample data
  materials = sampleMaterials
  localStorage.setItem("materials", JSON.stringify(materials))
}
