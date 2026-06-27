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
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/category
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories.ToListAsync();
        return Ok(categories);
    }

    // GET api/category/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    // POST api/category
    [HttpPost]
    public async Task<IActionResult> Create(CategoryDTO dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    // PUT api/category/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CategoryDTO dto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = dto.Name;
        category.Description = dto.Description;

        await _context.SaveChangesAsync();

        return Ok(category);
    }

    // DELETE api/category/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}