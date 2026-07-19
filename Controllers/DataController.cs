using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WalletView.Data;

namespace WalletView.Controllers;

[ApiController]
[Route("api/[controller]")]

public class DataController : AuthenticatedControllerBase
{
    private readonly AppDbContext _context;

    public DataController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/data/csv
    [HttpGet("csv")]
    public async Task<IActionResult> ExportCsv()
    {
        var userId = GetUserId();

        var incomes = await _context.Incomes
            .Where(i => i.UserId == userId)
            .OrderBy(i => i.Date)
            .ToListAsync();

        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.UserId == userId)
            .OrderBy(e => e.Date)
            .ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Tipo,Descricao,Valor,Data,Categoria");

        foreach (var income in incomes)
        {
            csv.AppendLine(string.Join(",",
                "Entrada",
                CsvField(income.Description),
                income.Amount.ToString(CultureInfo.InvariantCulture),
                income.Date.ToString("yyyy-MM-dd"),
                ""));
        }

        foreach (var expense in expenses)
        {
            csv.AppendLine(string.Join(",",
                "Gasto",
                CsvField(expense.Description),
                expense.Amount.ToString(CultureInfo.InvariantCulture),
                expense.Date.ToString("yyyy-MM-dd"),
                CsvField(expense.Category?.Name ?? "")));
        }

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
        var fileName = $"walletview_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
        return File(bytes, "text/csv", fileName);
    }

    private static string CsvField(string value)
    {
        if (string.IsNullOrEmpty(value)) return string.Empty;
        return value.IndexOfAny(new[] { ',', '"', '\n', '\r' }) >= 0
            ? $"\"{value.Replace("\"", "\"\"")}\""
            : value;
    }

    // DELETE api/data/all
    [HttpDelete("all")]
    public async Task<IActionResult> DeleteAll()
    {
        var userId = GetUserId();

        var incomes = _context.Incomes.Where(i => i.UserId == userId);
        var expenses = _context.Expenses.Where(e => e.UserId == userId);

        _context.Incomes.RemoveRange(incomes);
        _context.Expenses.RemoveRange(expenses);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
