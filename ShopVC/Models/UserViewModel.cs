using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel;
using Newtonsoft.Json;

namespace ShopVC.Models
{
    public class FBloginModel
    {
        public string email { get; set; }
        public string displayName { get; set; }

    }
    public class UserViewModel
    {
        [JsonIgnore]
        public string name { get; set; }
        [JsonIgnore]
        public int id { get; set; }
        public string Email { get; set; }
        public string password { get; set; }
    }
}
