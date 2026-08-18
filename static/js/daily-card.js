// ======================================
// Daily Card Reveal
// ======================================

const intro = document.getElementById("dailyIntro");
const reading = document.getElementById("dailyReading");
const revealBtn = document.getElementById("revealDailyCard");
const card = document.getElementById("dailyCardImage");

reading.style.display = "none";

revealBtn.addEventListener("click", () => {

    revealBtn.disabled = true;

    intro.style.transition = ".7s";
    intro.style.opacity = "0";
    intro.style.transform = "translateY(-20px)";

    setTimeout(() => {

        intro.style.display = "none";

        reading.style.display = "flex";
        reading.style.opacity = "0";
        reading.style.transform = "translateY(40px)";

        card.style.transform = "rotateY(90deg) scale(.85)";
        card.style.opacity = "0";

        requestAnimationFrame(() => {

            reading.style.transition = ".8s";
            reading.style.opacity = "1";
            reading.style.transform = "translateY(0)";

            setTimeout(() => {

                card.style.transition =
                    "transform .9s ease, opacity .9s ease";

                card.style.transform =
                    "rotateY(0deg) scale(1)";

                card.style.opacity = "1";

            }, 250);

        });

    }, 700);

});

const timer = document.getElementById("countdownTimer");

if(timer){

    function updateCountdown(){

        const now = new Date();

        const tomorrow = new Date();

        tomorrow.setHours(24,0,0,0);

        const diff = tomorrow - now;

        const h = Math.floor(diff/1000/60/60);

        const m = Math.floor(diff/1000/60)%60;

        const s = Math.floor(diff/1000)%60;

        timer.textContent = `${h}h ${m}m ${s}s`;

    }

    updateCountdown();

    setInterval(updateCountdown,1000);

}