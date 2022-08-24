function CopyTxt(textPlaceId) {
    if (!textPlaceId) return;


    var copyText = document.getElementById(textPlaceId);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

  
}

function CopiedBt(buttonId) {
    let bt = document.getElementById(buttonId);
    
    bt.classList.replace('btn-primary', 'btn-success');
    bt.innerText = "Copied";

}

function ResetButton(buttonId) {
    
    let bt = document.getElementById(buttonId);
    
    bt.classList.replace('btn-success', 'btn-primary');
    bt.innerHTML = "Copy text";
    
}

async function openfile(){
    let [fileHandle] = await window.showOpenFilePicker();
    let fileData = await fileHandle.getFile();
    let text = await fileData.text();
    document.getElementById('message').value = text;
}

async function saveFile()
{
    let text = document.getElementById("output-content").innerHTML;
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    try
    {
        let fileHandle = await window.showSaveFilePicker();
        let stream = await fileHandle.createWritable();
        
        await stream.write(text);
        await stream.close();
    }
    catch(err){
        console.log(text);
    }
    
}

