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
    public class TravelPlansController : ApiController
    {
        private TravelAppContext db = new TravelAppContext();

        // GET api/TravelPlans/5
        [ResponseType(typeof(TravelPlan))]
        public async Task<IHttpActionResult> GetTravelPlans(string username, Tenses tense)
        {
            List<TravelPlan> travelPlan = null;
            if (tense == Tenses.Past)
            {
                travelPlan = await (from t in db.TravelPlans
                                    where t.Profile.Username == username
                                    && t.startDate < DateTime.Now
                                    select t).ToListAsync<TravelPlan>();
            }
            if (tense == Tenses.Present)
            {
                travelPlan = await (from t in db.TravelPlans
                                    where t.Profile.Username == username
                                    && t.startDate.Month == DateTime.Now.Month
                                    && t.startDate.Year == DateTime.Now.Year
                                    select t).ToListAsync<TravelPlan>();
            }
            if (tense == Tenses.Present)
            {
                travelPlan = await (from t in db.TravelPlans
                                    where t.Profile.Username == username
                                    && t.startDate > DateTime.Now
                                    select t).ToListAsync<TravelPlan>();
            }
            if (travelPlan == null)
            {
                return NotFound();
            }

            return Ok(travelPlan);
        }

        // PUT api/TravelPlans/5
        public async Task<IHttpActionResult> PutTravelPlan(int id, TravelPlan travelplan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != travelplan.TravelPlanId)
            {
                return BadRequest();
            }

            db.Entry(travelplan).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TravelPlanExists(id))
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

        // POST api/TravelPlans
        [ResponseType(typeof(TravelPlan))]
        public async Task<IHttpActionResult> PostTravelPlan(TravelPlan travelplan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TravelPlans.Add(travelplan);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = travelplan.TravelPlanId }, travelplan);
        }

        // DELETE api/TravelPlans/5
        [ResponseType(typeof(TravelPlan))]
        public async Task<IHttpActionResult> DeleteTravelPlan(int id)
        {
            TravelPlan travelplan = await db.TravelPlans.FindAsync(id);
            if (travelplan == null)
            {
                return NotFound();
            }

            db.TravelPlans.Remove(travelplan);
            await db.SaveChangesAsync();

            return Ok(travelplan);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TravelPlanExists(int id)
        {
            return db.TravelPlans.Count(e => e.TravelPlanId == id) > 0;
        }
    }
}