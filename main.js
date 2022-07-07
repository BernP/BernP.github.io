//import { hamburger, navMenu } from './menu.js';
import { textBoxInputAllowed,
    showSalt,
    textBoxSwap, 
    saltRequired, 
    turnOnFstSubmit, 
    betweenEncAndDec} from './submenu_tools.js';



//-------------------------------------
//Hamburger menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {

    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");

})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");

}))
//-------------------------------------




//-------------------------------------
//Hide or show salt box
document.getElementById("saltOn").addEventListener("click", showSalt);
document.getElementById("saltOff").addEventListener("click", showSalt);
//-------------------------------------


//-------------------------------------
//Encrypter CSS change
document.getElementById("sub-menu-encrypter").addEventListener('click',function () {
    let p = document.getElementById("sub-menu-encrypter");
    
    if (p.classList.contains("crypter-swap-button-off") == true) {
        p.classList.replace("crypter-swap-button-off", "crypter-swap-button-on");
        document.getElementById("sub-menu-decrypter").classList.replace("crypter-swap-button-on", "crypter-swap-button-off");
    }
}); 
document.getElementById("sub-menu-encrypter").addEventListener("click", showSalt);
document.getElementById("sub-menu-encrypter").addEventListener("click", textBoxSwap);
//-------------------------------------


//-------------------------------------
//Decrypter CSS change
document.getElementById("sub-menu-decrypter").addEventListener('click',function () {
    let p = document.getElementById("sub-menu-decrypter");

    if (p.classList.contains("crypter-swap-button-off") == true) {
        p.classList.replace("crypter-swap-button-off", "crypter-swap-button-on");
        document.getElementById("sub-menu-encrypter").classList.replace("crypter-swap-button-on", "crypter-swap-button-off");

    }
});
document.getElementById("sub-menu-decrypter").addEventListener("click", showSalt);
document.getElementById("sub-menu-decrypter").addEventListener("click", textBoxSwap);
//-------------------------------------


//-------------------------------------
//Copy button
document.getElementById("copy-button-output").addEventListener("click", copiedButtonCssChange);
document.getElementById("copy-button-output").addEventListener("click", copyText("copy-button-output"));
//-------------------------------------


//-------------------------------------
//Form submit
document.getElementById("formEnc").addEventListener('submit', function(){
    betweenEncAndDec();
} );

//-------------------------------------

//-------------------------------------
document.getElementById("message").addEventListener('keypress', textBoxInputAllowed);
//-------------------------------------