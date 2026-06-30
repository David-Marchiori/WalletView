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
public class IncomeController : ControllerBase
{
    private readonly AppDbContext _context;

    public IncomeController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return int.Parse(userIdClaim!.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var incomes = await _context.Incomes
            .Where(i => i.UserId == userId)
            .ToListAsync();
        return Ok(incomes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();
        var income = await _context.Incomes
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (income == null) return NotFound();
        return Ok(income);
    }

    [HttpPost]
    public async Task<IActionResult> Create(IncomeDTO dto)
    {
        var income = new Income
        {
            Amount = dto.Amount,
            Description = dto.Description,
            Date = dto.Date,
            UserId = GetUserId()
        };

        _context.Incomes.Add(income);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = income.Id }, income);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, IncomeDTO dto)
    {
        var userId = GetUserId();
        var income = await _context.Incomes
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (income == null) return NotFound();

        income.Amount = dto.Amount;
        income.Description = dto.Description;
        income.Date = dto.Date;

        await _context.SaveChangesAsync();
        return Ok(income);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var income = await _context.Incomes
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (income == null) return NotFound();

        _context.Incomes.Remove(income);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}