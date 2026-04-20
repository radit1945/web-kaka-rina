const text = "Kaka Rina yang cantik, adakah pencerahan di akhir bulan yang suram ini dikarenakan tidak tahu kenapa uang saya habis?";

const typingText = document.getElementById("typing-text");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const resultText = document.getElementById("resultText");

let index = 0;

function typeEffect() {
  if (index < text.length) {
    typingText.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeEffect, 40);
  }
}

typeEffect();

noBtn.addEventListener("mouseover", () => {
  const x = Math.floor(Math.random() * 200) - 100;
  const y = Math.floor(Math.random() * 200) - 100;

  noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

yesBtn.addEventListener("click", () => {
  resultText.innerHTML = "Terima kasih Kaka Rina, semoga rezekinya makin lancar dan dompetnya selalu penuh!";

  document.body.style.background = "linear-gradient(to bottom, #fff8cc, #ffe066)";
});