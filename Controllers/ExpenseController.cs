using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WalletView.Data;
using WalletView.DTOs;
using WalletView.Models;

namespace WalletView.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ExpenseController : AuthenticatedControllerBase
{
    private readonly AppDbContext _context;

    public ExpenseController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .ToListAsync();
        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var expense = await _context.Expenses
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.Id == id);
        if (expense == null) return NotFound();
        return Ok(expense);
    }

    [HttpPost]

    public async Task<IActionResult> Create(ExpenseDTO dto)
    {
        var userId = GetUserId();
        var expense = new Expense
        {
            Amount = dto.Amount,
            Description = dto.Description,
            Date = dto.Date,
            CategoryId = dto.CategoryId,
            UserId = userId
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ExpenseDTO dto)
    {
        var userId = GetUserId();
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

        if (expense.UserId != userId) return Forbid();

        expense.Amount = dto.Amount;
        expense.Description = dto.Description;
        expense.Date = dto.Date;
        expense.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();
        return Ok(expense);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

        if (expense.UserId != userId) return Forbid();

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
        return NoContent();
    }

        private int GetUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return int.Parse(userIdClaim!.Value);
    }
}