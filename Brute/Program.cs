using CommandLine;

namespace Brute
{
    public static class Program
    {
        public class Options
        {
            [Value(0, MetaName = "inputhash", Required = true, HelpText = "The input hash to solve.")]
            public string InputHash { get; set; } = string.Empty;

            [Option("PepperStart", Required = false, HelpText = "The input pepper string before input.")]
            public string PepperStart { get; set; } = string.Empty;

            [Option("PepperEnd", Required = false, HelpText = "The input pepper string after input.")]
            public string PepperEnd { get; set; } = string.Empty;

            [Option("MaxLength", Required = false, Default = 2, HelpText = "The maximum length to check.")]
            public int MaxLength { get; set; }

            [Option("IsSilent", Required = false, Default = false, HelpText = "Whether it logs status.")]
            public bool IsSilent { get; set; }

            [Option("ShowProgress", Required = false, Default = false, HelpText = "Whether it logs progress.")]
            public bool ShowProgress { get; set; }

            [Option("MaxThreads", Required = false, Default = 1, HelpText = "How many threads can be spawned.")]
            public int MaxThreads { get; set; }

            [Option("Chars", Required = false, Default = "abcdefghijklmnopqrstuvwxyz0123456789", HelpText = "Which chars are used.")]
            public string Chars { get; set; } = string.Empty;
        }

        private enum ExitCode
        {
            OK = 0,
            InvalidArgs = 1,
            RuntimeException = 2,
            NoSolution = 3,
        }

        private static int Main(string[] args)
        {
            return Parser.Default.ParseArguments<Options>(args)
                .MapResult(
                    App,
                    errors => (int)ExitCode.InvalidArgs);
        }

        private static int App(Options opts)
        {
            if (opts.MaxLength <= 0)
            {
                if (!opts.IsSilent) Console.WriteLine($"Max length argument must be above 0");
                return (int)ExitCode.InvalidArgs;
            }

            if (opts.MaxThreads < 1)
            {
                if (!opts.IsSilent) Console.WriteLine($"Max threads argument must be 1 or more");
                return (int)ExitCode.InvalidArgs;
            }

            if (opts.Chars.Length == 0)
            {
                if (!opts.IsSilent) Console.WriteLine($"Chars must not be empty");
                return (int)ExitCode.InvalidArgs;
            }

            // SingleThreadSolver solver = new(opts.InputHash, opts.Chars, opts.PepperStart, opts.PepperEnd, opts.ShowProgress);
            FastSingleThreadSolver solver = new(opts.InputHash, opts.Chars, opts.PepperStart, opts.PepperEnd, opts.ShowProgress);

            try
            {
                bool solved = solver.Solve(opts.MaxLength, out string fullPassword);

                if (solved)
                {
                    Console.WriteLine(fullPassword);
                    return (int)ExitCode.OK;
                }
                else
                {
                    if (!opts.IsSilent) Console.WriteLine("No solution found");
                    return (int)ExitCode.NoSolution;
                }
            }
            catch (Exception e)
            {
                if (!opts.IsSilent) Console.WriteLine($"Exception: {e.Message}");
                return (int)ExitCode.RuntimeException;
            }
        }
    }
}