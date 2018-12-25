using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ShopVC.Models.DB;
namespace ShopVC.Service
{
    public class IDGenerator
    {
        private  readonly shopvcContext _context;
        public IDGenerator(shopvcContext context)
        {
            _context = context;
        }
        public int getIDforKH()
        {
            Random RandNum = new Random();
            int RandomNumber = 0;
            do
            {
                RandomNumber = RandNum.Next(1000, 9999);
            } while (!checkUsrID(RandomNumber));

            return RandomNumber;

        }
        public int getIDforHD()
        {
            Random RandNum = new Random();
            int RandomNumber = 0;
            do
            {
                RandomNumber = RandNum.Next(1000, 9999);
            } while (!checkHoaDonID(RandomNumber));

            return RandomNumber;

        }
        public int getReportID()
        {
            Random RandNum = new Random();
            int RandomNumber = 0;
            do
            {
                RandomNumber = RandNum.Next(1000, 9999);
            } while (!checkReportID(RandomNumber));

            return RandomNumber;

        }
        private bool checkReportID(int id)
        {
            if (_context.KhachHangReport.Any(n => n.IdReport == id) && id.Equals(0) || (_context.Khachhang.Any(n => n.IdKh.Equals(id))) || _context.Khachhang.Any(n => n.IdKh.Equals(id)))
                return false;
            return true;
        }
        private bool checkUsrID(int id)
        {
            if (_context.HoaDon.Any(n => n.IdHd.Equals(id)) && id.Equals(0) || _context.Khachhang.Any(n => n.IdKh.Equals(id)) && id.Equals(0))
                return false;
            return true;
        }
        private bool checkHoaDonID(int id)
        {
            if (_context.HoaDon.Any(n => n.IdHd.Equals(id)) && id.Equals(0)|| _context.Khachhang.Any(n => n.IdKh.Equals(id)) && id.Equals(0))
                return false;
            return true;
        }

    }
}
