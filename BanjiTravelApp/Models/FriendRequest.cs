using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BanjiTravelApp.Models
{
    public class FriendRequest
    {
        [Key]
        [Column(Order=1)]
        public int? FromUserId { get; set; }
        [Key]
        [Column(Order=2)]
        public int? ToUserId { get; set; }
        public DateTime requestDateTime { get; set; }
        [ForeignKey("FromUserId")]
        public virtual Profile FromUser { get; set; }
        [ForeignKey("ToUserId")]
        public virtual Profile ToUser { get; set; }
    }
}