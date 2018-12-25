using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ShopVC.Models;
using ShopVC.Models.DB;
using ShopVC.Service;
namespace ShopVC.Controllers
{
    [ApiController]
    [Produces("application/json")]
    public class UserController : ControllerBase
    {
        //CartController merge;
        private readonly shopvcContext _context;
        public UserController(shopvcContext context)
        {
            _context = context;
        }
        private void mergeCart(Khachhang loginedUser)
        {
            string cartid = HttpContext.Session.GetString("CartId");
            var items = _context.CartItems.Where(n => n.CartId.Equals(cartid));
            if (items != null)
            {
                foreach (CartItems cartItems in items)
                {
                    cartItems.CartId = loginedUser.IdKh.ToString();
                }
                _context.SaveChanges();
            }
            HttpContext.Session.SetString("CartId", loginedUser.IdKh.ToString());
        }
        private string setIdentity(Khachhang kh)
        {
            string userinfo = "";
            mergeCart(kh);
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, kh.TenKh),
                    new Claim(ClaimTypes.Email, kh.Mail),
                    new Claim(ClaimTypes.Sid, kh.IdKh.ToString()),
                    new Claim(ClaimTypes.Role,"Khach hang"),
                };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            var props = new AuthenticationProperties();
            props.ExpiresUtc = DateTime.Now.AddDays(5);
            props.IsPersistent = true;
            HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, props).Wait();
            if (!String.IsNullOrEmpty(kh.TenKh))
            {
                userinfo = kh.TenKh;
            }
            var option = new CookieOptions();
            option.Expires = DateTime.Now.AddDays(5);
            option.HttpOnly = false;
            Response.Cookies.Append("SShopVCCookiessID", kh.IdKh.ToString(), option);
            userinfo = kh.Mail;
            return userinfo;
        }
        private Khachhang CheckUser(string name, string pass)
        {
            if (_context.Khachhang.Any(n => n.Mail.Equals(name) && n.MatkhauKhach.Equals(pass)))
            {
                var items = _context.Khachhang.SingleOrDefault(n => n.Mail.Equals(name) && n.MatkhauKhach.Equals(pass));

                return items;
            }
            return null;
        }
        [AllowAnonymous]
        [HttpPost("api/login")]
        public IActionResult Login([FromBody] UserViewModel _user)
        {
            string password = CryptoService.MD5Hash(_user.password);
            var user = CheckUser(_user.Email, password);
            if (user != null)
            {
                string usrInfo = setIdentity(user);
                return Ok(usrInfo);
            }
            return BadRequest();

        }

        [HttpGet("api/logout")]
        public IActionResult Logout()
        {
            if (Request.HttpContext.User.Identity.IsAuthenticated)
            {
                HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                Response.Cookies.Delete("SShopVCCookiessID");
                Response.Cookies.Delete(".AspNetCore.Session");
                return Ok("Logouttttt~~~~");
            }
            return BadRequest("Pls login~~~~!!!");
        }

        [AllowAnonymous]
        [HttpPost("api/register")]
        public IActionResult Register([FromBody]dynamic value)
        {
            string email = value.usrEmail.Value;
            if (!_context.Khachhang.Any(n => n.Mail.Equals(email)))
            {
                IDGenerator getID = new IDGenerator(_context);
                Khachhang usrRegister = new Khachhang
                {
                    IdKh = getID.getIDforKH(),
                    Mail = value.usrEmail.Value,
                    TenKh = value.name.Value,
                    MatkhauKhach = CryptoService.MD5Hash(value.pass.Value)
                };
                _context.Khachhang.Add(usrRegister);
                _context.SaveChanges();
                return Ok(usrRegister);
            }
            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("api/savefblogin")]
        public IActionResult savefblogin([FromBody] FBloginModel fBlogin)
        {
            IDGenerator idgenerator = new IDGenerator(_context);
            var user = _context.Khachhang.FirstOrDefault(n => n.Mail.Equals(fBlogin.email));
            if (user == null)
            {
                Khachhang fb = new Khachhang
                {
                    IdKh = idgenerator.getIDforKH(),
                    Mail = fBlogin.email,
                    TenKh = fBlogin.displayName
                };
                setIdentity(fb);
                _context.Khachhang.Add(fb);
                _context.SaveChanges();
                Response.Cookies.Append("SShopVCCookiessID", fb.IdKh.ToString());

                return Ok();
            }
            else
            {
                setIdentity(user);
            }
            return Ok();
        }

        //xác nhận token từ clientt ?? tối đi nhậu vs Myyyyyyyy
        [Authorize]
        [HttpGet("api/getUserinfo")]
        public IActionResult getUsrinfo()
        {
            UserInfoModel UsrInfo = new UserInfoModel();
            int id = int.Parse(HttpContext.User.Claims.FirstOrDefault(n => n.Type == ClaimTypes.Sid).Value);
            Khachhang userDB = _context.Khachhang.FirstOrDefault(n => n.IdKh.Equals(id));
            UsrInfo.orderinfoItems = _context.HoaDon.Where(n => n.IdKh == userDB.IdKh).ToList();
            UsrInfo.userInfo = userDB;
            var option = new CookieOptions();
            option.Expires = DateTime.Now.AddDays(5);
            option.HttpOnly = false;
            Response.Cookies.Append("SShopVCCookiessID", userDB.IdKh.ToString(), option);
            return Ok(UsrInfo);
        }

        [Authorize]
        [HttpPost("api/getReport")]
        public IActionResult Report(dynamic value)
        {
            int id = Convert.ToInt32(value.idDH.Value);
            string report = value.ReportInfo.Value;
            var items = _context.HoaDon.FirstOrDefault(n=>n.IdHd== id);
            if (items != null) { 
                IDGenerator getID = new IDGenerator(_context);
                KhachHangReport reportInfo = new KhachHangReport {
                    IdHd = items.IdHd,
                    IdReport = getID.getReportID(),
                    NoiDung= report
                };
                _context.KhachHangReport.Add(reportInfo);
                _context.SaveChanges();
            }
            //var items = _context.HoaDon.FirstOrDefault(n => n.IdHd == int.Parse());
            //items.TinhTrang = "Hoan Tat";
            //_context.HoaDon.Update(items);
            //_context.SaveChanges();
            return Ok();
        }
        [Authorize]
        [HttpGet("api/HoanTat/{id}")]
        public IActionResult Complete(string id)
        {
            var items = _context.HoaDon.FirstOrDefault(n=>n.IdHd== int.Parse(id));
            items.TinhTrang = "Hoan Tat";
            _context.HoaDon.Update(items);
            _context.SaveChanges();
            return Ok();
        }
        [Authorize]
        [HttpGet("api/orderDetail/{id}")]
        public IActionResult getOrderDetail(string id)
        {
            List<OrderDetail> orderDetails = new List<OrderDetail>();
            var items = _context.ChiTietHd.Where(n=>n.IdHd==int.Parse(id)).ToList();
            foreach (ChiTietHd details in items)
            {
                OrderDetail order = new OrderDetail {
                    id = details.IdChitiet,
                    tenSP = _context.SanPham.FirstOrDefault(n=>n.IdSp == details.IdSp).TenSp,
                    giaSP = _context.SanPham.FirstOrDefault(n => n.IdSp == details.IdSp).GiaSp,
                    soLuong = details.SoLuongDaMua.ToString(),
                    total = decimal.Parse((details.SoLuongDaMua * float.Parse( _context.SanPham.FirstOrDefault(n => n.IdSp == details.IdSp).GiaSp)).ToString()),
                    img = _context.SanPham.FirstOrDefault(n => n.IdSp == details.IdSp).AnhSp
                };
                orderDetails.Add(order);
            }
            return Ok(orderDetails);
        }

        [Authorize]
        [HttpPost("api/updateKHInfo")]
        public IActionResult UpdateKH([FromBody]dynamic value)
        {
            int id = Convert.ToInt32(value.idKH.Value);
            var items = _context.Khachhang.FirstOrDefault(n => n.IdKh == id);
            items.Mail = value.email.Value;
            items.TenKh = value.tenKH.Value;
            items.Sdt = int.Parse(value.sdt.Value);
            items.Diachi = value.diachi.Value;
            _context.Khachhang.Update(items);
            _context.SaveChanges();
            return Ok(items);
        }

        [Authorize]
        [HttpPost("api/updateInfo")]
        public IActionResult Update([FromBody]dynamic value)
        {
            int id = Convert.ToInt32(value.idKH.Value);
            var items = _context.Khachhang.FirstOrDefault(n => n.IdKh == id);
            items.Mail = value.email.Value;
            items.TenKh = value.tenKH.Value;
            _context.Khachhang.Update(items);
            _context.SaveChanges();
            return Ok(items);
        }
        [Authorize]
        [HttpPost("api/updatePass")]
        public IActionResult Updatepass([FromBody]dynamic value)
        {
            int id = Convert.ToInt32(value.idKH.Value);
            var items = _context.Khachhang.FirstOrDefault(n => n.IdKh == id);
            items.MatkhauKhach = CryptoService.MD5Hash(value.pass.Value);
            _context.Khachhang.Update(items);
            _context.SaveChanges();
            return Ok(items);
        }
    }
}