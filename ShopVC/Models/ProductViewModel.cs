using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ShopVC.Models
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string IDDM { get; set; }
        public bool Sale { get; set; }
        public bool flashDeal { get; set; }
        public DateTime Sdate { get; set; }
        public DateTime EndDate { get; set; }
        public string img { get; set; }
        public string money { get; set; }
        public string giaFlashDeal { get; set; }
        public string giaKM { get; set; }
        public ProductViewModel() { }
        //Not sure if need ?
        
    }
}
