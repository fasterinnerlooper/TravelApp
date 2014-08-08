using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using BanjiTravelApp.Models;
using BanjiTravelApp.Context;
namespace BanjiTravelApp.Controllers
{
    public class ProfileSearchController : ApiController
    {
        private TravelAppContext db = new TravelAppContext();
        // GET api/ProfileSearch
        [ResponseType(typeof(List<Profile>))]
        public async Task<IHttpActionResult> GetProfileSearch(string id)
        {
            List<Profile> profiles = await (from p in db.Profiles
                                            where p.Username.Contains(id)
                                            select p).ToListAsync();

            if (profiles.Count() == 0)
            {
                return NotFound();
            }

            return Ok(profiles);
        }

    }
}
