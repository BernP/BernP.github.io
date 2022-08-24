import { FindPosition,
    IntArrayToString, 
    LoadData, 
    Print, 
    MakeShufflePositionArr, 
    EncrypLogic, 
    GetRandInt, 
    Average, 
    HashComplex, 
    ConvertCharArrayIntoInt
} from './aux_functions.js';

import {Compress, Unzip} from './compress.js';



function Decrypt() {

   
    let info = new LoadData(false);
    
    info.stringInput = Unzip(info.stringInput);//console.log(info.stringInput);

    //if (info.stringInput[info.stringInput.length - 1] == ' ') info.stringInput = info.stringInput.pop();
    let codeInt = info.stringInput.split(" ");
    //----------------


    let hashKey = [5];
    if (info.salt == "false") for (let z = 0; z < 5; z++) hashKey[z] = HashComplex(String(info.passw + z), info.complexNum);
    else for (let z = 0; z < 5; z++) hashKey[z] = HashComplex(String(info.passw + info.saltChar + z), info.complexNum);

    let i = 0;
    let j = 0;
    let realLenghtOutput = 0;
    let decryptedMsgArray = [];

    let position = MakeShufflePositionArr(hashKey[2], codeInt.length);


    for (let p = 0; p < codeInt.length; p++) {

        if (j >= hashKey[0].length) {
            j = 0;
            hashKey[0] = HashComplex(hashKey[0], 0);
        }
        if (codeInt[FindPosition(position, p)] - (hashKey[0].charAt(j)).charCodeAt(0) >= 0) {
            decryptedMsgArray[realLenghtOutput] = Math.floor((codeInt[FindPosition(position, p)] - (hashKey[0].charAt(j)).charCodeAt(0)));
            realLenghtOutput++;
        }
        if (i >= hashKey[1].length) {
            i = 0;
            hashKey[1] = HashComplex(hashKey[1], 0);
            hashKey[3] = HashComplex(hashKey[3], 0);
        }
        if (hashKey[1][i] >= hashKey[3][i]) {
            p++;
        }
        j++;
        i++;
    }
   

    Print("output-content-label", "The hidden message:", "output-content", IntArrayToString(decryptedMsgArray));
    Print("output-salt-label", "Salt: ", "output-salt", "");

}


function Encrypt() {

    let info = new LoadData(true);
    let hashKey = [5];
    if (info.salt == "false" || info.salt == false) for (let z = 0; z < 5; z++) hashKey[z] = HashComplex(String(info.passw + z), info.complexNum);
    else for (let z = 0; z < 5; z++) hashKey[z] = HashComplex(String(info.passw + info.saltChar + z), info.complexNum);
    
    let averageCharacterInInput = Average(ConvertCharArrayIntoInt(info.stringInput));

    let lowRandom = Math.floor(averageCharacterInInput * 0.8);
    let upperRadom = Math.floor(averageCharacterInInput * 1.2);

    //------------
    let y = 0;
    let rInt;
    let i = 0;
    let criptedMsgArr = [];
    Array.from(info.stringInput).forEach(q => {
        criptedMsgArr[y] = EncrypLogic(q, hashKey[0].charAt(i));


        if ((hashKey[1].charAt(i)).charCodeAt(0) >= (hashKey[3].charAt(i)).charCodeAt(0)) {
            //Put a random number in code
            rInt = GetRandInt(lowRandom, upperRadom);
            y++;
            criptedMsgArr[y] = EncrypLogic(String.fromCharCode(rInt), (hashKey[4].charAt(i)));

        }
        i++;
        y++;
        if (i >= hashKey[0].length) {
            i = 0;

            hashKey[0] = HashComplex(hashKey[0], 0);
            hashKey[1] = HashComplex(hashKey[1], 0);
            hashKey[3] = HashComplex(hashKey[3], 0);
        }
    });
    //----------------------
    let position = MakeShufflePositionArr(hashKey[2], criptedMsgArr.length);
    let auxArray = [criptedMsgArr.length];

    for (let k = 0; k < criptedMsgArr.length; k++) auxArray[k] = criptedMsgArr[position[k]];

    //console.log(Compress(auxArray.join(" ")));
    //----------------------
    //console.log(auxArray.join(" "));
    Print("output-content-label", "Message encrypted:", "output-content",  Compress(auxArray.join(" ")));
    Print("output-salt-label", "Salt: ", "output-salt", info.saltChar);
    return false;



    

}


export { Decrypt, Encrypt };