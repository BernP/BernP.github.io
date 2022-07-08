function TextAllowed(event) {
    if (document.getElementById("sub-menu-encrypter").classList.contains("crypter-swap-button-on") == true) return true;
    else if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 32) return true;
    else return false;
}
function CopyTxt(textPlaceId) {
    if (!textPlaceId) return;
    let text = document.getElementById(textPlaceId).innerHTML;

    let inputElem = document.createElement('input');
    inputElem.setAttribute('value', text);
    document.body.appendChild(inputElem);
    inputElem.select();

    document.execCommand('copy');

    inputElem.parentNode.removeChild(inputElem);
  
}

function CopiedBt(buttonId) {
    let bt = document.getElementById(buttonId);
    if (!bt.classList.contains('copied-button')) bt.classList.add('copied-button');

    bt.innerText = "Copied";

}

function ResetButton(buttonId) {
    
    let bt = document.getElementById(buttonId);
    let p = document.getElementById("initial-hided-container");

    if(!p.classList.contains('hided')){
        if (bt.classList.contains('copied-button')) bt.classList.remove('copied-button');
        if (bt.classList.contains('output-box-start-style')) bt.classList.remove('output-box-start-style');
        bt.innerText = " Copy ";
    }
    
}


