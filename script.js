// Configuration - Google Apps Script Web App URL을 여기에 입력하세요
const CONFIG = {
  // Google Apps Script Web App URL (배포 후 받은 URL을 여기에 입력)
  webAppUrl:
    "https://script.google.com/macros/s/AKfycbxftLo2XKpci9zqXPV5WAuVKiWYL9WdVNp95DjJ6s8qPukIUplDuP75rMkvQq4F1hLe/exec",
};

// DOM Elements
const poemContent = document.getElementById("poem-content");
const nameInput = document.getElementById("name");
const contentInput = document.getElementById("content");
const submitBtn = document.getElementById("submit-btn");
const currentLocationEl = document.getElementById("current-location");

// State
let poems = [];
let currentLocationCache = null;

// Load poems on page load
async function loadPoems() {
  try {
    const response = await fetch(`${CONFIG.webAppUrl}?action=getPoems`);
    const data = await response.json();

    if (data.success) {
      poems = data.poems;
      displayPoems();
    } else {
      poemContent.innerHTML =
        '<div class="error-message">시를 불러오는데 실패했습니다.</div>';
    }
  } catch (error) {
    console.error("Error loading poems:", error);
    poemContent.innerHTML =
      '<div class="error-message">Google Apps Script 연결 오류가 발생했습니다. CONFIG.webAppUrl을 확인해주세요.</div>';
  }
}

// Display all poems
function displayPoems() {
  if (poems.length === 0) {
    poemContent.innerHTML =
      '<p style="color: #6c757d;">아직 작성된 시가 없습니다. 첫 번째 시를 작성해보세요!</p>';
    return;
  }

  let html = "";
  poems.forEach((poem) => {
    html += `
            <div class="poem-entry">
                <div class="poem-text">${escapeHtml(poem.content)}</div>
            </div>
        `;
  });

  poemContent.innerHTML = html;

  // Scroll to bottom to show latest entries
  poemContent.scrollTop = poemContent.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Get location information
async function getLocation() {
  // Use cached location if available
  if (currentLocationCache) {
    return currentLocationCache;
  }

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      resolve({ lat: "", long: "", location: "" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        // Get location name using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&accept-language=ko`,
          );
          const data = await response.json();

          // Extract location from address
          const address = data.address || {};
          const location =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state ||
            "알 수 없음";

          const locationInfo = {
            lat: lat.toFixed(6),
            long: long.toFixed(6),
            location: location,
          };

          // Cache the location
          currentLocationCache = locationInfo;

          resolve(locationInfo);
        } catch (error) {
          console.error("Error getting location name:", error);
          const locationInfo = {
            lat: lat.toFixed(6),
            long: long.toFixed(6),
            location: "알 수 없음",
          };
          currentLocationCache = locationInfo;
          resolve(locationInfo);
        }
      },
      (error) => {
        console.error("Error getting position:", error);
        resolve({ lat: "", long: "", location: "" });
      },
    );
  });
}

// Display current location in header
async function displayCurrentLocation() {
  currentLocationEl.textContent = "위치 확인 중...";

  const locationInfo = await getLocation();

  if (locationInfo.location) {
    currentLocationEl.textContent = locationInfo.location;
  } else {
    currentLocationEl.textContent = "위치를 확인할 수 없습니다";
  }
}

// Submit new poem
async function submitPoem() {
  const name = nameInput.value.trim();
  const content = contentInput.value.trim();

  // Validation
  if (!name) {
    showMessage("이름을 입력해주세요.", "error");
    return;
  }

  if (!content) {
    showMessage("내용을 입력해주세요.", "error");
    return;
  }

  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.textContent = "위치 확인 중...";

  try {
    // Get location information
    const locationInfo = await getLocation();

    submitBtn.textContent = "제출 중...";

    const response = await fetch(CONFIG.webAppUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        action: "addPoem",
        name: name,
        content: content,
        lat: locationInfo.lat,
        long: locationInfo.long,
        location: locationInfo.location,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showMessage("제출완료!", "success");

      // Clear inputs
      nameInput.value = "";
      contentInput.value = "";

      // Reload poems
      await loadPoems();
    } else {
      showMessage(data.error || "제출에 실패했습니다.", "error");
    }
  } catch (error) {
    console.error("Error submitting poem:", error);
    showMessage("Google Apps Script 연결 오류가 발생했습니다.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "제출";
  }
}

// Show message
function showMessage(message, type) {
  const existingMessage = document.querySelector(
    ".error-message, .success-message",
  );
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = type === "error" ? "error-message" : "success-message";
  messageDiv.textContent = message;

  submitBtn.parentElement.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Event listeners
submitBtn.addEventListener("click", submitPoem);

// Allow Enter key in name input to focus content
nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    contentInput.focus();
  }
});

// Allow Ctrl/Cmd + Enter to submit
contentInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    submitPoem();
  }
});

// Initialize
displayCurrentLocation();
loadPoems();

// Auto-refresh every 30 seconds
setInterval(loadPoems, 30000);
