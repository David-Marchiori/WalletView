using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WalletView.Data;
using WalletView.DTOs;
using WalletView.Models;

namespace WalletView.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpenseController : ControllerBase
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
        var expense = new Expense
        {
            Amount = dto.Amount,
            Description = dto.Description,
            Date = dto.Date,
            CategoryId = dto.CategoryId
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ExpenseDTO dto)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

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
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}