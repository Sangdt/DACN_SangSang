using System;
using System.Collections.Generic;

namespace ShopVC.Models.DB
{
    public partial class KhachHangReport
    {
        public int IdReport { get; set; }
        public int IdHd { get; set; }
        public string NoiDung { get; set; }

        public HoaDon IdHdNavigation { get; set; }
    }
}
