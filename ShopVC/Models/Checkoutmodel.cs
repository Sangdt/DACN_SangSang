using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopVC.Models
{
    public class Checkoutmodel
    {
        public int IDkh { get; set; }
        public string TenNguoiNhan { get; set; }
        public string DiaChi { get; set; }
        public DateTime NgayLap { get; set; }
        public string TongGiaTri { get; set; }
        public int SDT { get; set; }
        public string MessfromClient { get; set; }
        public Checkoutmodel() { }
    }
}
