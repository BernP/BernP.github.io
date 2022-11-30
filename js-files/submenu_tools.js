import { Decrypt, Encrypt } from './encrypt.js';

import { 
    HashComplex 
} from './aux_functions.js';


function ShowSalt() {

    let saltToDec = document.getElementById("saltDec");

    if (document.getElementById("submenu-decrypter").classList.contains("opacity-100") == true) {
        if (saltToDec.classList.contains("invisible")) {
            saltToDec.classList.replace("invisible", "visible");
            saltToDec.disabled = false;
        }
        else {
            saltToDec.classList.replace("visible", "invisible");
            saltToDec.disabled = true;
        }
    } 
            
}


function TextBoxSwap() {
    let msgLabel = document.getElementById("message-label");
    let msgInput = document.getElementById("message");

    let inEncrypterOrDecrypter = document.getElementById("submenu-encrypter").classList.contains("opacity-100");

    //msgInput.value = '';

    if (inEncrypterOrDecrypter == true) {
        msgLabel.innerHTML = 'Message to be encrypted:';
        msgInput.placeholder = "Write a message here...";

    }
    else {
        msgLabel.innerHTML = 'Code to be decrypted:';
        msgInput.placeholder = "Write a code to be decrypted here...";
    }
}


function BetweenEncAndDec() {
    if(ConfirmTime() == false) {window.location.reload(); return;} 
    else{

        if (document.getElementById("submenu-encrypter").classList.contains("opacity-100") == true) Encrypt();
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

export {
    ShowSalt,
    TextBoxSwap,  
    BetweenEncAndDec};
