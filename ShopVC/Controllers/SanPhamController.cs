using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopVC.Models.DB;
using ShopVC.Models;
namespace ShopVC.Controllers
{
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly shopvcContext _context;
        private List<ProductViewModel> products;
        private ProductViewModel singlepro;
        public SanPhamController(shopvcContext context)
        {
            _context = context;
        }
        // GET: api/SanPhams
        [HttpGet("api/SanPham")]
        public List<ProductViewModel> GetSanPham()
        {
            var items = _context.SanPham.Select(n => n).ToList();
            products = new List<ProductViewModel>();
            foreach (SanPham sp in items)
            {
                if (sp.NgayBd.Value <= DateTime.Now)
                {
                    singlepro = new ProductViewModel
                    {
                        Id = sp.IdSp,
                        Name = sp.TenSp,
                        money = sp.GiaSp,
                        img = sp.AnhSp,
                        Sdate= sp.NgayBd.Value,
                        EndDate = sp.NgayKt.Value,
                    };
                    if (sp.NgayBdKm.HasValue && sp.NgayKtKm.Value > DateTime.Now)
                    {
                        singlepro.Sale = true;
                        singlepro.giaKM = sp.KhuyenMai;
                    }
                    if (sp.FlashDealBd.HasValue && sp.FlashDealKt.Value > DateTime.Now)
                    {
                        singlepro.flashDeal = true;
                        singlepro.giaFlashDeal = sp.GiaFlashDeal;
                    }
                }
                products.Add(singlepro);
            }

            return products;
        }
        [HttpGet("api/SanPham/danhmuc/{id}")]
        public IActionResult GetSanPham([FromRoute] string id)
        {
            if (!_context.Danhmuc.Any(n => n.IdDm == id))
            {
                return BadRequest(id);
            }
            var items = _context.SanPham.Where(n => n.IdDm.Equals(id)).ToList();
            products = new List<ProductViewModel>();
            foreach (SanPham sp in items)
            {

                if (sp.NgayKt >= DateTime.Now)
                {
                    singlepro = new ProductViewModel {
                        Id = sp.IdSp,
                        Name = sp.TenSp,
                        money = sp.GiaSp,
                        img = sp.AnhSp,
                        Sdate = sp.NgayBd.Value,
                        EndDate = sp.NgayKt.Value,
                    };
                    products.Add(singlepro);
                }
            }

            return Ok(products);
        }
        [HttpGet("api/SanPham/deatail/{idSP}")]
        public IActionResult GetDeatailSP(string idSP) 
        {
            int id = int.Parse(idSP);
            if (!_context.SanPham.Any(n => n.IdSp.Equals(id)))
            {
                return BadRequest("why ???");
            }
            var sanphamDetail = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(id));
            return Ok(sanphamDetail);
        }
    }
}