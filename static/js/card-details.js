// ==============================
// Accordion
// ==============================

document.querySelectorAll(".accordion-header").forEach(header => {

    header.addEventListener("click", () => {

        header.parentElement.classList.toggle("active");

    });

});


// ==============================
// Orientation Toggle
// ==============================

const uprightBtn = document.getElementById("uprightBtn");
const reversedBtn = document.getElementById("reversedBtn");

const meaningText = document.getElementById("meaningText");
const loveText = document.getElementById("loveText");
const careerText = document.getElementById("careerText");
const financeText = document.getElementById("financeText");
const healthText = document.getElementById("healthText");
const spiritualText = document.getElementById("spiritualText");
const adviceText = document.getElementById("adviceText");
const keywordList = document.getElementById("keywordList");
const yesNoText = document.getElementById("yesNoText");
const timingText = document.getElementById("timingText");

function renderKeywords(list){

    keywordList.innerHTML = "";

    list.forEach(keyword=>{

        keywordList.innerHTML += `<span>${keyword}</span>`;

    });

}

function showUpright() {

    uprightBtn.classList.add("active");
    reversedBtn.classList.remove("active");

    meaningText.innerHTML = upright.meaning;
    loveText.innerHTML = upright.love;
    careerText.innerHTML = upright.career;
    financeText.innerHTML = upright.finance;
    healthText.innerHTML = upright.health;
    spiritualText.innerHTML = upright.spiritual;
    adviceText.innerHTML = upright.advice;
    yesNoText.innerHTML = upright.yesNo;
    timingText.innerHTML = upright.timing;

    renderKeywords(upright.keywords);

    document.getElementById("cardImage").classList.remove("reversed-card");
}

function showReversed() {

    reversedBtn.classList.add("active");
    uprightBtn.classList.remove("active");

    meaningText.innerHTML = reversed.meaning;
    loveText.innerHTML = reversed.love;
    careerText.innerHTML = reversed.career;
    financeText.innerHTML = reversed.finance;
    healthText.innerHTML = reversed.health;
    spiritualText.innerHTML = reversed.spiritual;
    adviceText.innerHTML = reversed.advice;
    yesNoText.innerHTML = reversed.yesNo;
    timingText.innerHTML = reversed.timing;

    renderKeywords(reversed.keywords);

    document.getElementById("cardImage").classList.add("reversed-card");
}

uprightBtn.addEventListener("click", showUpright);
reversedBtn.addEventListener("click", showReversed);