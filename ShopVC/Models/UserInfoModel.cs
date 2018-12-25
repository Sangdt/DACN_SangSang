using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShopVC.Models.DB;

namespace ShopVC.Models
{
    public class UserInfoModel
    {
        public List<HoaDon> orderinfoItems { get; set; }
        public List<ChiTietHd> orderDeatail { get; set; }
        public Khachhang userInfo { get; set; }
        public UserInfoModel() { }
    }
}
