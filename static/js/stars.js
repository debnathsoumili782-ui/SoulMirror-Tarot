document.addEventListener("mousemove", function(e){
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const x = (window.innerWidth/2 - e.clientX)/80;
    const y = (window.innerHeight/2 - e.clientY)/80;
    hero.style.backgroundPosition =
        `${50+x}% ${50+y}%`;
});