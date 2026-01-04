
using System.Collections;
using System.Collections.ObjectModel;

namespace Brute
{
    // chars: [a, b, c]
    /**
    0 aa 00 
    1 ab 01 
    2 ac 02 
    3 ba 10 
    4 bb 11 
    5 bc 12
    6 ca 20
    7 cb 21
    8 cc 22
    */
    public class CharCombinations(int length, char[] chars) : IEnumerator<string>, IEnumerable<string>
    {
        public readonly ReadOnlyCollection<char> AllChars = chars.AsReadOnly();
        public readonly int Length = length > 0 ? length : throw new ArgumentException($"{nameof(length)} must be above zero");
        private readonly int CombinationCount = (int)Math.Pow(chars.Length, length);

        private string GetCombination(int index)
        {
            string combination = string.Empty;
            for (int digit = 0; digit < Length; digit++)
            {
                int charIndex = index / (int)Math.Pow(chars.Length, digit) % chars.Length;
                combination += chars[charIndex];
            }
            return combination;
        }

        private int index = -1;

        object IEnumerator.Current => Current;
        public string Current => GetCombination(index);

        public void Dispose()
        {
            // none
        }

        public bool MoveNext()
        {
            index++;
            if (index < CombinationCount) return true;
            return false;
        }

        public void Reset()
        {
            index = -1;
        }

        public IEnumerator<string> GetEnumerator()
        {
            return this;
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}