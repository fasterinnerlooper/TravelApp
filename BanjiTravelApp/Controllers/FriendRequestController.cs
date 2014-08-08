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
    public class FriendRequestController : ApiController
    {
        private TravelAppContext db = new TravelAppContext();

        // GET api/friendrequest/1
        [ResponseType(typeof(ICollection<FriendRequest>))]
        public async Task<IHttpActionResult> GetFriendRequests(string id)
        {
            List<FriendRequest> requests = await db.FriendRequests
                .Where(r => r.ToUser.Username == id)
                .ToListAsync<FriendRequest>();
            if(requests == null) {
                return NotFound();
            }
            return Ok(requests);
        }

        // PUT api/Default1/5
        //public async Task<IHttpActionResult> PutFriendRequest(int id, FriendRequest friendrequest)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != friendrequest.ToUserId)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(friendrequest).State = EntityState.Modified;

        //    try
        //    {
        //        await db.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!FriendRequestExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // POST api/friendrequest
        [ResponseType(typeof(FriendRequest))]
        public async Task<IHttpActionResult> PostFriendRequest(FriendRequest friendrequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<FriendRequest> previousRequests = (from f in db.FriendRequests
                                                    where f.ToUserId == friendrequest.ToUserId
                                                    && f.FromUserId == friendrequest.FromUserId
                                                    select f).ToList();

            if (previousRequests.Count > 0)
            {
                Profile toUser = db.Profiles.Find(friendrequest.ToUserId);
                Profile fromUser = db.Profiles.Find(friendrequest.FromUserId);
                if (toUser.Friends == null)
                    toUser.Friends = new List<Friends>();
                toUser.Friends.Add(new Friends { LeftProfile = toUser, RightProfile = fromUser });
                if (fromUser.Friends == null)
                    fromUser.Friends = new List<Friends>();
                fromUser.Friends.Add(new Friends { LeftProfile = fromUser, RightProfile = toUser });
                db.FriendRequests.RemoveRange(previousRequests);
            }
            else
            {
                db.FriendRequests.Add(friendrequest);
            }

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (FriendRequestExists(friendrequest.ToUserId) || FriendRequestExists(friendrequest.FromUserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = friendrequest.ToUserId }, friendrequest);
        }

        // DELETE api/Default1/5
        [ResponseType(typeof(FriendRequest))]
        public async Task<IHttpActionResult> DeleteFriendRequest(int id)
        {
            FriendRequest friendrequest = await db.FriendRequests.FindAsync(id);
            if (friendrequest == null)
            {
                return NotFound();
            }

            db.FriendRequests.Remove(friendrequest);
            await db.SaveChangesAsync();

            return Ok(friendrequest);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FriendRequestExists(int? id)
        {
            if (id != null)
            {
                return db.FriendRequests.Count(e => e.ToUserId == id) > 0;
            }
            else
            {
                return false;
            }
        }
    }
}