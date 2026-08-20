const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

if(password && toggle){

    toggle.addEventListener("click",()=>{

        if(password.type==="password"){

            password.type="text";
            toggle.textContent="🙈";

        }else{

            password.type="password";
            toggle.textContent="👁";
        }

    });

}

function setupPasswordToggle(inputId, toggleId){

    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    if(!input || !toggle) return;

    toggle.addEventListener("click",()=>{

        if(input.type==="password"){

            input.type="text";
            toggle.textContent="🙈";

        }else{

            input.type="password";
            toggle.textContent="👁";
        }

    });

}

setupPasswordToggle("signupPassword","toggleSignupPassword");
setupPasswordToggle("confirmPassword","toggleConfirmPassword");

const loadingText = document.getElementById("loadingText");

if(loadingText){

    setTimeout(()=>{

        loadingText.innerText =
        "Preparing your sacred journey...";

    },1500);

}
/*if(document.querySelector(".success-page")){

    setTimeout(()=>{

        window.location.href="/";

    },3000);

}*/
const successPage = document.querySelector(".success-page");

if(successPage){

    setTimeout(()=>{

        successPage.classList.add("fade-out");

    },2400);

    setTimeout(()=>{

        window.location.href="/dashboard";

    },3000);

}

setupPasswordToggle("resetPassword", "toggleResetPassword");
setupPasswordToggle("confirmResetPassword", "toggleConfirmResetPassword");