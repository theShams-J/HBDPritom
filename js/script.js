/* ==========================================
   MAIN SCRIPT
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const beginBtn = document.getElementById("beginBtn");
const landing = document.getElementById("landing");
const website = document.getElementById("website");

const bgMusic = document.getElementById("bgMusic");
const birthdayMusic = document.getElementById("birthdayMusic");

const surpriseBtn = document.getElementById("surpriseBtn");

const cakeScreen = document.getElementById("cakeScreen");

const celebration = document.getElementById("celebration");

const closeCelebration =
    document.getElementById("closeCelebration");

const flame =
    document.getElementById("flame");

const fallbackBtn =
    document.getElementById("fallbackBtn");



/* ==========================================
   START WEBSITE
========================================== */

beginBtn.addEventListener("click", () => {

    landing.classList.add("hide");

    setTimeout(() => {

        website.classList.add("show");

        history.pushState(
            {
                page: "main"
            },
            "",
            "#main"
        );

    }, 800);

    bgMusic.volume = .35;

    bgMusic.play().catch(() => {

        console.log("Audio blocked until interaction");

    });

});



/* ==========================================
   OPEN CAKE
========================================== */

surpriseBtn.addEventListener("click", () => {

    resetCake();

    cakeScreen.classList.add("show");

    surpriseBtn.disabled = true;

    history.pushState(
        {
            page: "cake"
        },
        "",
        "#cake"
    );

});



/* ==========================================
   BLOW CANDLE
========================================== */

function blowCandle() {

    if (flame.classList.contains("off")) {

        return;

    }

    flame.classList.add("off");

    setTimeout(() => {

        cakeScreen.classList.remove("show");

        celebration.classList.add("show");

        history.pushState(
            {
                page: "celebration"
            },
            "",
            "#celebration"
        );

        bgMusic.pause();

        birthdayMusic.currentTime = 0;
        birthdayMusic.volume = .5;

        birthdayMusic.play().catch(() => { });

        startConfetti();

    }, 1500);

}



/* ==========================================
   TAP CANDLE
========================================== */

fallbackBtn.addEventListener("click", blowCandle);



/* ==========================================
   CLOSE CELEBRATION
========================================== */

closeCelebration.addEventListener("click", () => {

    birthdayMusic.pause();

    birthdayMusic.currentTime = 0;

    history.back();

});



/* ==========================================
   MOBILE BACK BUTTON
========================================== */

window.addEventListener("popstate", (event) => {

    celebration.classList.remove("show");

    cakeScreen.classList.remove("show");

    if (event.state?.page === "cake") {

        cakeScreen.classList.add("show");

        resetCake();

    }

    else if (event.state?.page === "main") {

        surpriseBtn.disabled = false;

        bgMusic.play().catch(() => { });

        website.classList.add("show");

    }

});



/* ==========================================
   CONFETTI
========================================== */

function startConfetti() {

    if (typeof confetti === "undefined") return;

    const duration = 8000;

    const end = Date.now() + duration;

    (function frame() {

        confetti({

            particleCount: 4,

            startVelocity: 30,

            spread: 360,

            ticks: 120,

            origin: {

                x: Math.random(),

                y: -0.1

            }

        });

        if (Date.now() < end) {

            requestAnimationFrame(frame);

        }

    })();

}



/* ==========================================
   RESET CAKE
========================================== */

function resetCake() {

    flame.classList.remove("off");

    if (typeof isBlown !== "undefined") {

        isBlown = false;

    }

    if (typeof micStarted !== "undefined") {

        micStarted = false;

    }

    if (typeof startMicrophone === "function") {

        startMicrophone();

    }

}