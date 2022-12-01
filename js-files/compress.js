/* 
* INITIAL CONSIDERATIONS AND HOW TO USE
* ---------------------------
* Main functions: Compress() and Unzip()
* What this code does: it will compress a number sequence just divided(separeted) by spaces (ascII = 32).
* Can see the compress info writing in this form: Compress("your_squence", {showInfo: true})
* Use examples (the input is a string, not a number):
* Compress("123 124 210 220") -> Valid
* Compress("87 95 1 1213148 111") -> Valid
* Compress("96 97 98 99 100 101", {showInfo: true}) -> Valid
* Compress("123 456 789", {showInfo = true}) -> Invalid
* Compress(123) -> Invalid
* Compress("123.123.431.4213") -> Invalid
*
* This compress was design to recive as input blocks of numbers with size 2 or 3, example: "123 85 92 133 232". But can be
* used with any number size.
* The range of the compress rate will be normally between 47% to 76%.
* The expect compress rate to 2 or 3 number size sequence is between 45%-55%, but in best sceneries can go close to 33%.
* The average rate to others number size (outside 2 and 3) sequence is 68%.
* ---------------------------
*/

/* HOW THE CODE WORKS AND THE LOGIC BEHIND IT
* ---------------------------
* First at all, this code works with abstraction. So, have in mind that somethings that are done has a meaning behind it
* that can be difficult to be perceived. Knowing the AscII table will help to understand what is happening with this 
* compress and can be considered a must in the fulfilling understand of it.
* In short terms, can be said that compress search for duples and trios that match a table reference and convert then to
* a single ascII character. So, for example (isn't the correct table match), can compress the sequence "10" to "a" (50% 
* rate) or  "95_" to "B" (33% rate).
* The match duples are defined by the number that appear in the input sequence that can make the major number of duples in  
* proportion of the others. This number is called "main number". It will be used to unzip the message.
* If isn't any possible match and if it is a number (or isn't space) will not compress, it will be printed as the same char
* - example: a "9" with no match will be printed as a "9". But if there are no match to a space, will be searched for a
* not used index in the Table and print that Table AscII index insted a space (will not compress anything, but that makes 
* isn't spaces in the compressed output - in some cases spaces can be a problem).
* ....

EXAMPLE:
1) Input: "102 120 123" (length = 11)
2) Find the main number: 1
3) Find the duples, trios or the "no match": 10 / 2_ / 12 / 0_ / 12 / 3
4) Map the duples or trios to the correspondent Table index: 10 = 0 / 2_ = 62 / 12 = 2 / 0_ = 60 / 12 = 2 / 3 = "no match"
5) Transform the Table index into the respective Table content: table[0] / table[62] / table[2] /table[60] /table[2] / '3'.charCodeAt(0)
6) Convert to ASCII character: ASCII( table[0] ) / ASCII( table[62] ) / ASCII( table[2] ) / ASCII( table[60] ) / ASCII( table[2] ) / ASCII( '3'.charCodeAt(0) )
7) Create the compress message: "!v%t%3" -> output.length = 6 (54% of input length)
8) Concact the compress message with the main number in the form (mainN + output): "1!v%t%3"
* ---------------------------

TABLE ABSTRACTION REPRESENTACION

Sequence        Table Index   Sum
==============================
mainNumber n      00..09     (10)
mainNumber+1 n    10..19     (20)
mainNumber-1 n    20..29     (30)
------------------------------
9/8 n space       30..49     (50)
------------------------------
n space           50..59     (60)
space n           60..69     (70)

---------------------------
-> TABLE LEGEND:
- Sequence = the possible order of characters that can appear in the input sequence
- Table Index = the position in the table array that respective sequence will be referred
- mainNumber = the number in the sequence that makes the most duples in the table
- n = any number
*/


//==========================================
//              MAIN FUNCTIONS              
//==========================================

function Compress(sequenceS, {showInfo = false} = {})
{
  //To see compress info, write: Compress("your_sequence", {showInfo: true})
  
  let mainNumber = FindMostUsedTuples(sequenceS);

  const zeroAscII = '0'.charCodeAt(0);
  
  let output = [];
  let aux = [];
  let y=0;
  output[y++] = (zeroAscII+mainNumber);
  
  for(let i = 0; i <sequenceS.length; i++)
  {
      if((i+2) < sequenceS.length && IsNineOrEight(sequenceS, i))
      {
          output[y++] = table[(9-parseInt(sequenceS[i]))*10 + parseInt(sequenceS[i+1]) + 30];
          i+=2;

      }
      else if(i+1 < sequenceS.length)
      {
          aux = FindDupleMatch(sequenceS, i, mainNumber);
          output[y++] = aux[0];
          i = i + aux[1];
      }
      else
      {
         output[y++] = NoTuples(sequenceS[i]);
      }
  }
  let result =  ReplaceSpaces(output);


  if(showInfo == true) console.log("Input length: "+ sequenceS.length 
                        + " | Output length: "+ result.length
                        + " | Compress rate: "+ (result.length/sequenceS.length));
  
  return ArrToString(result);
}


function Unzip(stringIn)
{
  const zeroAscII = '0'.charCodeAt(0);
  let mainNumber, space;
  
  if(stringIn[0].charCodeAt(0) >= zeroAscII && stringIn[0].charCodeAt(0) <= (zeroAscII+9))
  { 
    mainNumber = stringIn[0];
    space = ' '.charCodeAt(0);
  }
  else
  {
    mainNumber = stringIn[1];
    space = stringIn[0].charCodeAt(0);
  }

  let output = [];
  let index = 0;
  let charCode;
  let positionInTable;
  let startsRange;
  
  for(let i = ((space==' '.charCodeAt(0))? 1:2); i <stringIn.length; i++)
  {
     charCode = stringIn.charCodeAt(i);
     positionInTable =  FindPosition(charCode);
     startsRange = FindStartsRange(charCode,space);
     switch(true) 
     {
       case (startsRange == 0):
            output[index++]= UnzipDuple( mainNumber, charCode);
            break;
       case (startsRange == 30):
            if(positionInTable < 40)
            {
              output[index++]= '9' + String.fromCharCode((positionInTable - 30) +  zeroAscII) + ' ' ;
            }
            else
            {
              output[index++]= '8' + String.fromCharCode((positionInTable - 40) +  zeroAscII) + ' ';
            }
            break;
       case (startsRange == 50):
            if(positionInTable < 60)
            {
              output[index++] = ' ' + String.fromCharCode((positionInTable - 50) +  zeroAscII);
            }
            else
            {
              output[index++]=   String.fromCharCode((positionInTable - 60) +  zeroAscII)+' ';
            }
            break;
       default:
            output[index++]= ((charCode == space )? (' '):( String.fromCharCode(charCode ) ));
            break;
     }
  }
  return output.join('');
}

//==========================================
//==========================================


//==========================================
//              AUX. FUNCTIONS              
//==========================================

function FindPosition(number)
{
    let i = 0;
    while(number != table[i] && i < table.length-1) i++;
    return i;
}

function FindStartsRange(charCode,space)
{
  /*
  TABLE ABSTRACTION REPRESENTACION

  Sequence        Table_Index   Sum       range   start
  ======================================================
  mainNumber n      00..09     (10)    
  mainNumber+1 n    10..19     (20)      [00..29]   00  
  mainNumber-1 n    20..29     (30)    
  ------------------------------------------------------
  9/8 n space       30..49     (50)      [30..49]   30
  ------------------------------------------------------
  n space           50..59     (60)      [50..69]   50
  space n           60..69     (70)    
  
  */
  let outOfRange = table.length + 1;
  
  if(charCode == space || (charCode>= '0'.charCodeAt(0) && charCode<= '9'.charCodeAt(0))) return outOfRange;
  let charPositionInTable = FindPosition(charCode);
  switch(true) 
  {
      case(charPositionInTable >= 0 && charPositionInTable <= 29):
          return 0;
          break;
      case(charPositionInTable >= 30 && charPositionInTable <= 49):
          return 30;
          break;
      case(charPositionInTable >= 50 && charPositionInTable <= 69):
          return 50;
          break;
      default:
          return outOfRange;
          break;
  }
}

  
function UnzipDuple(mainNumber, charCode)
{ 
   const aux = FindPosition(charCode);
   let output;
   switch(true) 
   {
     case (aux >= 0 && aux <= 9):
       output = String.fromCharCode( parseInt(mainNumber) + 48) + String.fromCharCode( aux + 48);
       break;
     case (aux >= 10 && aux <= 19):
       output = (   (mainNumber==9)?(String.fromCharCode(48))
                              :(String.fromCharCode( parseInt(mainNumber)+1 + 48))   
                ) 
              + String.fromCharCode( aux -10 + 48);
       break;
     case (aux >= 20 && aux <= 29):
       output = (   (mainNumber==0)?(String.fromCharCode(57))
                              :(String.fromCharCode( parseInt(mainNumber)-1 + 48))   
                )
              + String.fromCharCode( aux -20 + 48);
       break;
     default:
       break;
   }
  return output;
}
  
  
  
function ArrToString(arr)
{
  let output = [];

  for(let j = 0; j < arr.length; j++)
  {
    output[j] = String.fromCharCode(arr[j]);
  }
  
  return (output.join('')) ;
}



function NoTuples(e)
{
  const zeroAscII = '0'.charCodeAt(0);
  return ( (e == ' ')? 
                           ((' '.charCodeAt(0)) )
                           :
                           (zeroAscII + parseInt(e) ) 
                          );
  
}
function MakeDuple(e, nextE, mainNumber){
  let output = table[
                                ( parseInt( MakeDupleAux(e, mainNumber) )      )*10 
                                + parseInt(nextE) 
                               ];
  return output;
}

function IsNineOrEight(sequenceS, positionInStr)
{
  if( (parseInt(sequenceS[positionInStr]) == 9 || parseInt(sequenceS[positionInStr]) ==8) &&  sequenceS[positionInStr+2] == ' ')
    return true;
  else return false;
}

function FindDupleMatch(sequenceS, i, mainNumber)
{
  let output = [2];
  if(IsDupleMatch(sequenceS[i], mainNumber) && sequenceS[i+1] != ' ')
          {
            output[0] = MakeDuple(sequenceS[i], sequenceS[i+1], mainNumber);
            output[1] = 1;
          }
          else if(sequenceS[i] == ' ' || sequenceS[i+1] == ' ')
          {
            if( IsDupleMatch(sequenceS[i+1], mainNumber) 
               || IsNineOrEight(sequenceS, i+1) )
            {
                output[0] = NoTuples(sequenceS[i]);
                output[1] = 0;
            }
            else
            {
                
                output[0] = MakeDupleWithSpace(sequenceS[i], sequenceS[i+1]);
                output[1] = 1;
            }
          }
          else
          {
              output[0] = NoTuples(sequenceS[i]);
              output[1] = 0;
          }
  return output;
}

function MakeDupleWithSpace(e, nextE)
{
  return (table[50 + ((e == ' ')?
                                        parseInt(nextE)
                                        :
                                        (parseInt(e) + 10) )]);
}

function IsDupleMatch(intC, mainNumber)
{
  let intI = parseInt(intC);
  if(intI == mainNumber) return true;
  else return ( (mainNumber==0)?
              ((intI == 9 || intI == 1)? 
                true: false)
              :
              ((mainNumber==9)?
                ((intI == 0 || intI == 8)? 
                true:false)
              
              :
               ((intI == mainNumber+1 || intI == mainNumber-1)?
              
              true:false)
              ));
                                  
}

function MakeDupleAux(intC, mainNumber)
{
  let intI = parseInt(intC);
  if(intI == mainNumber) return 0;
  else return ((mainNumber==0) ? 
     ((intI == 9)? (2) : (1))
     :
     ((mainNumber==9)? 
        ((intI == 0)? (1) : (2)) 
        : 
        ((intI == (mainNumber+1))? 1:2)
     ));
    
}


function FindMostUsedTuples(integerS)
{
    let arr = integerS.split(" ");
    let f = [0, 0 ,0, 0, 0, 0, 0, 0, 0, 0];
    let z = [0, 0 ,0, 0, 0, 0, 0, 0, 0, 0];
    // = [0,1,2... 9]
    let aux;
  
    for(let i = 0; i<arr.length; i++)
    {
        for(let j = 0; j < arr[i].length-1; j++)
        {
            f[parseInt(arr[i][j].charAt(0))]++;
        }
    }      
    
    for(let i = 0; i<z.length ; i++)
    {

      if(i==0 || i == (z.length-1)) z[i] = f[i] + (i==0?
                                                   (f[i+1] + f[z.length-1])
                                                   : 
                                                   (f[i-1] + f[0]));
      else z[i] = f[i] + f[i+1] + f[i-1];
    }
    
    let p =0;
    let q = 0;
    while(p<10)
    {
        for(let i = 0; i <z.length;i++)
        {
            if(z[q] >= z[i]) p++;
        }
        if(p != 10)
        {
            p = 0;
            q++;
        } 
    }
    aux = q;
    return aux;

}

function ReplaceSpaces(arr)
{
  let aux  = [...table];
  let j;
  let q;
  let CopyArr = [...arr];
  
  if(arr.length >10)
  {
      let spacePos = [];
      let index = 0;
      for(let i = 0; i < arr.length; i++)
      {
        if(arr[i] == ' '.charCodeAt(0)) spacePos[index++] = i;
      }
      if(index > 0)
      {
        j = 0;
        while(j < aux.length)
        {
            q = 0;
            while(q < arr.length)
            {
              if(arr[q] == aux[j]){break;}
              else q++;
            }
            if(q != arr.length) j++;
            else break;
          
        }
        for(let i = 0; i < spacePos.length; i++)
        {
          CopyArr[spacePos[i]] = aux[j];
        }
        let z = [1];
        z[0] = aux[j];
        CopyArr = (z).concat(CopyArr);
        return CopyArr;
        
      }
      else return arr;
  }
  return arr;
}

const MakeTable = () =>
{
  //The not valid table elements. That AschII characts can break the code
  const exclamation = '!'.charCodeAt(0),
        lastPrintableChar = 127,
        dobleQ = '"'.charCodeAt(0),
        singleQ = "'".charCodeAt(0),
        openPa = '('.charCodeAt(0),
        minus = '-'.charCodeAt(0),
        zero = '0'.charCodeAt(0),
        dollarS = '$'.charCodeAt(0),
        at = '@'.charCodeAt(0),
        openBrac = '['.charCodeAt(0),
        slash = '/'.charCodeAt(0),
        openKey = '{'.charCodeAt(0);
  
  
  
  let outputTable = [];
  let i = 0;
  
  for(let j = exclamation; j < lastPrintableChar; j++)
    {
      if(j == zero) j = at;
      if(j!= dobleQ && 
         j!= singleQ && 
         j!= openPa && 
         j!= minus && 
         j!= dollarS  && j!= openBrac && j!= slash && j!= openKey) outputTable[i++] = j;
    }

  
  
  
  return outputTable;
  
}

//==========================================
//==========================================




//==========================================
//             Global Variables              
//==========================================
const table = MakeTable();

//==========================================
//==========================================

export {Compress, Unzip, table};
