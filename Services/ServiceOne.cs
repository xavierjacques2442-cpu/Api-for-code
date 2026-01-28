using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_for_code.Services
{
    public class ServiceOne
    {
    private static readonly Dictionary<string, Dictionary<string, string>> Rules =
        new()
        {
            ["rock"] = new() { ["scissors"] = "Rock crushes Scissors", ["lizard"] = "Rock crushes Lizard" },
            ["paper"] = new() { ["rock"] = "Paper covers Rock", ["spock"] = "Paper disproves Spock" },
            ["scissors"] = new() { ["paper"] = "Scissors cuts Paper", ["lizard"] = "Scissors decapitates Lizard" },
            ["lizard"] = new() { ["paper"] = "Lizard eats Paper", ["spock"] = "Lizard poisons Spock" },
            ["spock"] = new() { ["scissors"] = "Spock smashes Scissors", ["rock"] = "Spock vaporizes Rock" }
        };
    private static readonly List<string> Moves = new(Rules.Keys);
    public static string GetCpuMove()
    {
        var random = new Random();
        return Moves[random.Next(Moves.Count)];
    }
    public static object PlayCpuVsRandomPlayer()
    {
        var random = new Random();
        var playerMove = Moves[random.Next(Moves.Count)];
        var cpuMove = GetCpuMove();

        if (playerMove == cpuMove)
            return new { playerMove, cpuMove, result = "tie", reason = $"Both chose {playerMove}" };

        if (Rules[playerMove].ContainsKey(cpuMove))
            return new { playerMove, cpuMove, result = "lose", reason = Rules[playerMove][cpuMove] };

        return new { playerMove, cpuMove, result = "win", reason = Rules[cpuMove][playerMove] };
    }
}
}