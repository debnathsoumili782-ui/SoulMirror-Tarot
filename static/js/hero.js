const hero = document.querySelector(".hero");
if (hero) {
    for(let i=0;i<180;i++){
        const star=document.createElement("span");
        star.classList.add("star");
        star.style.left=Math.random()*100+"%";
        star.style.top=Math.random()*100+"%";
        star.style.animationDelay=Math.random()*5+"s";
        star.style.animationDuration=2+Math.random()*4+"s";
        hero.appendChild(star);
    }
    for(let i=0;i<40;i++){
        const p=document.createElement("span");
        p.classList.add("particle");
        p.style.left=Math.random()*100+"%";
        p.style.top=Math.random()*100+"%";
        p.style.animationDelay=Math.random()*8+"s";
        hero.appendChild(p);
    }
}