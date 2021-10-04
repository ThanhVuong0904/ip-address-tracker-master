const $ = document.querySelector.bind(document);
const API_KEY = "at_WQJ6qrzmYWIz3A4oBw9EXmCBgAG1Y";
const searchAPI = document.getElementById('search');
const detailList = $(".detail-list");
const btnSearch = $(".button--search");
var locationIcon = L.icon({
     iconUrl: 'images/icon-location.svg',
     iconSize:     [45, 55], // size of the icon
     iconAnchor:   [26.47, 54], // point of the icon which will correspond to marker's location
});
var map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var market = L.marker([0, 0], {icon: locationIcon}).addTo(map);
function download(content, fileName, contentType) {
     var a = document.createElement("a");
     var file = new Blob([content], {type: contentType});
     a.href = URL.createObjectURL(file);
     a.download = fileName;
     a.click();
}
const getData = async(api)=> {
     const response = await fetch(api);
     const data = await response.json();
     return data;
}
const render = (data)=>{
     return (
          `
          <div class="detail-item">
               <h3 class="detail-title">IP Address</h3>
               <h2 class="detail-desc ip-address">${data.ip}</h2>
          </div>
          <div class="detail-item">
               <h3 class="detail-title">Location</h3>
               <h2 class="detail-desc location">${data.location.region}, ${data.location.country} ${data.location.postalCode}</h2>
          </div>
          <div class="detail-item">
               <h3 class="detail-title">Timezone</h3>
               <h2 class="detail-desc time-zone">UTC ${data.location.timezone}</h2>
          </div>
          <div class="detail-item">
               <h3 class="detail-title">ISP</h3>
               <h2 class="detail-desc isp">${data.isp}</h2>
          </div>
          `
     );
}
function ValidateIPaddress(ipaddress) 
{
     if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
     {
          return (true)
     }
     return (false)
}
const runApp = ()=>{
     let API = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}`
     getData(API).then((data)=>{
          map.setView([data.location.lat,data.location.lng]);
          market.setLatLng([data.location.lat,data.location.lng], {icon: locationIcon});
          searchAPI.value = data.ip;
          detailList.innerHTML = render(data);
     })
     searchAPI.addEventListener('change',(e)=>{
          let ipAddress = e.target.value;
          if(ValidateIPaddress(ipAddress)) {
               API = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${ipAddress}`;
          }
          else {
               API = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}`;
               alert("You have entered an invalid IP address!")
          }
          getData(API).then((data)=>{
               map.setView([data.location.lat,data.location.lng]);
               market.setLatLng([data.location.lat,data.location.lng], {icon: locationIcon});
               detailList.innerHTML = render(data);
          })
     })
     btnSearch.addEventListener("click", ()=>{
          if(ValidateIPaddress(searchAPI.value)) {
               API = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${searchAPI.value}`;
          }
          else {
               API = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}`;
               alert("You have entered an invalid IP address!")
          }
          getData(API).then((data)=>{
               map.setView([data.location.lat,data.location.lng]);
               market.setLatLng([data.location.lat,data.location.lng], {icon: locationIcon});
               detailList.innerHTML = render(data);
          })
     })
}
runApp();
