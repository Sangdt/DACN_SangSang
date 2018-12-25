using System;
using System.Collections.Generic;

namespace ShopVC.Models.DB
{
    public partial class SanPham
    {
        public SanPham()
        {
            CartItems = new HashSet<CartItems>();
            ChiTietHd = new HashSet<ChiTietHd>();
        }

        public int IdSp { get; set; }
        public string IdDm { get; set; }
        public string TenSp { get; set; }
        public string AnhSp { get; set; }
        public string GiaSp { get; set; }
        public DateTime? NgayBd { get; set; }
        public DateTime? NgayKt { get; set; }
        public string KhuyenMai { get; set; }
        public DateTime? NgayBdKm { get; set; }
        public DateTime? NgayKtKm { get; set; }
        public string DacDiem { get; set; }
        public string DieuKienSd { get; set; }
        public string ThongTinChiTiet { get; set; }
        public string Hinh1 { get; set; }
        public string Hinh2 { get; set; }
        public string Hinh3 { get; set; }
        public decimal? PhiVanChuyen { get; set; }
        public string IdCreator { get; set; }
        public int? SoLuong { get; set; }
        public DateTime? FlashDealBd { get; set; }
        public DateTime? FlashDealKt { get; set; }
        public string GiaFlashDeal { get; set; }

        public Danhmuc IdDmNavigation { get; set; }
        public ICollection<CartItems> CartItems { get; set; }
        public ICollection<ChiTietHd> ChiTietHd { get; set; }
    }
}
