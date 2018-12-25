using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopVC.Models.DB;
using ShopVC.Models;
using System.Globalization;

namespace ShopVC.Controllers
{
   public class CartAdd
    {
        public int id;
        public int quantity;
    }
    [ApiController]
    [Produces("application/json")]

    public class CartController : ControllerBase
    {
        public string ShoppingCartId { get; set; }
        private shopvcContext _context;
        public const string CartSessionKey = "CartId";
        public CartController(shopvcContext context)
        {
            _context = context;
        }
        [HttpPost("api/GioHang/Add")]
        public IActionResult AddtoCart([FromBody]CartAdd add)
        {
            ShoppingCartId = GetCartId();

            var cartItem = _context.CartItems.SingleOrDefault(
                c => c.CartId == ShoppingCartId
                && c.Idsanpham == add.id);
            if (cartItem == null)
            {
                // Create a new cart item if no cart item exists.                 
                cartItem = new CartItems
                {
                    ItemsId = Guid.NewGuid().ToString(),
                    Idsanpham = add.id,
                    CartId = ShoppingCartId,
                    Quantity =add.quantity,
                    DateCreated = DateTime.Now
                };

                _context.CartItems.Add(cartItem);
            }
            else
            {
                // If the item does exist in the cart,                  
                // then add one to the quantity.                 
                cartItem.Quantity = add.quantity;
            }
            _context.SaveChanges();
            return Ok("Added");
        }
        private string GetCartId()
        {
            if (HttpContext.Session.GetString(CartSessionKey) == null)
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    HttpContext.Session.SetString(CartSessionKey, HttpContext.User.Claims.FirstOrDefault(n => n.Type == ClaimTypes.Sid).Value);
                }
                else
                {
                    // Generate a new random GUID using System.Guid class.     
                    Guid tempCartId = Guid.NewGuid();
                    HttpContext.Session.SetString(CartSessionKey, tempCartId.ToString());
                }
            }
            else if (HttpContext.User.Identity.IsAuthenticated && HttpContext.Session.GetString(CartSessionKey) != null)
            {
                HttpContext.Session.SetString(CartSessionKey, HttpContext.User.Claims.FirstOrDefault(n => n.Type == ClaimTypes.Sid).Value);
            }
            return HttpContext.Session.GetString(CartSessionKey);
        }
        [HttpGet("api/Cart")]
        public CartView GetCartItems()
        {
            bool KM = false;
            bool falshD = false;
            ShoppingCartId = GetCartId();
            CartView CartView = new CartView();
            CartView.cartItemsModelViews = new List<CartItemsModelView>();
            var caritems = _context.CartItems.Where(
                 c => c.CartId == ShoppingCartId);
            foreach (CartItems cart in caritems)
            {
                var sp = _context.SanPham.FirstOrDefault(n=>n.IdSp== cart.Idsanpham);
                CartItemsModelView itemoncart = new CartItemsModelView
                {
                    CartID = cart.CartId,
                    Quantity = cart.Quantity.Value,
                    SpId = cart.Idsanpham,
                    ImgLink = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).AnhSp,
                    PricesP = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp,
                    //UnitPrice = float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp) * cart.Quantity.Value,
                    TenSP = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).TenSp,
                };
                if (sp.FlashDealBd.HasValue && sp.FlashDealKt.Value >= DateTime.Now)
                {
                    itemoncart.giaFlashDeal = sp.GiaFlashDeal;
                    itemoncart.flashDeal = true;
                    falshD = true;
                    itemoncart.UnitPrice = float.Parse(itemoncart.giaFlashDeal) * cart.Quantity.Value;
                }else if (sp.NgayBdKm.HasValue && sp.NgayKtKm.Value >= DateTime.Now)
                {
                    itemoncart.giaKM = sp.KhuyenMai;
                    itemoncart.khuyenMai = true;
                    KM = true;
                    itemoncart.ngayKTKhuyenmai = sp.NgayKtKm.Value;
                    itemoncart.UnitPrice = float.Parse(itemoncart.giaKM) * cart.Quantity.Value;

                }
                else
                {
                    itemoncart.UnitPrice = float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp) * cart.Quantity.Value;
                }
                CartView.cartItemsModelViews.Add(itemoncart);
            };
            CartView.total = GetTotal(KM, falshD);
            return CartView;
        }
        private decimal GetTotal(bool KM , bool falshD)
        {
            float rs = 0;
            ShoppingCartId = GetCartId();
            // Multiply product price by quantity of that product to get        
            // the current price for each of those products in the cart.  
            // Sum all product price totals to get the cart total.
            decimal? total = decimal.Zero;
            var Cartitems = _context.CartItems.Where(n => n.CartId == ShoppingCartId).ToList();
            foreach (CartItems items in Cartitems)
            {
                var sp = _context.SanPham.FirstOrDefault(n => n.IdSp == items.Idsanpham);
                if (!string.IsNullOrWhiteSpace(sp.GiaFlashDeal))
                {
                    rs = rs + float.Parse(sp.GiaFlashDeal) * items.Quantity.Value;
                }else if(!string.IsNullOrWhiteSpace(sp.KhuyenMai))
                {
                    rs = rs + float.Parse(sp.KhuyenMai) * items.Quantity.Value;
                }
                else
                {
                    rs = rs + float.Parse(sp.GiaSp) * items.Quantity.Value;
                }
            };
            total = (decimal?)rs;

            //if (KM)
            //{
            //    var Cartitems = _context.CartItems.Where(n => n.CartId == ShoppingCartId).ToList();
            //    foreach (CartItems items in Cartitems)
            //    {
            //        var sp = _context.SanPham.FirstOrDefault(n=>n.IdSp== items.Idsanpham);

            //        total = (decimal?)(rs +float.Parse(sp.KhuyenMai)*items.Quantity.Value);
            //    }
                
            //    //try
            //    //{
            //    //    total = (decimal?)(from cartItems in _context.CartItems
            //    //                       where cartItems.CartId == ShoppingCartId
            //    //                       select (int?)cartItems.Quantity.Value *
            //    //                      float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp == cartItems.Idsanpham).KhuyenMai)).Sum();
            //    //}
            //    //catch (Exception e) { };

            //}
            //else if (falshD)
            //{
            //    var Cartitems = _context.CartItems.Where(n => n.CartId == ShoppingCartId).ToList();
            //    foreach (CartItems items in Cartitems)
            //    {
            //        var sp = _context.SanPham.FirstOrDefault(n => n.IdSp == items.Idsanpham);

            //        total = (decimal?)(rs + float.Parse(sp.GiaFlashDeal) * items.Quantity.Value);
            //    }
            //    //try
            //    //{
            //    //    total =(decimal?)(from cartItems in _context.CartItems
            //    //                           where cartItems.CartId == ShoppingCartId
            //    //                           select (int?)cartItems.Quantity *
            //    //                           float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cartItems.Idsanpham)).GiaFlashDeal)).Sum();
            //    //}
            //    //catch (Exception e) { };
            //}
            //else
            //{
            //    var Cartitems = _context.CartItems.Where(n => n.CartId == ShoppingCartId).ToList();
            //    foreach (CartItems items in Cartitems)
            //    {
            //        var sp = _context.SanPham.FirstOrDefault(n => n.IdSp == items.Idsanpham);

            //        total = (decimal?)(rs + float.Parse(sp.GiaSp) * items.Quantity.Value);
            //    }
            //    //try
            //    //{
            //    //    total = (decimal?)(from cartItems in _context.CartItems
            //    //                       where cartItems.CartId == ShoppingCartId
            //    //                       select (int?)cartItems.Quantity *
            //    //                       float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cartItems.Idsanpham)).GiaSp)).Sum();

            //    //}
            //    //catch (Exception e) { };
            //}
            return total ?? decimal.Zero;
        }

        [HttpGet("api/Cart/delete/{cartID}/{spID}")]
        public IActionResult RemoveItem(string cartID, int spID)
        {
            bool KM = false;
            bool falshD = false;
            var myItem = (from c in _context.CartItems where c.CartId == cartID && c.Idsanpham == spID select c).FirstOrDefault();
            if (myItem != null)
            {
                CartView CartView = new CartView();
                CartView.cartItemsModelViews = new List<CartItemsModelView>();
                _context.CartItems.Remove(myItem);
                _context.SaveChanges();
                var returnitems = _context.CartItems.Where(
                 c => c.CartId == cartID).ToList();
                foreach (CartItems cart in returnitems)
                {
                    var sp = _context.SanPham.FirstOrDefault(n => n.IdSp == cart.Idsanpham);

                    CartItemsModelView itemoncart = new CartItemsModelView
                    {
                        CartID = cart.CartId,
                        Quantity = cart.Quantity.Value,
                        SpId = cart.Idsanpham,
                        ImgLink = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).AnhSp,
                        PricesP = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp,
                        UnitPrice = float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp) * cart.Quantity.Value,
                        TenSP = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).TenSp,
                    };
                    if (sp.FlashDealBd.HasValue && sp.FlashDealKt.Value >= DateTime.Now)
                    {
                        itemoncart.giaFlashDeal = sp.GiaFlashDeal;
                        itemoncart.flashDeal = true;
                        falshD = true;
                        itemoncart.UnitPrice = float.Parse(itemoncart.giaFlashDeal) * cart.Quantity.Value;
                    }
                    else if (sp.NgayBdKm.HasValue && sp.NgayKtKm.Value >= DateTime.Now)
                    {
                        itemoncart.giaKM = sp.KhuyenMai;
                        itemoncart.khuyenMai = true;
                        KM = true;
                        itemoncart.ngayKTKhuyenmai = sp.NgayKtKm.Value;
                        itemoncart.UnitPrice = float.Parse(itemoncart.giaKM) * cart.Quantity.Value;

                    }
                    else
                    {
                        itemoncart.UnitPrice = float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp) * cart.Quantity.Value;
                    }
                    CartView.cartItemsModelViews.Add(itemoncart);
                    CartView.total = GetTotal(KM, falshD);
                };

                if (returnitems.Count <= 0)
                {
                    return Ok("Cart Empty");
                }
                return Ok(CartView);
            }
            return BadRequest("Error");
        }

        [HttpPost("api/Cart/update")]
        public CartView UpdateCartItems([FromBody] CartItemsModelView itemUpdate)
        {
            //ModelState.Remove("TenSP");
            //ModelState.Remove("ImgLink");
            //ModelState.Remove("PricesP");
            //ModelState.Remove("UnitPrice");
            bool KM = false;
            bool falshD = false;
            CartView CartView = new CartView();
            CartView.cartItemsModelViews = new List<CartItemsModelView>();
            var caritems = _context.CartItems.SingleOrDefault(
               c => c.CartId == itemUpdate.CartID && c.Idsanpham == itemUpdate.SpId);
            caritems.Quantity = itemUpdate.Quantity;
            _context.SaveChanges();

            var returnitems = _context.CartItems.Where(
                 c => c.CartId == itemUpdate.CartID).ToList();
            foreach (CartItems cart in returnitems)
            {
                var sp = _context.SanPham.FirstOrDefault(n => n.IdSp == cart.Idsanpham);
                CartItemsModelView itemoncart = new CartItemsModelView
                {
                    CartID = cart.CartId,
                    Quantity = cart.Quantity.Value,
                    SpId = cart.Idsanpham,
                    ImgLink = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).AnhSp,
                    PricesP = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp,
                    //UnitPrice = float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp) * cart.Quantity.Value,
                    TenSP = _context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).TenSp,
                };

                if (sp.FlashDealBd.HasValue && sp.FlashDealKt.Value >= DateTime.Now)
                {
                    itemoncart.giaFlashDeal = sp.GiaFlashDeal;
                    falshD = true;
                    itemoncart.flashDeal = true;
                    itemoncart.UnitPrice = float.Parse(itemoncart.giaFlashDeal) * cart.Quantity.Value;
                }
                else if (sp.NgayBdKm.HasValue && sp.NgayKtKm.Value >= DateTime.Now)
                {
                    itemoncart.giaKM = sp.KhuyenMai;
                    itemoncart.khuyenMai = true;
                    KM = true;
                    itemoncart.ngayKTKhuyenmai = sp.NgayKtKm.Value;
                    itemoncart.UnitPrice = float.Parse(itemoncart.giaKM) * cart.Quantity.Value;

                }
                else
                {
                    itemoncart.UnitPrice = float.Parse(_context.SanPham.FirstOrDefault(n => n.IdSp.Equals(cart.Idsanpham)).GiaSp) * cart.Quantity.Value;
                }
                CartView.cartItemsModelViews.Add(itemoncart);
                CartView.total = GetTotal(KM, falshD);
            };
            return CartView;
        }

        //public void MergeCart(string userID)
        //{
        //    var cartToMerge = _context.CartItems.Where(n => n.CartId.Equals(ShoppingCartId));
        //    foreach(CartItems items in cartToMerge)
        //    {
        //        items.ItemsId = userID;
        //    }
        //    _context.SaveChanges();
        //}
    }
}