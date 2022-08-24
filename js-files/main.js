import {
    ShowSalt,
    TextBoxSwap,   
    BetweenEncAndDec} from './submenu_tools.js';



//-------------------------------------
//Hide or show salt box
document.getElementById("flexSwitchCheckDefault").addEventListener("click", ShowSalt);

//-------------------------------------


//-------------------------------------
//Encrypter CSS change
document.getElementById("submenu-encrypter").addEventListener('click',function () {
    let p = document.getElementById("submenu-encrypter");
    let saltToDec = document.getElementById("saltDec");
    
    if (p.classList.contains("opacity-50") == true) {
        //Reset Form
        document.getElementById("formEnc").reset();
        if (saltToDec.classList.contains("visible")) {
            saltToDec.classList.replace("visible", "invisible");
            saltToDec.disabled = true;
        }
        //Change button appearance
        p.classList.replace("opacity-50", "opacity-100");
        document.getElementById("submenu-decrypter").classList.replace("opacity-100", "opacity-50");
        //Change form text
        TextBoxSwap();

    }
}); 
//-------------------------------------


//-------------------------------------
//Decrypter CSS change
document.getElementById("submenu-decrypter").addEventListener('click',function () {
    let p = document.getElementById("submenu-decrypter");

    if (p.classList.contains("opacity-50") == true) {
        //Reset Form
        document.getElementById("formEnc").reset();
        //Change button appearance
        p.classList.replace("opacity-50", "opacity-100");
        document.getElementById("submenu-encrypter").classList.replace("opacity-100", "opacity-50");
        //Change form text
        TextBoxSwap();

    }
});
//-------------------------------------


//-------------------------------------


//-------------------------------------
//Form submit
document.getElementById("formEnc").addEventListener('submit', function(){
    if(document.getElementById("message").value == '')
    {
        alert("You forgot to write a message!");
    }
    else{
        try
        {
            BetweenEncAndDec();
            
        }
        catch(err)
        {   
            console.log(err);
            alert("Sorry, something wrong has occurred. Please, try again.");
        }
        
    } 
} );

//-------------------------------------
