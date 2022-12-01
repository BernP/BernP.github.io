import { FOODS} from '../data/foodJS.js';
import{ table} from './compress.js';


/*
Disclaimer and initial concepts
1 - This way to mask is the simple way to do it, not the best and have some problems.
The main problem is the way this is implemented, the decryption depends of the database used.
In other words: if the table/database that was used to encrypt change will be impossible to decrypt, 
so, can't update the database for a better one.

2 - How works: knowing the compress use 81 chars, can be map each char to a conjuct of words. So,
for example, can map 'A' --> [orange, bread, water]. So, insted of write a 'A' can be write orange, 
bread or water insted

*/

//===================================
//________  GLOBAL VARIABLES ________
//===================================

//After compress, can be 70(table) + 10(10 number: 0..9) + 1(space in special case) diferents chars in the output
//This number is found in compress.js 
const QUANTITY_OF_CHARS_AFTER_COMPRESSION = 81;
// rateFoodCompress = Number words that can be placed in each char
const RATE_FOOD_COMPRESS = Math.floor(FOODS.length/QUANTITY_OF_CHARS_AFTER_COMPRESSION);
const FOOD_QUANTITY_USED_IN_MASK = QUANTITY_OF_CHARS_AFTER_COMPRESSION*RATE_FOOD_COMPRESS;


//===================================
//__________MAIN FUNCTIONS __________
//===================================


function MaskToShopList(codeCompressed)
{
    let maskedText = "Grocery store list:\n";
    var convertTable = CreateConvertTable();

    var foodsSwapList = CreateSwapTable();
    [...codeCompressed].forEach(c => maskedText+= foodsSwapList[convertTable.findIndex(x => x == c.charCodeAt(0))][Math.floor(Math.random()*RATE_FOOD_COMPRESS)]+", ");
    maskedText = maskedText.substring(0, maskedText.length -2);
    return maskedText;
}

function RevertShopList(shoplist){
    var convertTable = CreateConvertTable();
    var foodsSwapList = CreateSwapTable();
    var revertedShopList = "";
    shoplist = shoplist.substring(20, shoplist.length);
    var shopWords = shoplist.split(", ");

    [...shopWords].forEach(w => revertedShopList += String.fromCharCode(convertTable[FindWord(foodsSwapList, w)]));



    return revertedShopList;
}


//===================================
//_______ AUXILIARY FUNCTIONS _______
//===================================
function FindWord(foodTable, word){
    //Return the index of foodTable(matrix) that word is
    var possibilityPerChar = foodTable[0].length;
    for(let i = 0; i < foodTable.length; i++)
    {
        for(let j = 0; j < possibilityPerChar; j++)
        {
            if(foodTable[i][j] === word){return i;} 
        }
    }
    return -1;
}

function CreateConvertTable(){
    var convertTable = [...table];
    convertTable.push(32);
    for(let q = 0; q < 10; q++) convertTable.push(48+q);
    return convertTable;
}

function CreateSwapTable(){
    let foodsSwapList = [];
    let i = 0;
    var listAux = [];

    //Put 0..9 + space in the table
    var convertTable = [...table];
    convertTable.push(32);
    for(let q = 0; q < 10; q++) convertTable.push(48+q);
    //-------

    while(i < FOOD_QUANTITY_USED_IN_MASK){

        for(let j = 0; j < RATE_FOOD_COMPRESS; j++)
        {
            listAux.push(FOODS[i++]);
        }
        foodsSwapList.push(listAux);
        listAux = [];
    }
    return foodsSwapList;

}


export { MaskToShopList, RevertShopList};