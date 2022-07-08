using System;
using System.Security.Cryptography;
using System.Text;
using System.Linq;
using System.IO;


public class Program
{
    public static void Main()
    {
        Console.WriteLine("=====================================");
        Console.WriteLine("==== Wellcome to the En/Decryptor ===");
        Console.WriteLine("=====================================");

        /**/
        Console.WriteLine("\nLet's start. What you want do?");
        Console.WriteLine("0 - Encrypter //  1 - Decrypter: ");
        string decision = Console.ReadLine();
        Console.Clear();
        Console.WriteLine("All right. Now: ");
        const int BufferSize = 8000;
        Console.SetIn(new StreamReader(Console.OpenStandardInput(), Encoding.UTF8, false, BufferSize));
        Console.WriteLine("Write the message...");
        var msg = Console.ReadLine();
        if (decision != "0") VerifyInput(msg);
        


        //If the input is longer than Console.ReadLine() can accept, the application will end with a erro message. 
        //The input can be transform in 10x longer. So, if the max decrypter is 8000 character, the Encrypter input need to be max 800
        //In most of cases the input message is converted in 5.5 times the original mensage. That means, in general cases, the max input will be 1300.
        //The 800 characters long is a containment for possible errors.

        
        if (((msg.Length > 800) && (decision == "0")) || msg.Length > 8000) ErrorMessage(0);
        
        
        Console.Clear();
        Console.WriteLine("Write the password...");
        var password = Console.ReadLine();
        Console.Clear();
        Console.WriteLine("What complexity do you want?");
        int complex = Int32.Parse(Console.ReadLine());
        Console.Clear();




        if (decision == "0")
        {
            Console.WriteLine("Do you want use salt ? (yes/no)");
            if (Console.ReadLine() == "yes")
            {
                string salt = SaltGerator(4);
                Console.WriteLine(salt);
                Console.WriteLine(string.Join(" ", Encrypter(password, salt, msg, complex)));
            }
            else
            {
                Console.WriteLine(string.Join(" ", Encrypter(password, null, msg, complex)));
            }
        }
        else
        {
            Console.WriteLine("Do you want use salt ? (yes/no)");
            if (Console.ReadLine() == "yes")
            {
                Console.WriteLine("Write your Salt... ");
                string salt = Console.ReadLine();
                Console.Clear();
                Console.WriteLine("Decrypted message:");
                Console.WriteLine(IntArrayToString(Decryptor(password, salt, msg, complex)));
            }
            else
            {
                Console.WriteLine(IntArrayToString(Decryptor(password, null, msg, complex)));
            }


        }

        /*Test function
         * 
         * 
        loopedTeste(5);
        */

        /*How watch the time
         * 
         * 
        var watch = System.Diagnostics.Stopwatch.StartNew();
        watch.Stop();
        var elapsedMs = watch.ElapsedMilliseconds;
        Console.Write("\n Time>"+elapsedMs);
        */
        Console.ReadLine();
    }
    private static void loopedTeste(int loopTimes)
    {
        for (int i = 0; i < loopTimes; i++)
        {
            if (TestAndValidade(25, (int) 800*((i/4)+1), 6+i, i<5?i:i/5) == 1)
            {
                Console.Clear();

            }
            else
            {
                Console.WriteLine("A problem has been detected!");
                break;
            }

        }
        Console.WriteLine("The test has been successfully completed!");
    }


    private  static void ErrorMessage(int erroType)
    {
        //This function print a mensage that informs that a error has occurred, then close the application

        Console.Clear();
        Console.WriteLine("Sorry. Something unexpected occurred and the application need to be close.");
        Console.Write("Erro type: ");

        switch (erroType)
        {
            case 0:
                Console.Write("Input too long.");
                break;
            case 1:
                Console.Write("Input message is not in the correct format - just space and numbers are allowed.");
                break;

        }

        Console.WriteLine("\nPress 'enter' to exit.");
        Console.ReadLine();
        Environment.Exit(-1);
    }

    private static void VerifyInput(string msg_crpt)
    {
        foreach (char c in msg_crpt)
        {
            if ( ( c < 48 && (c != ' '))  || ( c > 57 && (c != ' ')  ) ) ErrorMessage(1);
        }
    }

    private static string RandomMsgToTest(int maxSizeWord)
    {
        //Make a random letter and numbers 10 size string
        //string randomMsg = SaltGerator(maxSizeWord);
        string randomMsg = RandomAnyASCIIString(maxSizeWord);
        Random rnd = new Random();
        int numberR;
        numberR = rnd.Next(1, 5);

        for(int i=0; i< numberR; i++)
        {
            //randomMsg = randomMsg + ' ' + SaltGerator(rnd.Next(1, maxSizeWord)); 
            randomMsg = randomMsg + ' ' + RandomAnyASCIIString(rnd.Next(1, maxSizeWord));
        }
        return randomMsg;
    }
    private static int[] StringToIntArray(string input)
    {
        //Covert a string into a integer array
        //Each character of the string is converted to it ASCII integer
        int[] output = new int[input.Length];
        for (int i = 0; i < input.Length; i++)
        {
            output[i] = input[i];
        }
        return output;
    }

    private static string IntArrayToString(int[] input)
    {
        char[] output = new char[input.Length];
        for (int i = 0; i < input.Length; i++)
        {
            output[i] = (char) input[i];
        }
        return string.Join("", output);
    }

    private static int TestAndValidade(int numberOfTest, int maxSizeWord, int passwordLenght, int complexity)
    {
        string salt;
        string password;
        string msg;
        string encriptedStringMessage;
        int[] decryptedMessage;

        Console.WriteLine($"Numbers of tests: {numberOfTest}");

        for (int i=0; i <numberOfTest; i++)
        {
            salt = SaltGerator(4);
            password = SaltGerator(passwordLenght);
            msg = RandomMsgToTest(maxSizeWord);

            encriptedStringMessage = String.Join(" ", Encrypter(password, salt, msg, complexity));
            decryptedMessage = Decryptor(password, salt, encriptedStringMessage, complexity);
            
            if (StringToIntArray(msg).SequenceEqual(decryptedMessage)) Console.WriteLine($"Test {i}: validated!");
            else
            {
                Console.WriteLine("------------------------------");
                Console.WriteLine($"Test {i}: NOT validated!");
                Console.WriteLine("\n");
                Console.WriteLine("The original message: ");
                Console.WriteLine(msg + "\nLenght: " + msg.Length);
                Console.WriteLine("The decrypted message: ");
                Console.WriteLine(IntArrayToString(decryptedMessage) + "\nLenght: " + decryptedMessage.Length);
                Console.WriteLine("------------------------------");
                return 0;
            }
        }

        return 1;
    }

    private static string RandomAnyASCIIString(int lenght)
    {
        // 
        Random rnd = new Random();
        char[] saltArray = new char[lenght];


        for (int i = 0; i < lenght; i++)
        {
            saltArray[i] = Convert.ToChar(rnd.Next(0, 255));
        }

        return new string(saltArray);


    }

    private static string SaltGerator(int saltLenght)
    {
        // 20% = 0...9 40% = A...Z 40% = a...z
        Random rnd = new Random();
        int numberR;
        char[] saltArray = new char[saltLenght];



        for (int i = 0; i < saltLenght; i++)
        {
            numberR = rnd.Next(1, 5);
            if (numberR == 1) saltArray[i] = Convert.ToChar(rnd.Next(48, 57));
            else if (numberR == 2 || numberR == 3) saltArray[i] = Convert.ToChar(rnd.Next(65, 90));
            else saltArray[i] = Convert.ToChar(rnd.Next(97, 122));
        }

        return new string(saltArray);


    }
    private static string HashComplex(string originalHash, int complexity)
    {
        //This function make the hash over and over again. Making the hash from a hash.
        //The numbers of times that the hash is made is exponecial (10 ^ complexity ---> i < Math.Pow(10, complexity) ).
        //This fuction makes the time to solve the criptografy bigger by the "complexity" input.
        //By this function, the avarege time to a normal 2022 computer solve one small message with a 6 long password and a complexity 5 number is 3200 ms.
        //That means, if a standard six character long password made just with numbers and low/uppercases letters - 62 possible character - have 62^6 possibilities.
        //And with a 4 chacters salt - 62^4 possibilities of salt
        //The time to solve all possible messages - and than solving the criptografy - by brute force is (62^4) x (62^6) x 3200 ms
        //(62^4) x (62^6) x 3200 ms = 2,685,757,970,778,688,716,800 ms = 31,085,161,698,827 days = 85.16 billion years
        //*This calculus don't count the time necessary to validate a solution (increase the time to find a correct solution).
        //*And just considers a linear type of solver. A more efficent solver will try to teste the more commom passwords to down the time needed.



        using (SHA512 sha512Hash = SHA512.Create())
        {
            string hash = originalHash;

            for (int i = 0; i < Math.Pow(10, complexity); i++)
            {
                hash = GetHash(sha512Hash, hash);
            }
            return hash;
        }

    }

    private static int[] Decryptor(string password, string salt, string encriptMessageInput, int complexity)
    {
        using (SHA512 sha512Hash = SHA512.Create())
        {
            if(encriptMessageInput[encriptMessageInput.Length -1] == ' ') encriptMessageInput=  encriptMessageInput.Remove(encriptMessageInput.Length - 1);
            int[] codeInt = Array.ConvertAll(encriptMessageInput.Split(' '), int.Parse);


            string[] hashKey = new string[4];
            for (int z = 0; z < hashKey.Length; z++) hashKey[z] = HashComplex(password + salt + z, complexity);


            int i = 0;
            int j = 0;
            int realLenghtOutput = 0;
            int[] decryptedMsgArray = new int[1];

            int[] position = SuffleArray(hashKey[2], codeInt.Length);


            for (int p = 0; p < codeInt.Length; p++)
            {

                if (j >= hashKey[0].Length)
                {
                    j = 0;
                    hashKey[0] = GetHash(sha512Hash, hashKey[0]);
                }
                if (codeInt[FindPosition(position, p)] - hashKey[0][j] >= 0)
                {
                    decryptedMsgArray[realLenghtOutput] = (int) ((codeInt[FindPosition(position, p)] - hashKey[0][j]));
                    if (p + 1 != codeInt.Length) decryptedMsgArray = copyAndResizeArray(decryptedMsgArray, 1);
                    realLenghtOutput++;
                }
                if (i >= hashKey[1].Length)
                {
                    i = 0;
                    hashKey[1] = GetHash(sha512Hash, hashKey[1]);
                    hashKey[3] = GetHash(sha512Hash, hashKey[3]);
                }
                if (hashKey[1][i] >= hashKey[3][i])
                {
                    p++;
                    if (p+1 == codeInt.Length) decryptedMsgArray = copyAndResizeArray(decryptedMsgArray, -1);
                }
                j++;
                i++;
            }

            return decryptedMsgArray;
        }
    }
    private static int FindPosition(int[] position, int n)
    {
        //Input: a array that contains the position a shuffled array.
        //Exemple, a 3 lenth array: Ar0 = 2 / Ar1 = 0 / Ar2 = 1 --> Will find the first element (0) is in the second position (Ar1)
        int j = 0;
        while (position[j] != n && j < position.Length) j++;
        return j;
    }

    private static int[] ConvertCharArrayIntoInt(string sArray)
    {
        int[] intArray = new int[sArray.Length];
        int j = 0;
        foreach(char c in sArray)
        {
            intArray[j] = (int)c;
            j++;
        }


        return intArray;
    }

    private static int[] copyAndResizeArray(int[] array, int plus)
    {
        int[] auxArray = new int[array.Length + plus];
        
        if(plus > 0)for (int i = 0; i < array.Length; i++) auxArray[i] = array[i];
        else for (int i = 0; i < auxArray.Length; i++) auxArray[i] = array[i];

        return auxArray;
    }
    private static int EncrypLogic(int messageChar, char hashKeyChar)
    {
        return (((messageChar)) + hashKeyChar);
    }


    private static int[] Encrypter(string source, string salt, string msg, int complexity)
    {

        using (SHA512 sha512Hash = SHA512.Create())
        {
            string[] hashKey = new string[5];
            for(int z = 0; z < hashKey.Length; z++) hashKey[z] = HashComplex( source + salt + z, complexity);
            //The tree primary Keys:
            //hashKey[0] = encript the message
            //hashKey[1] = add fake codes on the message 
            //hashKey[2] = shuffle the message
            //=======================================
            //Auxiliary Keys:
            //hashKey[3] = is the parameth that hashKey[1] use to add or not add a fake code in a seted position
            //hashKey[4] = is a parameth used to creat the fake message em hashKey[1]


            //When put a random fake code, this need to be similar to the original for dont highlight the "faker"
            //So, one way of make look like a original is by the avarege: the fake message is something close to the real message.
            //*Note: avarage isnt the best way to do that, medium is probabily better
            int averageCharacterInInput = (int) ConvertCharArrayIntoInt(msg).Average();
            int lowRandom = (int) ( averageCharacterInInput*0.8 );
            int upperRadom = (int)( averageCharacterInInput* 1.2);


            var i = 0;
            int[] criptedMsgArr = new int[1];
            

            var y = 0;
            Random r = new Random();
            int rInt;
            foreach (char q in msg)
            {
                criptedMsgArr[y] = EncrypLogic(q, hashKey[0][i]);

                criptedMsgArr = copyAndResizeArray(criptedMsgArr, 1);

                if (hashKey[1][i] >= hashKey[3][i])
                {
                    //Put a random number in code
                    rInt = r.Next(  lowRandom , upperRadom);
                    criptedMsgArr = copyAndResizeArray(criptedMsgArr, 1);
                    y++;
                    criptedMsgArr[y] = EncrypLogic(rInt, hashKey[4][i]);

                }
                i++;
                y++;
                if (i >= hashKey[0].Length)
                {
                    i = 0;
                    hashKey[0] = GetHash(sha512Hash, hashKey[0]);
                    hashKey[1] = GetHash(sha512Hash, hashKey[1]);
                    hashKey[3] = GetHash(sha512Hash, hashKey[3]);
                }
            }

            criptedMsgArr = copyAndResizeArray(criptedMsgArr, -1);


            //Part n: Shuffle message - use key 2
            int[] position = SuffleArray(hashKey[2], criptedMsgArr.Length);

            int[] auxArray = new int[criptedMsgArr.Length];


            for (int k =0; k < criptedMsgArr.Length; k++) auxArray[k] = criptedMsgArr[position[k]];
            //End part n ----------------------------

            //Print
            PrintInTxtFile(@"encryptedtext.txt", auxArray);

            return auxArray;

        }
    }

    private static void PrintInTxtFile(string path, int[] message)
    {
        using (StreamWriter sw = File.CreateText(path))
        {
            for (int k = 0; k < message.Length; k++)
            {
                sw.Write(message[k]);
                if(k+1 != message.Length) sw.Write(" ");

            }
        }
    }

    private static int[] SuffleArray(string hash, int messageLength)
    {
        int[] suffledA = new int[messageLength];
        int[] auxArray = new int[messageLength];
        
        //The first "for" make a linear int array: Array[0] = 0 ... Array[1] = 1....
        //The Array N will have a relation with their inside
        for (int i = 0; i<messageLength; i++)
        {
            auxArray[i] = i;
        }
        int j = 0;


        //The new position of a element (Ar[n]) in array is hash[n] in a circular way - if hash[n] > array.lengh, will restart the array (that is = hash[n] % array.leght)
        //
        for (int i = 0; i < messageLength; i++)
        {

            if (j == hash.Length) j = 0;
            suffledA[i] = auxArray[((int) hash[j])%(auxArray.Length)];
            auxArray = auxArray.Where(e => e != suffledA[i]).ToArray();
            j++;
            
        }

        return suffledA;

    }

    private static string GetHash(HashAlgorithm hashAlgorithm, string input)
    {

        // Convert the input string to a byte array and compute the hash.
        byte[] data = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(input));

        // Create a new Stringbuilder to collect the bytes
        // and create a string.
        var sBuilder = new StringBuilder();

        // Loop through each byte of the hashed data
        // and format each one as a hexadecimal string.
        for (int i = 0; i < data.Length; i++)
        {
            sBuilder.Append(data[i].ToString("x2"));
        }

        // Return the hexadecimal string.
        return sBuilder.ToString();
    }

}
