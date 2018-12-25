using System;
using System.Collections.Generic;

namespace ShopVC.Models.DB
{
    public partial class Danhmuc
    {
        public Danhmuc()
        {
            SanPham = new HashSet<SanPham>();
        }

        public string IdDm { get; set; }
        public string TenDanhmuc { get; set; }
        public int? IdDml { get; set; }

        public ICollection<SanPham> SanPham { get; set; }
    }
}
