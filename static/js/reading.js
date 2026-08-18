const cardImage = document.getElementById("readingCard");

const savedCard = localStorage.getItem("selectedCard");

console.log(savedCard);

if (savedCard) {
    cardImage.src = savedCard;
} else {
    window.location.href = "/yes-no";
}

