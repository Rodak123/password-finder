using System.Security.Cryptography;
using System.Text;

namespace Brute
{
    public class HashGenerator
    {
        private static readonly SHA256 hash = SHA256.Create();

        public static string GenerateHash(string input)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(input);
            byte[] hashBytes = hash.ComputeHash(bytes);

            string hashString = string.Empty;
            foreach (byte x in hashBytes)
            {
                hashString += string.Format("{0:x2}", x);
            }
            return hashString;
        }
    }
}