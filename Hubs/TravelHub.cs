using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;

namespace BanjiTravelApp.Hubs
{
    public class TravelHub : Hub
    {
        public void AddMarker(dynamic lat, dynamic lng)
        {
            Clients.All.successful(lat, lng);
        }
    }
}