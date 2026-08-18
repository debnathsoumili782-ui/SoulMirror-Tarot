// =====================================
// SOULMIRROR SIMPLE LOVE ENGINE
// =====================================


// =====================================
// ELEMENTS
// =====================================

const errorBox =
    document.getElementById("questionError");

const form =
    document.getElementById("questionForm");

const questionSection =
    document.getElementById("questionSection");

const focusScreen =
    document.getElementById("focusScreen");

const shuffleSection =
    document.getElementById("shuffleSection");

const deck =
    document.getElementById("deck");

const shuffleBtn =
    document.getElementById("shuffleBtn");

const readyBtn =
    document.getElementById("readyBtn");

const fanSection =
    document.getElementById("fanSection");

const fanCards =
    document.getElementById("fanCards");

const selectedSlots =
    document.getElementById("selectedSlots");


// =====================================
// SETTINGS
// =====================================

const CARD_BACK =
    "/static/images/cards/back/card-back.png";

const TAROT_CARDS =
    JSON.parse(
        document.getElementById("tarot-data").textContent
    );

const STACK_SIZE = 25;


// =====================================
// STATE
// =====================================

let animating = false;

let pickedCards = [];


// =====================================
// BUILD DECK
// YES / NO STYLE
// =====================================

function buildDeck(){

    deck.innerHTML = "";

    for(let i = 0; i < STACK_SIZE; i++){

        const card =
            document.createElement("img");

        card.src =
            CARD_BACK;

        card.draggable =
            false;

        card.className =
            "deck-card";

        card.style.zIndex =
            String(i);

        card.style.transform =
            `translateY(${-i}px)
             rotate(${(i - 13) * 0.18}deg)`;

        deck.appendChild(card);

    }

}

buildDeck();


// =====================================
// QUESTION
// =====================================

form.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        const question =
            document
                .getElementById("question")
                .value
                .trim();


        if(question === ""){

            errorBox.style.display =
                "block";

            errorBox.innerText =
                "Please enter your question.";

            return;

        }


        localStorage.setItem(
            "loveQuestion",
            question
        );


        questionSection.style.display =
            "none";

        focusScreen.style.display =
            "flex";


        // =================================
        // FOCUS → SHUFFLE PAGE
        // BUTTONS APPEAR HERE
        // =================================

        setTimeout(() => {

            focusScreen.style.display =
                "none";


            shuffleSection.style.display =
                "block";


            // IMPORTANT:
            // Buttons are visible as soon
            // as shuffle page opens.

            shuffleBtn.style.display =
                "inline-flex";

            readyBtn.style.display =
                "inline-flex";

        }, 2500);

    }
);


// =====================================
// SHUFFLE
// YES / NO STYLE
// =====================================

function shuffleDeck(){

    if(animating)
        return;

    animating = true;


    const cards = [
        ...deck.querySelectorAll(".deck-card")
    ];


    // =================================
    // SPREAD + RANDOM ROTATION
    // =================================

    cards.forEach((card, index) => {

        const direction =
            index % 2 === 0 ? -1 : 1;


        const x =
            (42 + Math.random() * 55)
            * direction;


        const y =
            -18 + Math.random() * 36;


        const r =
            -18 + Math.random() * 36;


        card.style.transition =
            "450ms cubic-bezier(.22,.61,.36,1)";


        card.style.transform =
            `translate(${x}px,${y}px)
             rotate(${r}deg)`;

    });


    // =================================
    // RETURN TO STACK
    // =================================

    setTimeout(() => {

        cards.forEach((card, index) => {

            card.style.transition =
                "500ms cubic-bezier(.22,.61,.36,1)";


            card.style.transform =
                `translateY(${-index}px)
                 rotate(${(index - 13) * 0.18}deg)`;

        });

    }, 450);


    // =================================
    // ANIMATION COMPLETE
    // BUTTONS STAY VISIBLE
    // =================================

    setTimeout(() => {

        animating = false;

    }, 900);

}


// =====================================
// SHUFFLE EVENTS
// =====================================

deck.addEventListener(
    "click",
    shuffleDeck
);


shuffleBtn.addEventListener(
    "click",
    shuffleDeck
);


// =====================================
// BUILD FAN
// YES / NO EXACT FAN
// SIMPLE LOVE = 25 CARDS
// =====================================

function buildFan(){

    fanCards.innerHTML = "";

    // Pick 25 cards for the visible fan
    const fanDeck = [...TAROT_CARDS]
        .sort(() => Math.random() - 0.5)
        .slice(0, 25);


    fanDeck.forEach((card, index) => {

        const img =
            document.createElement("img");


        img.src =
            CARD_BACK;

        img.draggable =
            false;

        img.className =
            "fan-card";


        img.dataset.index =
            String(index);

        img.dataset.slug =
            card.slug;

        img.dataset.image =
            card.image;

        img.dataset.name =
            card.name;


        // YES / NO positioning setup
        img.style.left =
            "50%";

        img.style.bottom =
            "0";

        img.style.opacity =
            "0";

        img.style.zIndex =
            "100";


        img.style.transition =
            "transform 800ms cubic-bezier(.22,.61,.36,1), opacity .45s ease";


        // Store fan values
        img.dataset.x = "0";
        img.dataset.y = "0";
        img.dataset.rotate = "0";
        img.dataset.scale = "1";


        fanCards.appendChild(img);

    });


    requestAnimationFrame(() => {

        spreadCards();

    });

}
// =====================================
// APPLY TRANSFORM
// YES / NO EXACT
// =====================================

function applyTransform(
    card,
    {
        x = Number(card.dataset.x) || 0,
        y = Number(card.dataset.y) || 0,
        rotate = Number(card.dataset.rotate) || 0,
        scale = Number(card.dataset.scale) || 1
    } = {}
){

    if(!card)
        return;


    card.style.transform =
        `translateX(-50%)
         translate(${x}px,${-y}px)
         rotate(${rotate}deg)
         scale(${scale})`;

}

// =====================================
// SPREAD CARDS
// YES / NO EXACT DESIGN
// =====================================

function spreadCards(){

    const cards = [
        ...fanCards.querySelectorAll(
            ".fan-card"
        )
    ];


    const total =
        cards.length;


    const middle =
        (total - 1) / 2;


    const fanWidth =
        fanCards.getBoundingClientRect().width ||
        window.innerWidth;


    const maxX =
        Math.min(
            550,
            Math.max(
                390,
                fanWidth * 0.41
            )
        );


    const maxY =
        85;


    const maxRotate =
        38;


    cards.forEach((card, index) => {

        const offset =
            index - middle;


        const t =
            offset / middle;


        const curve =
            Math.sin(
                t * Math.PI / 2
            );


        const x =
            curve * maxX;


        const FAN_LIFT =
            95;


        const y =
            FAN_LIFT +
            (
                1 -
                Math.cos(
                    Math.abs(t) *
                    Math.PI / 2
                )
            ) *
            maxY;


        const rotate =
            curve * maxRotate;


        const scale =
            1 -
            Math.abs(t) * 0.022;


        card.dataset.x =
            String(x);

        card.dataset.y =
            String(y);

        card.dataset.rotate =
            String(rotate);

        card.dataset.scale =
            String(scale);


        card.style.opacity =
            "1";


        card.style.zIndex =
            String(
                1000 -
                Math.abs(offset)
            );


        applyTransform(
            card,
            {
                x,
                y,
                rotate,
                scale
            }
        );

    });


    setTimeout(() => {

        enableSelection();

    }, 800);

}

// =====================================
// READY
// =====================================

readyBtn.addEventListener(
    "click",
    () => {

        if(animating)
            return;


        shuffleSection.style.display =
            "none";


        selectedSlots.style.display =
            "flex";


        fanSection.style.display =
            "block";


        buildFan();

    }
);


// =====================================
// FAN SELECTION
// YES / NO STYLE
// SIMPLE LOVE = 3 PICKS
// =====================================

function enableSelection(){

    const cards = [
        ...fanCards.querySelectorAll(
            ".fan-card"
        )
    ];


    cards.forEach(card => {


        // ===============================
        // HOVER
        // ===============================

        card.addEventListener(
            "mouseenter",
            () => {

                if(
                    card.dataset.selected ===
                    "true"
                )
                    return;


                const x =
                    Number(card.dataset.x);


                const y =
                    Number(card.dataset.y);


                const rotate =
                    Number(
                        card.dataset.rotate
                    );


                applyTransform(
                    card,
                    {
                        x: x,
                        y: y - 28,
                        rotate: rotate,
                        scale: 1.08
                    }
                );

            }
        );


        // ===============================
        // LEAVE
        // ===============================

        card.addEventListener(
            "mouseleave",
            () => {

                if(
                    card.dataset.selected ===
                    "true"
                )
                    return;


                applyTransform(
                    card,
                    {
                        x:
                            Number(
                                card.dataset.x
                            ),

                        y:
                            Number(
                                card.dataset.y
                            ),

                        rotate:
                            Number(
                                card.dataset.rotate
                            ),

                        scale:
                            Number(
                                card.dataset.scale
                            )
                    }
                );

            }
        );


        // ===============================
        // CLICK
        // ===============================

        card.addEventListener(
            "click",
            () => {

                if(
                    card.dataset.selected ===
                    "true"
                )
                    return;


                if(
                    pickedCards.length >= 3
                )
                    return;


                pickCard(card);

            }
        );

    });

}

// =====================================
// PICK CARD
// =====================================

function pickCard(card){

    if(
        pickedCards.length >= 3
    )
        return;


    card.dataset.selected =
        "true";


    const orientation =
        Math.random() < 0.5
            ? "upright"
            : "reversed";


    pickedCards.push({

        slug:
            card.dataset.slug,

        image:
            card.dataset.image,

        name:
            card.dataset.name,

        orientation:
            orientation

    });


    moveCardToSlot(
        card,
        pickedCards.length
    );

}


// =====================================
// MOVE CARD TO SLOT
// =====================================

function moveCardToSlot(
    card,
    slotNumber
){

    const slot =
        document.getElementById(
            "slot" + slotNumber
        );


    // =================================
    // SELECTED CARD FADE
    // =================================

    card.style.transition =
        ".45s ease";

    card.style.opacity =
        ".15";

    card.style.pointerEvents =
        "none";


    // =================================
    // SLOT IMAGE
    // =================================

    slot.src =
        "/static/images/" +
        card.dataset.image;


    const currentCard =
        pickedCards[
            slotNumber - 1
        ];


    // =================================
    // INITIAL ORIENTATION
    // =================================

    if(
        currentCard.orientation ===
        "reversed"
    ){

        slot.style.transform =
            "rotate(180deg) scale(.75)";

    }else{

        slot.style.transform =
            "rotate(0deg) scale(.75)";

    }


    slot.style.display =
        "block";

    slot.style.opacity =
        "0";


    // =================================
    // REVEAL
    // =================================

    slot.style.transform =
        "scale(.75)";


    setTimeout(() => {

        slot.style.transition =
            ".45s ease";

        slot.style.opacity =
            "1";


        if(
            currentCard.orientation ===
            "reversed"
        ){

            slot.style.transform =
                "rotate(180deg) scale(1)";

        }else{

            slot.style.transform =
                "rotate(0deg) scale(1)";

        }

    }, 250);


    // =================================
    // AFTER THIRD CARD
    // =================================

    if(slotNumber === 3){

        setTimeout(() => {

            submitLoveReading();

        }, 800);

    }

}


// =====================================
// SUBMIT LOVE READING
// =====================================

function submitLoveReading(){

    document.getElementById(
        "question"
    ).value =
        localStorage.getItem(
            "loveQuestion"
        ) || "";


    document.getElementById(
        "card1"
    ).value =
        pickedCards[0].slug;


    document.getElementById(
        "card2"
    ).value =
        pickedCards[1].slug;


    document.getElementById(
        "card3"
    ).value =
        pickedCards[2].slug;


    document.getElementById(
        "orientation1"
    ).value =
        pickedCards[0].orientation;


    document.getElementById(
        "orientation2"
    ).value =
        pickedCards[1].orientation;


    document.getElementById(
        "orientation3"
    ).value =
        pickedCards[2].orientation;


    // =================================
    // READING LOADER
    // =================================

    const loader =
        document.getElementById(
            "readingLoader"
        );


    const text =
        document.getElementById(
            "loaderText"
        );


    loader.style.display =
        "flex";


    const messages = [

        "✨ The cards have been chosen...",

        "🌙 Reading your energy...",

        "💞 Understanding the connection...",

        "🔮 Weaving the story...",

        "✨ Your reading is almost ready..."

    ];


    let i = 0;


    const interval =
        setInterval(() => {

            i++;


            if(
                i < messages.length
            ){

                text.textContent =
                    messages[i];

            }

        }, 900);


    setTimeout(() => {

        clearInterval(interval);

        document
            .getElementById(
                "questionForm"
            )
            .submit();

    }, 4200);

}