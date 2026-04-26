/* global QRCode */

const els = {
  input: document.getElementById("textInput"),
  generateBtn: document.getElementById("generateBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  qrContainer: document.getElementById("qrContainer"),
  errorText: document.getElementById("errorText"),
};

function setError(message) {
  els.errorText.textContent = message || "";
}

function normalizeInput(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";

  // Keep this minimal: if it looks like a bare domain, add https://
  if (/^[a-z0-9.-]+\.[a-z]{2,}([/?#].*)?$/i.test(trimmed) && !/^[a-z]+:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

function clearQr() {
  els.qrContainer.innerHTML = "";
  els.downloadBtn.disabled = true;
}

function getCanvas() {
  const canvas = els.qrContainer.querySelector("canvas");
  return canvas || null;
}

async function generateQr() {
  setError("");

  if (typeof QRCode === "undefined") {
    setError("QR library failed to load. Refresh and try again.");
    return;
  }

  const value = normalizeInput(els.input.value);
  if (!value) {
    clearQr();
    setError("Please enter a link.");
    return;
  }

  clearQr();

  try {
    // `qrcodejs` draws into the container (canvas or img depending on support).
    // Keep size fixed for simplicity.
    const qr = new QRCode(els.qrContainer, {
      text: value,
      width: 256,
      height: 256,
      colorDark: "#111111",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
    // `qr` is intentionally unused; instance attaches to container.
    void qr;
    els.downloadBtn.disabled = false;
  } catch (err) {
    clearQr();
    setError("Could not generate QR for that input.");
  }
}

function downloadPng() {
  const canvas = getCanvas();
  const img = els.qrContainer.querySelector("img");
  const url = canvas?.toDataURL?.("image/png") || img?.src;
  if (!url) return;

  const a = document.createElement("a");
  a.href = url;
  a.download = "qr.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

els.generateBtn.addEventListener("click", () => void generateQr());
els.downloadBtn.addEventListener("click", downloadPng);
els.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    void generateQr();
  }
});

// Nice default for first load if user previously used it.
const storageKey = "qrmaker:lastValue";
els.input.value = localStorage.getItem(storageKey) || "";
els.input.addEventListener("input", () => {
  localStorage.setItem(storageKey, els.input.value);
});

