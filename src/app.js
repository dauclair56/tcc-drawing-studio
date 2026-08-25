const catName = document.getElementById("catName");
const winnerName = document.getElementById("winnerName");
const prizeName = document.getElementById("prizeName");
const chestImage = document.getElementById("chestImage");
const catDisplay = document.getElementById("catDisplay");
const winnerDisplay = document.getElementById("winnerDisplay");
const prizeDisplay = document.getElementById("prizeDisplay");
const previewButton = document.getElementById("previewButton");
const reveal = document.getElementById("reveal");

function updateDrawing() {
  catDisplay.textContent = catName.value || "Today's Cat";
  winnerDisplay.textContent = winnerName.value || "Winner";
  prizeDisplay.textContent = prizeName.value || "Prize";

  reveal.classList.remove("show");
  chestImage.src = "assets/Moroccan-chest-closed2.png";

  setTimeout(() => {
  chestImage.src = "assets/Moroccan-chest-open2.PNG";
}, 2500);

  setTimeout(() => {
    reveal.classList.add("show");

    reveal.animate(
      [
        { opacity: 0, transform: "scale(.85) translateY(20px)" },
        { opacity: 1, transform: "scale(1.04) translateY(0)" },
        { opacity: 1, transform: "scale(1) translateY(0)" }
      ],
      {
        duration: 900,
        easing: "ease-out"
      }
    );
  }, 4500);
}

previewButton.addEventListener("click", updateDrawing);