using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using BanjiTravelApp.Models;
using BanjiTravelApp.Context;

namespace BanjiTravelApp.Controllers
{
    public class MarkerController : ApiController
    {
        private TravelAppContext db = new TravelAppContext();

        // GET api/Marker
        public IQueryable<Marker> GetMarkers()
        {
            return db.Markers;
        }

        // GET api/Marker/5
        [ResponseType(typeof(Marker))]
        public IHttpActionResult GetMarker(int id)
        {
            Marker marker = db.Markers.Find(id);
            if (marker == null)
            {
                return NotFound();
            }

            return Ok(marker);
        }

        // PUT api/Marker/5
        public IHttpActionResult PutMarker(int id, Marker marker)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != marker.MarkerId)
            {
                return BadRequest();
            }

            db.Entry(marker).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MarkerExists(id))
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

        // POST api/Marker
        [ResponseType(typeof(Marker))]
        public IHttpActionResult PostMarker(Marker marker)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Markers.Add(marker);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = marker.MarkerId }, marker);
        }

        // DELETE api/Marker/5
        [ResponseType(typeof(Marker))]
        public IHttpActionResult DeleteMarker(int id)
        {
            Marker marker = db.Markers.Find(id);
            if (marker == null)
            {
                return NotFound();
            }

            db.Markers.Remove(marker);
            db.SaveChanges();

            return Ok(marker);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MarkerExists(int id)
        {
            return db.Markers.Count(e => e.MarkerId == id) > 0;
        }
    }
}