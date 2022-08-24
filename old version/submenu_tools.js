import { Decrypt, Encrypt } from './encrypt.js';

import { 
    HashComplex 
} from './aux_functions.js';


function ShowSalt() {
    //true = in decrypter (salt box just needed in decrypter)
    //false = in encrypter
    let saltToDec = document.getElementById("saltDec");

    if (
        document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-on") == true
        ||
        document.querySelector('input[name="salt"]:checked').value == "false"
        ) {

        saltToDec.disabled = true;
        saltToDec.classList.replace("saltShowed", "saltNotShowed");
        
        }
    else {
        

        saltToDec.disabled = false;
        SaltRequired();
        saltToDec.classList.replace("saltNotShowed", "saltShowed");
    }
}


function TextBoxSwap() {
    let msgLabel = document.getElementById("message-label");
    let msgInput = document.getElementById("message");

    let inEncrypterOrDecrypter = document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-on");

    msgInput.value = '';

    if (inEncrypterOrDecrypter == true) {
        msgLabel.innerHTML = 'Message to be encrypted:';
        msgInput.placeholder = "Write a message here...";

    }
    else {
        msgLabel.innerHTML = 'Code to be decrypted:';
        msgInput.placeholder = "Write a code to be decrypted here (just numbers and space)...";
    }
}



function SaltRequired() {
    let salt = document.querySelector('input[name="salt"]:checked').value;
    let saltToDec = document.getElementById("saltDec");
    if (salt == "true") {
        saltToDec.disabled = false;
        saltToDec.setAttribute('required', '');
    }
    else {
        saltToDec.disabled = true;
        saltToDec.removeAttribute('required');
    }
    if (document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-off") == true) saltToDec.removeAttribute('required');
}

function TurnOutputOn() {
    let outputSalt = document.getElementById("output-salt");

    outputSalt.classList.add("output-after-submit-style");
    outputSalt.disabled = false;

    document.getElementById("output-message").classList.add("output-after-submit-style");
    document.getElementById("output-message").disabled = false;

    let copyOutp = document.getElementById("copy-button-output");
    copyOutp.classList.add("output-after-submit-style");
    copyOutp.disabled = false;

    
    let copySalt = document.getElementById("copy-button-salt");
    copySalt.classList.add("output-after-submit-style");
    copySalt.disabled = false;
    
    let lSalt = document.getElementById("output-l-salt");
    lSalt.classList.add("output-after-submit-style");
    lSalt.disabled = false;

    let q = document.getElementById("output-salt-container");
    q.classList.add("output-after-submit-style");
    q.classList.add("output-conteiner");
    q.disabled = false;


    let c = document.getElementById("initial-hided-container");
    c.classList.replace("hided", "not-hided");

    

    
}

function BetweenEncAndDec() {
    if(ConfirmTime() == false) return;
    else{
        SetLoadTime();
        TurnOutputOn();
        if (document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-on") == true) Encrypt();
        else Decrypt();
        return false;
    }
    
}

function TimeToEnd(){
    let numb = document.getElementById('complexity').value;

    let test1 = performance.now();
    for(let i = 0; i < 5; i++)
        {
            HashComplex("timeCounter", 3);
        }
        
        let avrgS;
        let avrgE;
        const quantity = 3;

        

        let high = 0;
        for(let i = 0; i<quantity; i++)
        {
            avrgS =  performance.now();
            HashComplex("timeCounter", 3);
            avrgE  =  performance.now();
            if(avrgE - avrgS > high) high = avrgE - avrgS;
        }

        let probTimeOut = 5*(10**(numb-3))*high;
        probTimeOut /= 1000;
        
        return (probTimeOut);
    
    
}
function Checker(time, unit){
    var result = confirm("This will take nearly " + Math.round(time) + unit + " to be done.\nAre you sure to proceed?");
    return result;

}
function ConfirmTime(){
    var time = TimeToEnd();
    let secInMin = 60;
    let secInHour = 3600;
    let secInDay = 86400;

    if(time >= 1){
        if(time < secInMin)
        {
            return Checker(time, " second(s)");
        }
        else if(time>= secInMin && time < secInHour)
        {
            time /= secInMin;
            return Checker(time, " minute(s)");
        }
        else if(time>= secInHour && time < secInDay){
            time /= secInHour;
            return Checker(time, " hour(s)");

        }
        else{
            time /= secInDay;
            return Checker(time, " day(s)");
        }
    }
}
function SetLoadTime(){
  
    let progressBar = document.querySelector('.load-bar');
    progressBar.setAttribute('id', 'play-animation');
    let animationLoad = document.getElementById("play-animation");
    
    let stringTime =  String('progress-anim '+ TimeToEnd()+'s' + ' forwards');
    animationLoad.style.animation = stringTime;
    
}

export {
    ShowSalt,
    TextBoxSwap, 
    SaltRequired, 
    TurnOutputOn, 
    BetweenEncAndDec};
