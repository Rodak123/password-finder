namespace Brute
{
    public class SingleThreadSolver
    {
        private readonly string pepperStart;
        private readonly string pepperEnd;
        private readonly string chars;
        private readonly bool showProgress;
        private readonly string targetHash;

        public SingleThreadSolver(string targetHash, string chars, string pepperStart, string pepperEnd, bool showProgress)
        {
            this.targetHash = targetHash;
            this.chars = chars;
            this.pepperStart = pepperStart;
            this.pepperEnd = pepperEnd;
            this.showProgress = showProgress;
        }

        public bool Solve(int maxLength, out string fullPassword)
        {
            for (int n = 1; n <= maxLength; n++)
            {
                CharCombinations combinations = new(n, chars.ToCharArray());

                foreach (string combination in combinations)
                {
                    string password = $"{pepperStart}{combination}{pepperEnd}";
                    if (showProgress) Console.WriteLine(combination);

                    string hash = HashGenerator.GenerateHash(password);

                    if (hash == targetHash)
                    {
                        fullPassword = password;
                        return true;
                    }
                }
            }

            fullPassword = string.Empty;
            return false;
        }

    }
}