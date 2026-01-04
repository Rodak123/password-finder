using System.Security.Cryptography;
using System.Text;

// optimalizace alokaci a rychlosti pomoci gemini.google.com
namespace Brute
{
    public class FastSingleThreadSolver
    {
        private readonly byte[] chars;
        private readonly byte[] targetHash;
        private readonly byte[] pepperStart;
        private readonly byte[] pepperEnd;
        private readonly bool showProgress;

        public FastSingleThreadSolver(string targetHashStr, string chars, string pepperStart, string pepperEnd, bool showProgress)
        {
            targetHash = HexToBytes(targetHashStr);
            this.chars = Encoding.UTF8.GetBytes(chars);
            this.pepperStart = Encoding.UTF8.GetBytes(pepperStart);
            this.pepperEnd = Encoding.UTF8.GetBytes(pepperEnd);
            this.showProgress = showProgress;
        }

        public bool Solve(int maxLength, out string password)
        {
            using var sha = SHA256.Create();

            for (int len = 1; len <= maxLength; len++)
            {
                if (showProgress) Console.WriteLine($"{len}/{maxLength}");
                if (SolveForLength(sha, len, out password))
                {
                    return true;
                }
            }

            password = string.Empty;
            return false;
        }

        private bool SolveForLength(SHA256 sha, int length, out string password)
        {
            // Allocate buffer once: [PepperStart] + [Password] + [PepperEnd]
            int bufferSize = pepperStart.Length + length + pepperEnd.Length;
            byte[] buffer = new byte[bufferSize];

            // Copy static peppers into buffer once
            Array.Copy(pepperStart, 0, buffer, 0, pepperStart.Length);
            Array.Copy(pepperEnd, 0, buffer, pepperStart.Length + length, pepperEnd.Length);

            int[] indices = new int[length];
            int passStartIdx = pepperStart.Length;

            // Initialize password part of buffer with the first char
            for (int i = 0; i < length; i++)
            {
                buffer[passStartIdx + i] = chars[0];
            }

            // reusable hash output buffer
            Span<byte> hashOutput = stackalloc byte[32];

            while (true)
            {
                // if (showProgress) Console.WriteLine(Encoding.UTF8.GetString(buffer));

                // 1. Hash and Compare
                if (sha.TryComputeHash(new ReadOnlySpan<byte>(buffer), hashOutput, out _))
                {
                    if (hashOutput.SequenceEqual(targetHash))
                    {
                        password = Encoding.UTF8.GetString(buffer, passStartIdx, length);
                        return true;
                    }
                }

                // 2. Increment
                int i = length - 1;
                while (i >= 0)
                {
                    indices[i]++;
                    if (indices[i] < chars.Length)
                    {
                        buffer[passStartIdx + i] = chars[indices[i]];
                        break;
                    }
                    else
                    {
                        indices[i] = 0;
                        buffer[passStartIdx + i] = chars[0];
                        i--;
                    }
                }

                if (i < 0) break;
            }

            password = string.Empty;
            return false;
        }

        private static byte[] HexToBytes(string hex)
        {
            byte[] bytes = new byte[hex.Length / 2];
            for (int i = 0; i < hex.Length; i += 2)
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            return bytes;
        }
    }
}