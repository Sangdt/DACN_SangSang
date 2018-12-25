using System;
using System.Collections.Generic;

namespace ShopVC.Models.DB
{
    public partial class ChiTietHd
    {
        public string IdChitiet { get; set; }
        public int? IdHd { get; set; }
        public int? IdSp { get; set; }
        public string UnitPrice { get; set; }
        public int? SoLuongDaMua { get; set; }
        public string GiaSp { get; set; }
        public string MaVoucher { get; set; }
        public bool? TinhTrangSd { get; set; }

        public HoaDon IdHdNavigation { get; set; }
        public SanPham IdSpNavigation { get; set; }
    }
}
