using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopVC.Models.DB;
using ShopVC.Models;
using ShopVC.Service;
using Microsoft.AspNetCore.Authorization;

namespace ShopVC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonsController : ControllerBase
    {
        private readonly shopvcContext _context;
        IDGenerator GetHDID;

        public HoaDonsController(shopvcContext context)
        {
            _context = context;
            GetHDID = new IDGenerator(context);
        }


        // GET: api/HoaDons
        [Authorize]
        [HttpGet]
        public IEnumerable<HoaDon> GetHoaDon()
        {
            return _context.HoaDon;
        }

        // GET: api/HoaDons/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHoaDon([FromRoute] string id)
        {
            var hoaDon = await _context.HoaDon.FindAsync(int.Parse(id));

            if (hoaDon == null)
            {
                return NotFound();
            }

            return Ok(hoaDon);
        }

        // PUT: api/HoaDons/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutHoaDon([FromRoute] string id, [FromBody] HoaDon hoaDon)
        //{
          
        //}

        // POST: api/HoaDons
        [Authorize]
        [HttpPost]
        public IActionResult PostHoaDon([FromBody] Checkoutmodel hoaDon)
        {
            int sl = 0;
            HoaDon Hd = new HoaDon
            {
                IdHd = GetHDID.getIDforHD(),
                IdKh = hoaDon.IDkh,
                DiaChi= hoaDon.DiaChi,
                NgayLap = hoaDon.NgayLap,
                TenNguoiNhan = hoaDon.TenNguoiNhan,
                Sodienthoai= hoaDon.SDT,
                TinhTrang= "Dang Xu Ly",
                TongGiaTri= decimal.Parse(hoaDon.TongGiaTri),
                GhiChu = hoaDon.MessfromClient
            };
            var cartItems = _context.CartItems.Where(
                 c => c.CartId == Hd.IdKh.ToString());
            foreach (CartItems items in cartItems)
            {
                sl=sl+1;
                ChiTietHd HDinfo = new ChiTietHd() {
                    IdChitiet = Guid.NewGuid().ToString(),
                    IdHd = Hd.IdHd,
                    IdSp = items.Idsanpham,
                    SoLuongDaMua = items.Quantity,
                    GiaSp = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(items.Idsanpham)).GiaSp,
                    UnitPrice = (float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(items.Idsanpham)).GiaSp) * items.Quantity.Value).ToString(),

                };
                _context.ChiTietHd.Add(HDinfo);
            }
            Hd.TongSlsp = sl;
            _context.HoaDon.Add(Hd);

            var Citems = _context.CartItems.Where(n => n.CartId == Hd.IdKh.ToString());
            if (Citems != null)
            {
                _context.CartItems.RemoveRange(Citems);
            }
            _context.SaveChanges();
            return Ok(Hd.IdHd);
        }

        // DELETE: api/HoaDons/5
        [HttpGet("api/HoaDons/user/{id}")]
        public  IActionResult GetUsrHoaDon([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hoaDon =  _context.HoaDon.Where(n=>n.IdKh== int.Parse(id));
            if (hoaDon == null)
            {
                return NotFound();
            }
            return Ok(hoaDon);
        }

      
    }
}