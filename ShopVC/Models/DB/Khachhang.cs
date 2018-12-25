using System;
using System.Collections.Generic;

namespace ShopVC.Models.DB
{
    public partial class Khachhang
    {
        public Khachhang()
        {
            HoaDon = new HashSet<HoaDon>();
        }

        public int IdKh { get; set; }
        public string TenKh { get; set; }
        public string MatkhauKhach { get; set; }
        public int? Sdt { get; set; }
        public string Mail { get; set; }
        public string Diachi { get; set; }

        public ICollection<HoaDon> HoaDon { get; set; }
    }
}
