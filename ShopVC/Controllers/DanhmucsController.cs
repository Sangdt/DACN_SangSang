using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopVC.Models.DB;

namespace ShopVC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhmucsController : ControllerBase
    {
        private readonly shopvcContext _context;

        public DanhmucsController(shopvcContext context)
        {
            _context = context;
        }

        // GET: api/Danhmucs
        [HttpGet]
        public IEnumerable<Danhmuc> GetDanhmuc()
        {
            return _context.Danhmuc;
        }

        // GET: api/Danhmucs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDanhmuc([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var danhmuc = await _context.Danhmuc.FindAsync(id);

            if (danhmuc == null)
            {
                return NotFound();
            }

            return Ok(danhmuc);
        }

        // PUT: api/Danhmucs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDanhmuc([FromRoute] string id, [FromBody] Danhmuc danhmuc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != danhmuc.IdDm)
            {
                return BadRequest();
            }

            _context.Entry(danhmuc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DanhmucExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Danhmucs
        [HttpPost]
        public async Task<IActionResult> PostDanhmuc([FromBody] Danhmuc danhmuc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Danhmuc.Add(danhmuc);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DanhmucExists(danhmuc.IdDm))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDanhmuc", new { id = danhmuc.IdDm }, danhmuc);
        }

        // DELETE: api/Danhmucs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDanhmuc([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var danhmuc = await _context.Danhmuc.FindAsync(id);
            if (danhmuc == null)
            {
                return NotFound();
            }

            _context.Danhmuc.Remove(danhmuc);
            await _context.SaveChangesAsync();

            return Ok(danhmuc);
        }

        private bool DanhmucExists(string id)
        {
            return _context.Danhmuc.Any(e => e.IdDm == id);
        }
    }
}