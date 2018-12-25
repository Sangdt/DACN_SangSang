using System;
using System.Collections.Generic;

namespace ShopVC.Models.DB
{
    public partial class CartItems
    {
        public string ItemsId { get; set; }
        public string CartId { get; set; }
        public int? Quantity { get; set; }
        public DateTime? DateCreated { get; set; }
        public int Idsanpham { get; set; }

        public SanPham IdsanphamNavigation { get; set; }
    }
}
