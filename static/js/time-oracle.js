//======================================================
// SOULMIRROR TAROT
// TIME ORACLE READING ENGINE
// BASED ON YES / NO READING ENGINE
//======================================================

"use strict";


//======================================================
// DOM
//======================================================

const ui = {

    form:
        document.getElementById("questionForm"),

    question:
        document.getElementById("question"),

    error:
        document.getElementById("questionError"),

    questionSection:
        document.getElementById("questionSection"),

    focus:
        document.getElementById("focusScreen"),

    shuffle:
        document.getElementById("shuffleSection"),

    fan:
        document.getElementById("fanSection"),

    deck:
        document.getElementById("deck"),

    shuffleBtn:
        document.getElementById("shuffleBtn"),

    readyBtn:
        document.getElementById("readyBtn"),

    fanCards:
        document.getElementById("fanCards"),

    selectedSlotWrapper:
        document.getElementById("selectedSlotWrapper"),

    selectedSlot:
        document.querySelector(".selected-slot"),

    selectedCard:
        document.getElementById("selectedCard"),

    loader:
        document.getElementById("readingLoader"),

    loaderText:
        document.getElementById("loaderText"),

    flashOverlay:
        document.getElementById("flashOverlay"),

    fanOverlay:
        document.getElementById("fanOverlay")

};


//======================================================
// DATA
//======================================================

const CARD_BACK =
    "/static/images/time-oracle/card-back.png";

const TIME_CARDS =
    TIME_ORACLE_CARDS;


//======================================================
// CONFIG
// EXACT YES / NO VALUES
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


//======================================================
// LOADER MESSAGES
// TIME ORACLE VERSION
//======================================================

const LOADER_MESSAGES = [

    "✨ The oracle has chosen your card...",

    "🌙 Reading the timing energy...",

    "🔮 Revealing when the path may unfold..."

];


//======================================================
// STATE
//======================================================

const state = {

    question: "",

    animating: false,

    shuffles: 0,

    selectedCard: null,

    selectedDraw: null,

    hoverEnabled: false,

    loaderTimer: null

};


//======================================================
// INIT
//======================================================

document.addEventListener(
    "DOMContentLoaded",
    init
);


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

    if(ui.focus)
        ui.focus.style.display = "none";

    if(ui.shuffle)
        ui.shuffle.style.display = "none";

    if(ui.fan)
        ui.fan.style.display = "none";

    if(ui.loader)
        ui.loader.classList.remove("show");


    if(ui.shuffleBtn)
        ui.shuffleBtn.style.display = "none";

    if(ui.readyBtn)
        ui.readyBtn.style.display = "none";


    if(ui.selectedSlot){

        ui.selectedSlot.classList.remove(
            "active"
        );

    }


    if(ui.selectedCard){

        ui.selectedCard.src = "";

        ui.selectedCard.classList.remove(
            "show"
        );

        ui.selectedCard.style.transform = "";

        ui.selectedCard.style.opacity = "";

    }

}


//======================================================
// BUILD DECK
// EXACT YES / NO STRUCTURE
//======================================================

function buildDeck(){

    if(!ui.deck)
        return;


    ui.deck.innerHTML = "";


    for(
        let i = 0;
        i < CONFIG.STACK_SIZE;
        i++
    ){

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


        ui.deck.appendChild(card);

    }

}


//======================================================
// HELPERS
//======================================================

function showError(message){

    if(!ui.error)
        return;


    ui.error.style.display =
        "block";

    ui.error.textContent =
        message;

}


function hideError(){

    if(!ui.error)
        return;


    ui.error.style.display =
        "none";

    ui.error.textContent =
        "";

}


function resolveImagePath(image){

    if(!image)
        return CARD_BACK;


    if(
        image.startsWith(
            "/static/"
        )
    ){

        return image;

    }


    return "/static/images/" +
        image.replace(
            /^\/+/,
            ""
        );

}


function appendHidden(
    form,
    name,
    value
){

    const input =
        document.createElement(
            "input"
        );


    input.type =
        "hidden";

    input.name =
        name;

    input.value =
        value == null
            ? ""
            : String(value);


    form.appendChild(
        input
    );

}


//======================================================
// APPLY TRANSFORM
// EXACT YES / NO
//======================================================

function applyTransform(

    card,

    {

        x =
            Number(
                card?.dataset?.x
            ) || 0,

        y =
            Number(
                card?.dataset?.y
            ) || 0,

        rotate =
            Number(
                card?.dataset?.rotate
            ) || 0,

        scale =
            Number(
                card?.dataset?.scale
            ) || 1,

        rotateY = 0

    } = {}

){

    if(!card)
        return;


    card.style.transform =

        `translateX(-50%)
         translate(${x}px,${-y}px)
         rotate(${rotate}deg)
         rotateY(${rotateY}deg)
         scale(${scale})`;

}


//======================================================
// FLASH
//======================================================

function flash(){

    if(!ui.flashOverlay)
        return;


    ui.flashOverlay.classList.add(
        "active"
    );


    setTimeout(() => {

        ui.flashOverlay.classList.remove(
            "active"
        );

    }, 220);

}


//======================================================
// LOADER
//======================================================

function resetLoader(){

    if(state.loaderTimer){

        clearInterval(
            state.loaderTimer
        );

        state.loaderTimer = null;

    }


    if(ui.loaderText){

        ui.loaderText.textContent =
            LOADER_MESSAGES[0];

    }

}


function showLoader(){

    if(
        !ui.loader ||
        !ui.loaderText
    )
        return;


    resetLoader();


    ui.loader.classList.add(
        "show"
    );


    let index = 0;


    ui.loaderText.textContent =
        LOADER_MESSAGES[0];


    state.loaderTimer =
        setInterval(() => {

            index += 1;


            if(
                index >=
                LOADER_MESSAGES.length
            ){

                clearInterval(
                    state.loaderTimer
                );

                state.loaderTimer =
                    null;

                return;

            }


            ui.loaderText.textContent =
                LOADER_MESSAGES[index];

        }, 900);

}


function hideLoader(){

    if(!ui.loader)
        return;


    ui.loader.classList.remove(
        "show"
    );


    if(state.loaderTimer){

        clearInterval(
            state.loaderTimer
        );

        state.loaderTimer =
            null;

    }

}

//======================================================
// QUESTION FLOW
// TIME ORACLE CRITERIA
//======================================================

//======================================================
// QUESTION FLOW
// TIME ORACLE CRITERIA
//======================================================

function bindQuestionEvents(){

    const startBtn =
        document.getElementById("startOracleBtn");


    if(!startBtn)
        return;


    // Clear error while typing

    if(ui.question){

        ui.question.addEventListener(
            "input",
            hideError
        );

    }


    // IMPORTANT:
    // HTML button is type="button",
    // so we trigger the reading manually.

    startBtn.addEventListener(
        "click",
        handleQuestionSubmit
    );

}

function handleQuestionSubmit(event){

    event.preventDefault();

    hideError();


    const question =
        ui.question.value.trim();


    if(
        !validateQuestion(question)
    ){

        return;

    }


    state.question =
        question;


    localStorage.setItem(
        "question",
        question
    );


    showFocusScreen();

}


//======================================================
// TIME ORACLE QUESTION VALIDATION
//======================================================

function validateQuestion(question){

    if(question === ""){

        showError(
            "Ask the Oracle a timing question."
        );

        return false;

    }


    if(question.length < 10){

        showError(
            "Please write a more detailed timing question."
        );

        return false;

    }


    if(!question.endsWith("?")){

        showError(
            "Your question should end with a question mark (? )."
        );

        return false;

    }


    const timingWords = [

        "when",

        "how long",

        "how soon",

        "what time"

    ];


    const lower =
        question.toLowerCase();


    const valid =
        timingWords.some(
            word =>
                lower.includes(word)
        );


    if(!valid){

        showError(
            "The Time Oracle only answers timing questions."
        );

        return false;

    }


    return true;

}


//======================================================
// FOCUS SCREEN
// EXACT YES / NO FLOW
//======================================================

function showFocusScreen(){

    if(ui.questionSection){

        ui.questionSection.style.display =
            "none";

    }


    if(ui.focus){

        ui.focus.style.display =
            "flex";

    }


    window.setTimeout(() => {

        if(ui.focus){

            ui.focus.style.display =
                "none";

        }


        if(ui.shuffle){

            ui.shuffle.style.display =
                "block";

        }


        if(ui.shuffleBtn){

            ui.shuffleBtn.style.display =
                "inline-flex";

        }


        if(ui.readyBtn){

            ui.readyBtn.style.display =
                "inline-flex";

        }

    }, CONFIG.FOCUS_TIME);

}


//======================================================
// EVENT BINDING
//======================================================

function bindDeckEvents(){

    if(ui.deck){

        ui.deck.addEventListener(
            "click",
            shuffleDeck
        );

    }


    if(ui.shuffleBtn){

        ui.shuffleBtn.addEventListener(
            "click",
            shuffleDeck
        );

    }


    if(ui.readyBtn){

        ui.readyBtn.addEventListener(
            "click",
            startReading
        );

    }

}


//======================================================
// ATTACH DECK EVENTS
//======================================================

bindDeckEvents();

//======================================================
// SHUFFLE DECK
// BASED ON YES / NO ENGINE
//======================================================

function shuffleDeck(){

    if(state.animating)
        return;


    state.animating = true;


    if(ui.shuffleBtn)
        ui.shuffleBtn.disabled = true;


    if(ui.readyBtn)
        ui.readyBtn.disabled = true;


    const cards = [

        ...ui.deck.querySelectorAll(
            ".deck-card"
        )

    ];


    //==================================================
    // SHUFFLE OUT
    //==================================================

    cards.forEach(
        (card, index) => {

            const direction =
                index % 2 === 0
                    ? -1
                    : 1;


            const x =
                (
                    42 +
                    Math.random() * 55
                ) * direction;


            const y =
                -18 +
                Math.random() * 36;


            const r =
                -18 +
                Math.random() * 36;


            card.style.transition =
                "450ms cubic-bezier(.22,.61,.36,1)";


            card.style.transform =

                `translate(${x}px,${y}px)
                 rotate(${r}deg)`;

        }
    );


    //==================================================
    // RETURN TO STACK
    //==================================================

    setTimeout(() => {

        cards.forEach(
            (card, index) => {

                card.style.transition =
                    "500ms cubic-bezier(.22,.61,.36,1)";


                card.style.transform =

                    `translateY(${-index}px)
                     rotate(${(index - 13) * 0.18}deg)`;

            }
        );

    }, CONFIG.SHUFFLE_TIME);


    //==================================================
    // ENABLE CONTROLS
    //==================================================

    setTimeout(() => {

        state.animating = false;

        state.shuffles += 1;


        if(ui.shuffleBtn){

            ui.shuffleBtn.disabled =
                false;

            ui.shuffleBtn.style.display =
                "inline-flex";

        }


        if(ui.readyBtn){

            ui.readyBtn.disabled =
                false;

            ui.readyBtn.style.display =
                "inline-flex";

        }

    }, 900);

}


//======================================================
// READY
//======================================================

function startReading(){

    if(state.animating)
        return;


    state.animating = true;


    // Hide shuffle deck

    if(ui.deck){

        ui.deck.style.display =
            "none";

    }


    if(ui.shuffle){

        ui.shuffle.style.display =
            "none";

    }


    if(ui.shuffleBtn){

        ui.shuffleBtn.style.display =
            "none";

    }


    if(ui.readyBtn){

        ui.readyBtn.style.display =
            "none";

    }


    // Open fan

    if(ui.fan){

        ui.fan.style.display =
            "flex";

    }


    buildFan();

}

//======================================================
// BUILD FAN
// EXACT YES / NO FAN STRUCTURE
// TIME ORACLE = 25 CARDS
//======================================================

function buildFan(){

    // Clear previous fan
    ui.fanCards.innerHTML = "";


    // Reset selected card
    state.selectedCard = null;

    state.selectedDraw = null;

    state.hoverEnabled = false;


    // Reset selected slot
    if(ui.selectedSlot){

        ui.selectedSlot.classList.remove(
            "active"
        );

    }


    if(ui.selectedCard){

        ui.selectedCard.src = "";

        ui.selectedCard.classList.remove(
            "show"
        );

    }


    //==================================================
    // EXACTLY 25 CARDS
    //==================================================

    const total =
        CONFIG.STACK_SIZE;


    for(
        let i = 0;
        i < total;
        i++
    ){

        const card =
            document.createElement("img");


        // Time Oracle card back
        card.src =
            CARD_BACK;


        card.draggable =
            false;


        card.className =
            "fan-card";


        // Position index
        card.dataset.index =
            String(i);


        // Transform data
        card.dataset.x = "0";

        card.dataset.y = "0";

        card.dataset.rotate = "0";

        card.dataset.scale = "1";


        //==================================================
        // SAME BASE POSITION AS YES / NO
        //==================================================

        card.style.left =
            "50%";

        card.style.bottom =
            "0";

        card.style.opacity =
            "0";

        card.style.zIndex =
            "100";


        card.style.transition =
            "transform 800ms cubic-bezier(.22,.61,.36,1), opacity .45s ease";


        ui.fanCards.appendChild(
            card
        );

    }


    //==================================================
    // START FAN SPREAD
    //==================================================

    requestAnimationFrame(() => {

        spreadCards();

    });

}


//======================================================
// APPLY FAN TRANSFORM
// EXACT YES / NO TRANSFORM
//======================================================

function applyFanTransform(

    card,

    {

        x = 0,

        y = 0,

        rotate = 0,

        scale = 1

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


//======================================================
// SPREAD CARDS
// EXACT YES / NO GEOMETRY
//======================================================

function spreadCards(){

    const cards = [

        ...ui.fanCards.querySelectorAll(
            ".fan-card"
        )

    ];


    const total =
        cards.length;


    const middle =
        (total - 1) / 2;


    const fanWidth =
        ui.fanCards
            .getBoundingClientRect()
            .width
        ||
        window.innerWidth;


    //==================================================
    // EXACT YES / NO VALUES
    //==================================================

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


    //==================================================
    // POSITION EVERY CARD
    //==================================================

    cards.forEach(
        (card, index) => {

            const offset =
                index - middle;


            const t =
                offset / middle;


            // Curved fan
            const curve =
                Math.sin(
                    t * Math.PI / 2
                );


            // Horizontal position
            const x =
                curve * maxX;


            // Vertical curve
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

                ) * maxY;


            // Rotation
            const rotate =
                curve * maxRotate;


            // Slight edge scaling
            const scale =

                1 -
                Math.abs(t) * 0.022;


            // Save values
            card.dataset.x =
                String(x);

            card.dataset.y =
                String(y);

            card.dataset.rotate =
                String(rotate);

            card.dataset.scale =
                String(scale);


            // Show card
            card.style.opacity =
                "1";


            // Layering
            card.style.zIndex =

                String(
                    1000 -
                    Math.abs(offset)
                );


            // Apply exact fan transform
            applyFanTransform(
                card,
                {
                    x,
                    y,
                    rotate,
                    scale
                }
            );

        }
    );


    //==================================================
    // ENABLE HOVER AFTER FAN OPENS
    //==================================================

    setTimeout(() => {

        state.hoverEnabled =
            true;


        enableHover();


        state.animating =
            false;

    }, 800);

}
//======================================================
// HOVER
// BASED ON YES / NO
//======================================================

function enableHover(){

    const cards = [

        ...ui.fanCards.querySelectorAll(
            ".fan-card"
        )

    ];


    cards.forEach(card => {


        //==================================================
        // MOUSE ENTER
        //==================================================

        card.onmouseenter = () => {

            if(!state.hoverEnabled)
                return;


            if(state.animating)
                return;


            if(
                card.classList.contains(
                    "selected"
                )
            )
                return;


            applyFanTransform(
                card,
                {

                    x:
                        Number(
                            card.dataset.x
                        ),

                    y:
                        Number(
                            card.dataset.y
                        ) - 28,

                    rotate:
                        Number(
                            card.dataset.rotate
                        ),

                    scale:
                        1.08

                }
            );

        };


        //==================================================
        // MOUSE LEAVE
        //==================================================

        card.onmouseleave = () => {

            if(!state.hoverEnabled)
                return;


            if(state.animating)
                return;


            if(
                card.classList.contains(
                    "selected"
                )
            )
                return;


            applyFanTransform(
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

        };


        //==================================================
        // CLICK
        // ONE CLICK = SELECT
        //==================================================

        card.onclick = () => {

            if(!state.hoverEnabled)
                return;


            if(state.animating)
                return;


            chooseCard(card);

        };

    });

}


//======================================================
// CHOOSE CARD
// TIME ORACLE VERSION
//======================================================

function chooseCard(card){

    if(
        state.animating ||
        !card
    )
        return;


    state.animating =
        true;

    state.hoverEnabled =
        false;


    //==================================================
    // SAVE SELECTED CARD
    //==================================================

    state.selectedCard =
        card;


    const index =
        Number(
            card.dataset.index
        );


    // IMPORTANT:
    // Clicked position determines the
    // Time Oracle card.
    //
    // No random Tarot draw.
    // No reversed orientation.

    state.selectedDraw =
        TIME_CARDS[index];


    if(!state.selectedDraw){

        state.animating =
            false;

        return;

    }


    //==================================================
    // FADE ALL OTHER FAN CARDS
    //==================================================

    const cards = [

        ...ui.fanCards.querySelectorAll(
            ".fan-card"
        )

    ];


    cards.forEach(other => {

        if(other !== card){

            other.style.opacity =
                "0";

            other.style.pointerEvents =
                "none";

        }

    });


    //==================================================
    // SELECTED CARD
    //==================================================

    card.classList.add(
        "selected"
    );


    card.style.zIndex =
        "5000";


    //==================================================
    // HIDE CARD FROM FAN
    //==================================================

    card.style.opacity =
        "0";

    card.style.pointerEvents =
        "none";


    //==================================================
    // SELECTED CARD SLOT
    //==================================================

    if(ui.selectedSlotWrapper){

        ui.selectedSlotWrapper.style.opacity =
            "1";

        ui.selectedSlotWrapper.style.visibility =
            "visible";

        ui.selectedSlotWrapper.style.transform =
            "translateY(0)";

    }


    if(ui.selectedCard){

        // Show card back first
        ui.selectedCard.src =
            CARD_BACK;


        ui.selectedCard.style.opacity =
            "1";


        ui.selectedCard.style.transform =
            "scale(1)";


        ui.selectedCard.classList.add(
            "show"
        );

    }


    //==================================================
    // REVEAL ACTUAL TIME CARD
    //==================================================

    setTimeout(() => {

        revealTimeCard();

    }, 450);

}


//======================================================
// REVEAL TIME ORACLE CARD
// NO REVERSE
//======================================================

function revealTimeCard(){

    const draw =
        state.selectedDraw;


    if(
        !draw ||
        !ui.selectedCard
    ){

        state.animating =
            false;

        return;

    }


    const imagePath =
        resolveImagePath(
            draw.image
        );


    //==================================================
    // WAIT FOR IMAGE
    //==================================================

    ui.selectedCard.onload = () => {

        ui.selectedCard.style.opacity =
            "1";


        ui.selectedCard.style.transform =
            "scale(1)";


        ui.selectedCard.classList.add(
            "show"
        );


        //==================================================
        // CARD DISPLAY TIME
        //==================================================

        setTimeout(() => {

            showLoader();


            //==================================================
            // SUBMIT AFTER LOADER
            //==================================================

            setTimeout(() => {

                const slug =
                    draw.slug ||
                    slugify(
                        draw.name
                    );


                submitTimeReading(
                    slug
                );

            }, CONFIG.LOADER_TIME);

        }, 650);

    };


    //==================================================
    // SET ACTUAL CARD IMAGE
    //==================================================

    ui.selectedCard.src =
        imagePath;

}


//======================================================
// SLUG HELPER
//======================================================

function slugify(text){

    return String(text || "")

        .toLowerCase()

        .trim()

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-+|-+$/g,
            ""
        );

}
//======================================================
// SUBMIT TIME ORACLE READING
// BACKEND ROUTE UNCHANGED
//======================================================

function submitTimeReading(cardSlug){

    const form =
        document.createElement("form");


    form.method =
        "POST";


    form.action =
        "/generate-time-reading";


    form.style.display =
        "none";


    //==================================================
    // QUESTION
    //==================================================

    appendHidden(

        form,

        "question",

        state.question ||

        localStorage.getItem(
            "question"
        ) ||

        ""

    );


    //==================================================
    // SELECTED TIME CARD
    //==================================================

    appendHidden(

        form,

        "card_slug",

        cardSlug

    );


    //==================================================
    // READING TYPE
    //==================================================

    appendHidden(

        form,

        "reading_type",

        "time-oracle"

    );


    document.body.appendChild(
        form
    );


    form.submit();

}


//======================================================
// RESIZE
// KEEP FAN POSITIONING
// EXACT YES / NO BEHAVIOUR
//======================================================

window.addEventListener(
    "resize",
    () => {

        if(!state.hoverEnabled)
            return;


        if(state.animating)
            return;


        if(!ui.fanCards)
            return;


        const cards = [

            ...ui.fanCards.querySelectorAll(
                ".fan-card"
            )

        ];


        cards.forEach(card => {

            if(
                card.classList.contains(
                    "selected"
                )
            ){

                return;

            }


            applyFanTransform(

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

        });

    }

);


//======================================================
// PAGE SHOW SAFETY
//======================================================

window.addEventListener(
    "pageshow",
    () => {

        if(ui.loader){

            ui.loader.classList.remove(
                "show"
            );

        }


        if(ui.selectedSlot){

            ui.selectedSlot.classList.remove(
                "active"
            );

        }


        if(ui.selectedCard){

            ui.selectedCard.classList.remove(
                "show"
            );

        }

    }
);


//======================================================
// ESCAPE → CLEAR ERROR
//======================================================

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape"
        ){

            hideError();

        }

    }
);