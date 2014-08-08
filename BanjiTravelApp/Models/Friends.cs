using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BanjiTravelApp.Models
{
    public class Friends
    {
        [Key]
        [Column(Order = 1)]
        public int UserId1 { get; set; }
        [Key]
        [Column(Order = 2)]
        public int UserId2 { get; set; }
        [ForeignKey("UserId1")]
        public virtual Profile LeftProfile { get; set; }
        [ForeignKey("UserId2")]
        public virtual Profile RightProfile { get; set; }
    }
}