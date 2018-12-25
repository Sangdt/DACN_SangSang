using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopVC.Models
{
    public class OrderDetail
    {
        public string id { get; set; }
        public string img { get; set; }
        public string tenSP { get; set; }
        public string giaSP { get; set; }
        public string soLuong { get; set; }
        public decimal total { get; set; }
    }
}
