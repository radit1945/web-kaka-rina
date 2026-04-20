// ===========================
//   RAIN UANG 100 RIBU
// ===========================
const canvas = document.getElementById('rain-canvas');
const ctx = canvas.getContext('2d');

let bills = [];
const BILL_COUNT = window.innerWidth < 600 ? 15 : 28;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Gambar uang 100 ribu (canvas-drawn sederhana & ikonik)
function drawBill(ctx, x, y, w, h, rotation, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rotation);
  ctx.translate(-w / 2, -h / 2);

  // Body uang
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#2e7d32');
  grad.addColorStop(0.5, '#43a047');
  grad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 6);
  ctx.fill();

  // Border dalam
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(3, 3, w - 6, h - 6, 4);
  ctx.stroke();

  // Teks "100.000"
  ctx.fillStyle = 'rgba(255,255,200,0.9)';
  ctx.font = `bold ${Math.round(h * 0.32)}px Montserrat, Poppins, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100.000', w / 2, h / 2);

  // RP di kiri
  ctx.font = `bold ${Math.round(h * 0.2)}px Poppins, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,200,0.7)';
  ctx.textAlign = 'left';
  ctx.fillText('Rp', 7, h / 2);

  // Ornamen kiri kanan
  ctx.fillStyle = 'rgba(255,255,200,0.15)';
  ctx.beginPath();
  ctx.arc(w * 0.15, h / 2, h * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.85, h / 2, h * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function createBill() {
  const scale = 0.5 + Math.random() * 1.2;
  const w = 100 * scale;
  const h = 45 * scale;
  return {
    x: Math.random() * (window.innerWidth + 100) - 50,
    y: -h - Math.random() * window.innerHeight,
    w,
    h,
    speed: 1.2 + Math.random() * 2.5,
    rotation: (Math.random() - 0.5) * 0.5,
    rotSpeed: (Math.random() - 0.5) * 0.03,
    opacity: 0.4 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 0.5,
  };
}

for (let i = 0; i < BILL_COUNT; i++) {
  const b = createBill();
  b.y = Math.random() * window.innerHeight; // scatter awal
  bills.push(b);
}

let animating = true;

function rainLoop() {
  if (!animating) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let b of bills) {
    b.y += b.speed;
    b.x += b.drift;
    b.rotation += b.rotSpeed;

    if (b.y > window.innerHeight + 60) {
      Object.assign(b, createBill());
      b.y = -b.h;
    }

    drawBill(ctx, b.x, b.y, b.w, b.h, b.rotation, b.opacity);
  }

  requestAnimationFrame(rainLoop);
}

rainLoop();

// ===========================
//   PROGRESS BAR ANIMASI
// ===========================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.progress-bar-fill').style.width = '87%';
  }, 600);
});

// ===========================
//   SALDO COUNTER TURUN
// ===========================
let saldoTarget = 0;
let saldoCurrent = 500000;
let saldoInterval = null;

function startSaldoCountdown() {
  saldoInterval = setInterval(() => {
    saldoCurrent -= Math.floor(Math.random() * 15000) + 5000;
    if (saldoCurrent <= 0) {
      saldoCurrent = 0;
      clearInterval(saldoInterval);
      document.querySelector('.wallet-emoji').textContent = '💸';
    }
    updateSaldoDisplay();
  }, 800);
}

function updateSaldoDisplay() {
  const el = document.getElementById('saldo-display');
  if (el) {
    el.textContent = 'Rp ' + saldoCurrent.toLocaleString('id-ID');
  }
}

startSaldoCountdown();

// ===========================
//   TOMBOL "NANTI YA" KABUR
// ===========================
const btnNo = document.getElementById('btn-no');
let noButtonActive = true;
let hasEscaped = false;

// Posisikan tombol tepat di atas placeholder saat load
function snapToBtnGroup() {
  const placeholder = document.getElementById('btn-no-placeholder');
  if (!placeholder) return;
  const rect = placeholder.getBoundingClientRect();
  btnNo.style.transition = 'none';
  btnNo.style.left = rect.left + 'px';
  btnNo.style.top = rect.top + 'px';
  btnNo.style.width = rect.width + 'px';
}

window.addEventListener('load', () => {
  snapToBtnGroup();
  // Re-snap setelah font/layout selesai render
  setTimeout(snapToBtnGroup, 300);
});

window.addEventListener('resize', () => {
  if (!hasEscaped) snapToBtnGroup();
});

function moveNoButton() {
  if (!noButtonActive) return;
  hasEscaped = true;
  btnNo.style.transition = 'left 0.15s ease, top 0.15s ease';

  const margin = 60;
  const bw = btnNo.offsetWidth || 120;
  const bh = btnNo.offsetHeight || 44;
  const maxX = window.innerWidth - bw - margin;
  const maxY = window.innerHeight - bh - margin;

  // Hindari area dekat posisi placeholder supaya tidak "balik" ke sana
  const placeholder = document.getElementById('btn-no-placeholder');
  let x, y, tries = 0;
  do {
    x = Math.max(margin, Math.random() * maxX);
    y = Math.max(margin, Math.random() * maxY);
    tries++;
  } while (placeholder && tries < 20 && Math.abs(x - placeholder.getBoundingClientRect().left) < 150 && Math.abs(y - placeholder.getBoundingClientRect().top) < 100);

  btnNo.style.left = x + 'px';
  btnNo.style.top = y + 'px';
}

btnNo.addEventListener('mouseover', moveNoButton);
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
});

// ===========================
//   TOMBOL "KASIH UANG"
// ===========================
const btnYes = document.getElementById('btn-yes');
const mainCard = document.getElementById('main-card');
const successScreen = document.getElementById('success-screen');

btnYes.addEventListener('click', function(e) {
  // Ripple effect
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  const rect = this.getBoundingClientRect();
  ripple.style.left = (e.clientX - rect.left - 30) + 'px';
  ripple.style.top = (e.clientY - rect.top - 30) + 'px';
  this.style.position = 'relative';
  this.style.overflow = 'hidden';
  this.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);

  // Suara ching
  playChing();

  // Sembunyikan card
  setTimeout(() => {
    mainCard.classList.add('hidden');
    noButtonActive = false;
    btnNo.style.opacity = '0';

    // Ubah background
    document.getElementById('bg').classList.add('happy');

    // Tampilkan success
    setTimeout(() => {
      successScreen.classList.add('show');
      launchConfetti();
      showFakeNotif();
    }, 600);
  }, 200);
});

// ===========================
//   SUARA "CHING"
// ===========================
function playChing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch(e) {}
}

// ===========================
//   CONFETTI
// ===========================
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#00ff88', '#ffd700', '#ff4757', '#00b4d8', '#a29bfe', '#fd79a8'];
  
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (6 + Math.random() * 12) + 'px';
      piece.style.height = (6 + Math.random() * 12) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      const dur = 2 + Math.random() * 3;
      piece.style.animationDuration = dur + 's';
      piece.style.animationDelay = '0s';
      container.appendChild(piece);
      setTimeout(() => piece.remove(), dur * 1000 + 100);
    }, i * 25);
  }
}

// ===========================
//   FAKE NOTIFIKASI TRANSFER
// ===========================
function showFakeNotif() {
  setTimeout(() => {
    const notif = document.getElementById('fake-notif');
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 4500);
  }, 1200);
}

// ===========================
//   TOMBOL TRANSFER LAGI
// ===========================
document.getElementById('btn-transfer').addEventListener('click', () => {
  playChing();
  launchConfetti();
  showFakeNotif();
  
  // Update teks
  const sub = document.querySelector('.success-subtitle');
  const msgs = [
    'Wah dua kali transfer! Kaka Rina baik banget, semoga <em>rezekinya</em> datang berlipat ganda! 🌟',
    'Tiga kali?! Ini bukan teman biasa, ini <em>malaikat berselubung manusia</em>. Terima kasih banyak! 💫',
    'Okay sekarang serius... <em>rekening Kaka Rina</em> masih baik-baik saja kan? Hahaha, makasih ya! 🙏',
  ];
  const idx = Math.min(window.transferCount || 0, msgs.length - 1);
  sub.innerHTML = msgs[idx];
  window.transferCount = (window.transferCount || 0) + 1;
});

// ===========================
//   TOMBOL KEMBALI SEDIH
// ===========================
document.getElementById('btn-sad').addEventListener('click', () => {
  successScreen.classList.remove('show');
  document.getElementById('bg').classList.remove('happy');
  
  setTimeout(() => {
    mainCard.classList.remove('hidden');
    noButtonActive = true;
    hasEscaped = false;
    btnNo.style.opacity = '1';
    btnNo.style.transition = 'none';
    snapToBtnGroup();
    saldoCurrent = 500000;
    updateSaldoDisplay();
    clearInterval(saldoInterval);
    startSaldoCountdown();
    document.querySelector('.wallet-emoji').textContent = '👛';
    document.querySelector('.progress-bar-fill').style.width = '87%';
  }, 400);
});
