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
    public class FriendsController : ApiController
    {
        private TravelAppContext db = new TravelAppContext();

        // GET api/Friends
        public async Task<IHttpActionResult> GetFriends(int profileId)
        {
            Profile profile = await db.Profiles.FindAsync(profileId);
            if (profile == null)
            {
                return NotFound();
            }

            return Ok(profile.Friends);
        }

        // GET api/Friends/5
        [ResponseType(typeof(Profile))]
        public async Task<IHttpActionResult> GetFriend(int id)
        {
            Profile profile = await db.Profiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            return Ok(profile);
        }

        // PUT api/Friends/5
        public async Task<IHttpActionResult> PutFriend(int id, Profile profile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != profile.ProfileId)
            {
                return BadRequest();
            }

            db.Entry(profile).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProfileExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Friends
        [ResponseType(typeof(Profile))]
        public async Task<IHttpActionResult> PostFriend(Profile profile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Profiles.Add(profile);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = profile.ProfileId }, profile);
        }

        // DELETE api/Friends/5
        [ResponseType(typeof(Profile))]
        public async Task<IHttpActionResult> DeleteFriend(int id)
        {
            Profile profile = await db.Profiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            db.Profiles.Remove(profile);
            await db.SaveChangesAsync();

            return Ok(profile);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ProfileExists(int id)
        {
            return db.Profiles.Count(e => e.ProfileId == id) > 0;
        }
    }
}