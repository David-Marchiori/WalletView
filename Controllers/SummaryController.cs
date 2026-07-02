using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WalletView.Data;

namespace WalletView.Controllers;

[ApiController]
[Route("api/[controller]")]

public class SummaryController : AuthenticatedControllerBase
{
    private readonly AppDbContext _context;

    public SummaryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSummary()
    {
        var userId = GetUserId();

        var totalIncome = await _context.Incomes
            .Where(i => i.UserId == userId)
            .SumAsync(i => i.Amount);

        var totalExpenses = await _context.Expenses
            .Where(e => e.UserId == userId)
            .SumAsync(e => e.Amount);

        var balance = totalIncome - totalExpenses;

        return Ok(new
        {
            totalIncome,
            totalExpenses,
            balance
        });
    }
}