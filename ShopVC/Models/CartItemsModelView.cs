using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopVC.Models
{
    public class CartView
    {
        public List<CartItemsModelView> cartItemsModelViews { get; set; }
        public decimal total { get; set; }
    }
    public class CartItemsModelView
    {
        
        public string TenSP { get; set; }
        public int SpId { get; set; }
        public string CartID { get; set; }

        public string ImgLink { get; set; }
        public int Quantity { get; set; }
        public string giaFlashDeal { get; set; }
        public bool flashDeal { get; set; }
        public bool khuyenMai { get; set; }
        public DateTime ngayKTKhuyenmai { get; set; }
        public string giaKM { get; set; }

        public string PricesP { get; set; }

        public float UnitPrice { get; set; }
        
    }
}
