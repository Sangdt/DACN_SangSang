using System;
using System.Collections.Generic;

namespace ShopVC.Models.DB
{
    public partial class HoaDon
    {
        public HoaDon()
        {
            ChiTietHd = new HashSet<ChiTietHd>();
            KhachHangReport = new HashSet<KhachHangReport>();
        }

        public int IdHd { get; set; }
        public int? IdKh { get; set; }
        public string TenNguoiNhan { get; set; }
        public int? Sodienthoai { get; set; }
        public string DiaChi { get; set; }
        public string TinhTrang { get; set; }
        public int? TongSlsp { get; set; }
        public DateTime? NgayLap { get; set; }
        public decimal? TongGiaTri { get; set; }
        public string GhiChu { get; set; }

        public Khachhang IdKhNavigation { get; set; }
        public ICollection<ChiTietHd> ChiTietHd { get; set; }
        public ICollection<KhachHangReport> KhachHangReport { get; set; }
    }
}
