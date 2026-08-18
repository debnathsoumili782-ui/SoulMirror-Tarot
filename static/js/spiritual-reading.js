//======================================================
// SOULMIRROR TAROT
// YES / NO READING ENGINE
// PART 1
//======================================================

"use strict";

//======================================================
// DOM
//======================================================

const ui = {

    form: document.getElementById("questionForm"),
    question: document.getElementById("question"),
    error: document.getElementById("questionError"),

    questionSection: document.getElementById("questionSection"),
    focus: document.getElementById("focusScreen"),
    shuffle: document.getElementById("shuffleSection"),
    fan: document.getElementById("fanSection"),

    deck: document.getElementById("deck"),
    shuffleBtn: document.getElementById("shuffleBtn"),
    readyBtn: document.getElementById("readyBtn"),

    fanCards: document.getElementById("fanCards"),
    selectedSlotWrapper: document.getElementById("selectedSlotWrapper"),
    selectedSlot: document.querySelector(".selected-slot"),
    selectedCard: document.getElementById("selectedCard"),

    loader: document.getElementById("readingLoader"),
    loaderText: document.getElementById("loaderText"),

    flashOverlay: document.getElementById("flashOverlay"),
    fanOverlay: document.getElementById("fanOverlay")

};

//======================================================
// DATA
//======================================================

const CARD_BACK = "/static/images/cards/back/card-back.png";

const TAROT_CARDS = JSON.parse(
    document.getElementById("tarot-data").textContent
);

//======================================================
// CONFIG
//======================================================

const CONFIG = {

    STACK_SIZE: 25,

    SHUFFLE_TIME: 450,
    FOCUS_TIME: 2500,
    MOVE_TIME: 850,

    GLOW_STEPS: 6,
    GLOW_INTERVAL: 80,

    HOVER_LIFT: 28,

    SELECT_TIME: 950,
    FLIP_TIME: 650,
    LOADER_TIME: 2600,

    FAN_ROTATE: 42,
    FAN_DISTANCE: 355,
    FAN_HEIGHT: 118

};

const LOADER_MESSAGES = [
    "✨ The card has been chosen...",
    "🌙 Reading your spiritual energy...",
    "🔮 Preparing your guidance..."
];

//======================================================
// STATE
//======================================================

const state = {

    question: "",
    animating: false,
    shuffles: 0,

    selectedCard: null,
    selectedOrientation: "upright",

    hoverEnabled: false,
    loaderTimer: null

};

//======================================================
// INIT
//======================================================

document.addEventListener("DOMContentLoaded", init);

function init(){

    hideInitialSections();
    resetLoader();
    buildDeck();
    bindQuestionEvents();

}

//======================================================
// INITIAL UI STATE
//======================================================

function hideInitialSections(){

    if(ui.focus) ui.focus.style.display = "none";
    if(ui.shuffle) ui.shuffle.style.display = "none";
    if(ui.fan) ui.fan.style.display = "none";
    if(ui.loader) ui.loader.classList.remove("show");

    if(ui.shuffleBtn) ui.shuffleBtn.style.display = "none";
    if(ui.readyBtn) ui.readyBtn.style.display = "none";

    if(ui.selectedSlot){
        ui.selectedSlot.classList.remove("active");
    }

    if(ui.selectedCard){
        ui.selectedCard.src = "";
        ui.selectedCard.classList.remove("show");
        ui.selectedCard.style.transform = "";
        ui.selectedCard.style.opacity = "";
    }

}

//======================================================
// BUILD DECK
//======================================================

function buildDeck(){

    if(!ui.deck) return;

    ui.deck.innerHTML = "";

    for(let i = 0; i < CONFIG.STACK_SIZE; i++){

        const card = document.createElement("img");

        card.src = CARD_BACK;
        card.draggable = false;
        card.className = "deck-card";
        card.style.zIndex = String(i);
        card.style.transform =
            `translateY(${-i}px) rotate(${(i - 13) * 0.18}deg)`;

        ui.deck.appendChild(card);

    }

}

//======================================================
// HELPERS
//======================================================

function showError(message){

    if(!ui.error) return;

    ui.error.style.display = "block";
    ui.error.textContent = message;

}

function hideError(){

    if(!ui.error) return;

    ui.error.style.display = "none";
    ui.error.textContent = "";

}

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

function randomOrientation(){

    return Math.random() < 0.5 ? "upright" : "reversed";

}

function randomCard(){

    return TAROT_CARDS[
        Math.floor(Math.random() * TAROT_CARDS.length)
    ];

}

function slugify(text){

    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}

function resolveImagePath(image){

    if(!image) return CARD_BACK;

    if(image.startsWith("/static/")){
        return image;
    }

    return "/static/images/" + image.replace(/^\/+/, "");

}

function appendHidden(form, name, value){

    const input = document.createElement("input");

    input.type = "hidden";
    input.name = name;
    input.value = value == null ? "" : String(value);

    form.appendChild(input);

}

function applyTransform(
    card,
    {
        x = Number(card?.dataset?.x) || 0,
        y = Number(card?.dataset?.y) || 0,
        rotate = Number(card?.dataset?.rotate) || 0,
        scale = Number(card?.dataset?.scale) || 1,
        rotateY = 0
    } = {}
){

    if(!card) return;

    card.style.transform =
        `translate(${x}px,${-y}px)
         rotate(${rotate}deg)
         rotateY(${rotateY}deg)
         scale(${scale})`;

}

function flash(){

    if(!ui.flashOverlay) return;

    ui.flashOverlay.classList.add("active");

    setTimeout(() => {
        ui.flashOverlay.classList.remove("active");
    }, 220);

}

function resetLoader(){

    if(state.loaderTimer){
        clearInterval(state.loaderTimer);
        state.loaderTimer = null;
    }

    if(ui.loaderText){
        ui.loaderText.textContent = LOADER_MESSAGES[0];
    }

}

function showLoader(){

    if(!ui.loader || !ui.loaderText) return;

    resetLoader();
    ui.loader.classList.add("show");

    let index = 0;
    ui.loaderText.textContent = LOADER_MESSAGES[0];

    state.loaderTimer = setInterval(() => {

        index += 1;

        if(index >= LOADER_MESSAGES.length){
            clearInterval(state.loaderTimer);
            state.loaderTimer = null;
            return;
        }

        ui.loaderText.textContent = LOADER_MESSAGES[index];

    }, 900);

}

function hideLoader(){

    if(!ui.loader) return;

    ui.loader.classList.remove("show");

    if(state.loaderTimer){
        clearInterval(state.loaderTimer);
        state.loaderTimer = null;
    }

}

//======================================================
// QUESTION FLOW
//======================================================

function bindQuestionEvents(){

    if(!ui.form) return;

    ui.question.addEventListener("input", hideError);

    ui.form.addEventListener("submit", handleQuestionSubmit);

}

function handleQuestionSubmit(event){

    event.preventDefault();
    hideError();

    const question = ui.question.value.trim();

    if(!validateQuestion(question)){
        return;
    }

    state.question = question;
    localStorage.setItem("question", question);

    showFocusScreen();

}

function validateQuestion(question){

    if(question === ""){
        showError("Please enter a proper question.");
        return false;
    }

    if(question.length < 8){
        showError("Please enter a proper question.");
        return false;
    }

    if(!question.endsWith("?")){
        showError("Please enter a proper question.");
        return false;
    }

    const validWords = [
        "will", "should", "can", "could",
        "do", "does", "did",
        "is", "are", "am", "was", "were",
        "have", "has",
        "when", "where", "why",
        "who", "what", "which", "how"
    ];

    const lower = question.toLowerCase();
    const ok = validWords.some(word => lower.startsWith(word + " "));

    if(!ok){
        showError("Please enter a proper question.");
        return false;
    }

    return true;

}

function showFocusScreen(){

    if(ui.questionSection) ui.questionSection.style.display = "none";
    if(ui.focus) ui.focus.style.display = "flex";

    window.setTimeout(() => {

        if(ui.focus) ui.focus.style.display = "none";
        if(ui.shuffle) ui.shuffle.style.display = "block";
        if(ui.shuffleBtn) ui.shuffleBtn.style.display = "inline-flex";
        if(ui.readyBtn) ui.readyBtn.style.display = "inline-flex";

    }, CONFIG.FOCUS_TIME);

}

//======================================================
// PART 2
// SHUFFLE / MOVE / FAN / HOVER
//======================================================

//======================================================
// EVENT BINDING
//======================================================

function bindDeckEvents(){

    if(ui.deck){
        ui.deck.addEventListener("click", shuffleDeck);
    }

    if(ui.shuffleBtn){
        ui.shuffleBtn.addEventListener("click", shuffleDeck);
    }

    if(ui.readyBtn){
        ui.readyBtn.addEventListener("click", startReading);
    }

}

// Attach deck events right away
bindDeckEvents();

//======================================================
// SHUFFLE
//======================================================

function shuffleDeck(){

    if(state.animating) return;

    state.animating = true;

    if(ui.shuffleBtn) ui.shuffleBtn.disabled = true;
    if(ui.readyBtn) ui.readyBtn.disabled = true;

    const cards = [...ui.deck.querySelectorAll(".deck-card")];

    cards.forEach((card, index) => {

        const direction = index % 2 === 0 ? -1 : 1;

        const x = (42 + Math.random() * 55) * direction;
        const y = -18 + Math.random() * 36;
        const r = -18 + Math.random() * 36;

        card.style.transition = "450ms cubic-bezier(.22,.61,.36,1)";
        card.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`;

    });

    setTimeout(() => {

        cards.forEach((card, index) => {

            card.style.transition = "500ms cubic-bezier(.22,.61,.36,1)";
            card.style.transform =
                `translateY(${-index}px) rotate(${(index - 13) * 0.18}deg)`;

        });

    }, CONFIG.SHUFFLE_TIME);

    setTimeout(() => {

        state.animating = false;
        state.shuffles += 1;

        if(ui.shuffleBtn) ui.shuffleBtn.disabled = false;
        if(ui.readyBtn) ui.readyBtn.disabled = false;

        if(ui.shuffleBtn) ui.shuffleBtn.style.display = "inline-flex";
        if(ui.readyBtn) ui.readyBtn.style.display = "inline-flex";

    }, 900);

}

//======================================================
// READY / START
//======================================================

function startReading(){

    if(state.animating) return;

    state.animating = true;

    if(ui.deck){
        ui.deck.style.display = "none";
    }

    if(ui.shuffle){
        ui.shuffle.style.display = "none";
    }

    if(ui.shuffleBtn){
        ui.shuffleBtn.style.display = "none";
    }

    if(ui.readyBtn){
        ui.readyBtn.style.display = "none";
    }

    if(ui.fan){
        ui.fan.style.display = "flex";
    }

    buildFan();

}

function moveDeckToCenter(){

    if(!ui.deck) return;

    ui.deck.style.transition = "850ms cubic-bezier(.18,.89,.32,1.18)";
    ui.deck.style.transform = "translateY(-70px) scale(1.15)";
    ui.deck.style.filter = "drop-shadow(0 0 18px rgba(212,175,55,.35))";

    setTimeout(startGlow, CONFIG.MOVE_TIME);

}

function startGlow(){

    let glow = 0;

    const pulse = setInterval(() => {

        glow += 1;

        const size = 18 + (glow * 8);

        if(ui.deck){
            ui.deck.style.filter =
                `drop-shadow(0 0 ${size}px rgba(212,175,55,.92))`;
        }

        if(glow >= CONFIG.GLOW_STEPS){

            clearInterval(pulse);
            openFan();

        }

    }, CONFIG.GLOW_INTERVAL);

}

//======================================================
// OPEN FAN
//======================================================

function openFan(){

    if(!ui.deck || !ui.shuffle || !ui.fan) return;

    ui.deck.style.transition = "450ms ease";
    ui.deck.style.opacity = "0";
    ui.deck.style.transform = "translateY(-70px) scale(.75)";

    setTimeout(() => {

        ui.deck.style.display = "none";
        ui.shuffle.style.display = "none";
        ui.fan.style.display = "flex";

        state.animating = false;

        buildFan();

    }, 450);

}

//======================================================
// BUILD FAN
//======================================================

function buildFan(){

    hideLoader();

    if(ui.selectedCard){
        ui.selectedCard.src = "";
        ui.selectedCard.classList.remove("show");
        ui.selectedCard.style.transform = "";
        ui.selectedCard.style.opacity = "";
    }

    if(ui.selectedSlot){
        ui.selectedSlot.classList.remove("active");
    }

    if(ui.fanCards){
        ui.fanCards.innerHTML = "";
    }

    state.selectedCard = null;
    state.selectedOrientation = "upright";
    state.hoverEnabled = false;
    state.animating = false;

    const total = CONFIG.STACK_SIZE;

    for(let i = 0; i < total; i++){

        const card = document.createElement("img");

        card.src = CARD_BACK;
        card.draggable = false;
        card.className = "fan-card";

        card.dataset.index = String(i);
        card.dataset.x = "0";
        card.dataset.y = "0";
        card.dataset.rotate = "0";
        card.dataset.scale = "1";
        card.dataset.moveX = "0";
        card.dataset.moveY = "0";

        card.style.left = "50%";
        card.style.bottom = "0";
        card.style.opacity = "0";
        card.style.zIndex = "100";
        card.style.transition =
            "transform 800ms cubic-bezier(.22,.61,.36,1), opacity .45s ease";

        ui.fanCards.appendChild(card);

    }

    requestAnimationFrame(() => {
        spreadCards();
    });

}

//======================================================
// APPLY TRANSFORM FOR FAN CARDS
//======================================================

function applyTransform(
    card,
    {
        x = Number(card?.dataset?.x) || 0,
        y = Number(card?.dataset?.y) || 0,
        rotate = Number(card?.dataset?.rotate) || 0,
        scale = Number(card?.dataset?.scale) || 1,
        rotateY = 0
    } = {}
){

    if(!card) return;

    card.style.transform =
        `translateX(-50%)
         translate(${x}px,${-y}px)
         rotate(${rotate}deg)
         rotateY(${rotateY}deg)
         scale(${scale})`;

}

//======================================================
// SPREAD CARDS
//======================================================

function spreadCards(){

    const cards = [...ui.fanCards.querySelectorAll(".fan-card")];

    const total = cards.length;
    const middle = (total - 1) / 2;

    const fanWidth = ui.fanCards.getBoundingClientRect().width || window.innerWidth;
    const maxX = Math.min(550, Math.max(390, fanWidth * 0.41));
    const maxY = 85;
    const maxRotate = 38;

    cards.forEach((card, index) => {

        const offset = index - middle;
        const t = offset / middle;
        const curve = Math.sin(t * Math.PI / 2);

        const x = curve * maxX;
        const FAN_LIFT = 95;
        const y = FAN_LIFT + (1 - Math.cos(Math.abs(t) * Math.PI / 2)) * maxY;
        const rotate = curve * maxRotate;
        const scale = 1 - Math.abs(t) * 0.022;

        card.dataset.x = String(x);
        card.dataset.y = String(y);
        card.dataset.rotate = String(rotate);
        card.dataset.scale = String(scale);

        card.style.opacity = "1";
        card.style.zIndex = String(1000 - Math.abs(offset));

        applyTransform(card, { x, y, rotate, scale });

    });

    setTimeout(() => {

        state.hoverEnabled = true;
        enableHover();

    }, 800);

}

//======================================================
// HOVER
//======================================================

function enableHover(){

    const cards = [...ui.fanCards.querySelectorAll(".fan-card")];

    cards.forEach(card => {

        card.onmouseenter = () => {

            if(!state.hoverEnabled) return;
            if(state.animating) return;
            if(card.classList.contains("selected")) return;

            applyTransform(card, {
                x: Number(card.dataset.x),
                y: Number(card.dataset.y) - 28,
                rotate: Number(card.dataset.rotate),
                scale: 1.08
            });

        };

        card.onmouseleave = () => {

            if(!state.hoverEnabled) return;
            if(state.animating) return;
            if(card.classList.contains("selected")) return;

            applyTransform(card, {
                x: Number(card.dataset.x),
                y: Number(card.dataset.y),
                rotate: Number(card.dataset.rotate),
                scale: Number(card.dataset.scale)
            });

        };

        card.onclick = () => {

            if(!state.hoverEnabled) return;
            if(state.animating) return;

            chooseCard(card);

        };

    });

}
//======================================================
// CHOOSE CARD
// SELECT → REVEAL → LOADER → READING
//======================================================

function chooseCard(card){

    if(state.animating || !card)
        return;


    state.animating = true;
    state.hoverEnabled = false;


    //==================================================
    // DRAW ACTUAL TAROT CARD
    //==================================================

    state.selectedCard = card;

    state.selectedDraw = randomCard();

    state.selectedOrientation =
        randomOrientation();


    const draw =
        state.selectedDraw;

    const orientation =
        state.selectedOrientation;


    if(!draw)
        return;


    //==================================================
    // FADE OTHER FAN CARDS
    //==================================================

    [
        ...ui.fanCards.querySelectorAll(".fan-card")

    ].forEach(other => {

        if(other !== card){

            other.style.opacity = "0";

            other.style.pointerEvents =
                "none";

        }

    });


    //==================================================
    // HIDE CLICKED FAN CARD
    //==================================================

    card.style.opacity = "0";

    card.style.pointerEvents =
        "none";


    //==================================================
    // ACTIVATE YOUR CARD SLOT
    //==================================================

    if(ui.selectedSlot){

        ui.selectedSlot.classList.add(
            "active"
        );

    }


    //==================================================
    // CLEAR PREVIOUS CARD
    //==================================================

    ui.selectedSlot.innerHTML = "";


    //==================================================
    // CREATE CARD-BACK
    //==================================================

    const slotCard =
        document.createElement("img");


    slotCard.src =
        CARD_BACK;


    slotCard.alt =
        "Selected Tarot Card";


    slotCard.style.width =
        "100%";

    slotCard.style.height =
        "100%";

    slotCard.style.objectFit =
        "cover";

    slotCard.style.display =
        "block";

    slotCard.style.margin =
        "0";

    slotCard.style.transform =
        "rotate(0deg)";

    slotCard.style.opacity =
        "1";


    ui.selectedSlot.appendChild(
        slotCard
    );


    //==================================================
    // WAIT A MOMENT
    // THEN LOAD ACTUAL CARD
    //==================================================

    setTimeout(() => {

        const imagePath =
            resolveImagePath(
                draw.image
            );


        // IMPORTANT:
        // Loader will NOT start yet.
        // First actual card must load.
        slotCard.onload = () => {

            //==========================================
            // CARD IS NOW LOADED
            //==========================================

            slotCard.style.transition =
                "450ms ease";


            slotCard.style.transform =

                orientation === "reversed"

                    ? "rotate(180deg)"

                    : "rotate(0deg)";


            //==========================================
            // WAIT FOR REVEAL
            //==========================================

            setTimeout(() => {

                //======================================
                // NOW START LOADER
                //======================================

                showLoader();


                //======================================
                // THEN SUBMIT
                //======================================

                setTimeout(() => {

                    const slug =
                        draw.slug ||
                        slugify(draw.name);


                    submitReading(
                        slug,
                        orientation
                    );

                }, 1800);

            }, 500);

        };


        //==============================================
        // LOAD ACTUAL CARD IMAGE
        //==============================================

        slotCard.src =
            imagePath;


        //==============================================
        // SAFETY FOR CACHED IMAGE
        //==============================================

        if(slotCard.complete){

            slotCard.onload();

        }

    }, 120);

}
function createParticles(card){
    return;
}
function flipCard(card, draw, orientation){

    if(!card || !draw) return;

    const imagePath = resolveImagePath(draw.image);
    const slug = draw.slug || slugify(draw.name);

    // Actual selected card becomes the drawn card
    card.src = imagePath;

    // Upright / reversed — directly in the slot
    card.style.transform =
        orientation === "reversed"
            ? "rotate(180deg)"
            : "rotate(0deg)";

    card.style.transition = "none";

    // Loading after reveal
    showLoader();

    setTimeout(() => {

        submitReading(
            slug,
            orientation
        );

    }, 1800);

}
function revealSelectedCard(draw, orientation){

    if(!ui.selectedSlotWrapper || !ui.selectedCard) return;

    ui.selectedSlotWrapper.classList.add("active");

    const imagePath = resolveImagePath(draw.image);

    ui.selectedCard.classList.remove("show");
    ui.selectedCard.style.opacity = "0";
    ui.selectedCard.src = imagePath;

    if(orientation === "reversed"){
        ui.selectedCard.style.transform = "rotate(180deg) scale(.92)";
    }else{
        ui.selectedCard.style.transform = "rotate(0deg) scale(.92)";
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ui.selectedCard.classList.add("show");
            ui.selectedCard.style.opacity = "1";
            ui.selectedCard.style.transform =
                orientation === "reversed"
                    ? "rotate(180deg) scale(1)"
                    : "rotate(0deg) scale(1)";
        });
    });

}
//======================================================
// PART 4
// SUBMIT / CLEANUP / SAFETY
//======================================================

function submitReading(cardSlug, orientation){

    const form = document.createElement("form");

    form.method = "POST";
    form.action = "/generate-guidance-reading";
    form.style.display = "none";

    appendHidden(form, "question", state.question);
    appendHidden(form, "card_slug", cardSlug);
    appendHidden(form, "reading_type", "spiritual");
    appendHidden(
        form,
        "orientation",
        orientation || state.selectedOrientation || "upright"
    );

    document.body.appendChild(form);
    form.submit();

}

function resetReadingUI(){

    state.animating = false;
    state.hoverEnabled = false;
    state.selectedCard = null;
    state.selectedOrientation = "upright";
    state.loaderTimer = null;

    hideLoader();

    if(ui.fanCards){
        ui.fanCards.innerHTML = "";
    }

    if(ui.selectedSlot){
        ui.selectedSlot.classList.remove("active");
    }

    if(ui.selectedCard){
        ui.selectedCard.src = "";
        ui.selectedCard.classList.remove("show");
        ui.selectedCard.style.opacity = "";
        ui.selectedCard.style.transform = "";
    }

    if(ui.fan){
        ui.fan.style.display = "none";
    }

    if(ui.shuffle){
        ui.shuffle.style.display = "none";
    }

    if(ui.questionSection){
        ui.questionSection.style.display = "block";
    }

    if(ui.question){
        ui.question.value = "";
    }

}

window.addEventListener("pageshow", () => {

    if(ui.loader) ui.loader.classList.remove("show");

    if(ui.selectedSlot){
        ui.selectedSlot.classList.remove("active");
    }

    if(ui.selectedCard){
        ui.selectedCard.classList.remove("show");
    }

});

window.addEventListener("resize", () => {

    if(!state.hoverEnabled) return;
    if(state.animating) return;
    if(!ui.fanCards) return;

    const cards = [...ui.fanCards.querySelectorAll(".fan-card")];

    cards.forEach(card => {

        if(card.classList.contains("selected")) return;

        applyTransform(card, {
            x: Number(card.dataset.x),
            y: Number(card.dataset.y),
            rotate: Number(card.dataset.rotate),
            scale: Number(card.dataset.scale)
        });

    });

});

document.addEventListener("keydown", (event) => {

    if(event.key === "Escape"){
        hideError();
    }

});

//======================================================
// FINAL INIT HOOK
//======================================================

window.addEventListener("load", () => {

    buildDeck();
    bindDeckEvents();

    if(ui.questionSection) ui.questionSection.style.display = "block";
    if(ui.focus) ui.focus.style.display = "none";
    if(ui.shuffle) ui.shuffle.style.display = "none";
    if(ui.fan) ui.fan.style.display = "none";

});
