//var server_name = "server.maz:8080";
//var directory   = "/proxyret2";

var server_name = "78.218.16.117:8080";
var directory   = "";

/***
**leaflet
***/
var map = L.map("map").setView([48.856578, 2.351828], 10);

var layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

var mylat, mylon;

var layerMarkers = [];

document.getElementById("companieSearchShow").addEventListener("click", getCompanies);
document.getElementById("advertisementSearchShow").addEventListener("click", getAdvertisements);
document.getElementById("removeMarker").addEventListener("click", removeMarker);
document.getElementById("locateMe").addEventListener("click", locateMe);

//Companies
function getCompanies(event){
  var distance = document.getElementById('distance').value;
  var activity = document.getElementById('activity').value;

  waitingDialog.show("Recherche en cours... Veuillez patienter.");

  // création de l'objet xhr
  var ajax = new XMLHttpRequest();

  var uri_query = "http://" + server_name + directory + "/api.php?format=json&type=companies&distance=" + distance + "&activity=" + activity + "&lat=" + mylat + "&lon=" + mylon;

  console.log(uri_query);

  // destination et type de la requête AJAX (asynchrone ou non)
  ajax.open("GET", uri_query, true);

  // métadonnées de la requête AJAX
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  // evenement de changement d'état de la requête
  ajax.addEventListener("readystatechange", function(e) {

    // si l'état est le numéro 4 et que la ressource est trouvée
    if (ajax.readyState == 4 && ajax.status == 200) {
      // le texte de la réponse
      var result = JSON.parse(ajax.responseText);

      console.log("Number of companies : " + result.companies.length);

      addCompany2Result(result.companies);

      if (result.companies.length > 0) {
        var liste = "";
        for (var i = 0; i < result.companies.length; i++) {
          var siret = result.companies[i].siren + result.companies[i].nic;
          addMarker(result.companies[i].lat, result.companies[i].lon,
          "<strong>Nom : </strong>" + result.companies[i].nomen_long + "<br>" +
          "<strong>Activité : </strong>" + result.companies[i].libapet + "<br>" +
          //"<strong>Distance : </strong>" + Math.round(result.companies[i].distance / 6e-06) + " m " +
          "<strong>Distance : </strong>" + result.companies[i].distance + " m " +
          "<a href='http://map.project-osrm.org/?z=14&center="+ mylat + "," + mylon + "&loc="+ mylat +"," + mylon + "&loc=" + result.companies[i].lat + "," + result.companies[i].lon + "&hl=en&alt=0' target='_blank'>Y aller</a>");
        }
      } else {
        console.log("No result !");
      }
      waitingDialog.hide();
    }
  });
  // envoi de la requête
  ajax.send();
}

//Annonces
function getAdvertisements(event){
  var distance = document.getElementById('distance').value;
  var category = document.getElementById('category').value;

  waitingDialog.show("Recherche en cours... Veuillez patienter.");

  // création de l'objet xhr
  var ajax = new XMLHttpRequest();

  var uri_query = "http://" + server_name + directory + "/api.php?format=json&type=advertisements&distance=" + distance + "&category=" + category + "&lat=" + mylat + "&lon=" + mylon;

  console.log(uri_query);

  // destination et type de la requête AJAX (asynchrone ou non)
  ajax.open("GET", uri_query, true);

  // métadonnées de la requête AJAX
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  // evenement de changement d'état de la requête
  ajax.addEventListener("readystatechange", function(e) {

    // si l'état est le numéro 4 et que la ressource est trouvée
    if (ajax.readyState == 4 && ajax.status == 200) {
      // le texte de la réponse
      var result = JSON.parse(ajax.responseText);

      console.log("Number of advertisements : " + result.advertisements.length);

      addAdvertisement2Result(result.advertisements);

      if (result.advertisements.length > 0) {
        var liste = "";
        for (var i = 0; i < result.advertisements.length; i++) {
          addMarker(result.advertisements[i].lat, result.advertisements[i].lon,
            "<strong>Pseudo : </strong>" + result.advertisements[i].pseudo + "<br>" +
            "<strong>Designation : </strong>" + result.advertisements[i].designation + "<br>" +
            "<strong>Titre : </strong>" + result.advertisements[i].titre + "<br>" +
            "<strong>Distance : </strong>" + Math.round(result.advertisements[i].distance / 6e-06) + " m " +
            "<a href='http://map.project-osrm.org/?z=14&center="+ mylat + "," + mylon + "&loc="+ mylat +"," + mylon + "&loc=" + result.advertisements[i].lat + "," + result.advertisements[i].lon + "&hl=en&alt=0' target='_blank'>Y aller</a>");
        }
      } else {
        console.log("No result !");
      }
      waitingDialog.hide();
    }
  });
  // envoi de la requête
  ajax.send();
}

function addMarker(lat, long, label) {
  var marker = L.marker([lat, long]);
  layerMarkers.push(marker);
  marker.addTo(map).bindPopup(label);

  mapSetView(lat, long, 14);
}

function removeMarker(event){
  removeLayer(layerMarkers);
}

function removeLayer(layerName) {
  if (layerName !== undefined && layerName.length > 0) {
    for (var i = 0; i < layerName.length; i++) {
      layerName[i].remove();
    }
  }
}

function mapSetView(lat, long, zoom) {
  if (zoom === undefined) {
    zoom = 10;
  }
  map.setView([lat, long], zoom);
}

function setPosition(latitude, longitude){
  mylat = latitude;
  mylon = longitude;
}

//Locate Me
function locateMe(event) {
  console.log("Function locateMe");
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log("lat/lng : " + position.coords.latitude + ", " + position.coords.longitude);
    setPosition(position.coords.latitude, position.coords.longitude);
    addMarker(position.coords.latitude, position.coords.longitude, "Me");
    mapSetView(position.coords.latitude, position.coords.longitude, 16);
  });
}

//Add Marker on Map click
map.on('click', function(e){
  console.log("lat : " + e.latlng["lat"] + ", lon : " + e.latlng["lng"]);
  setPosition(e.latlng["lat"], e.latlng["lng"]);
  addMarker(e.latlng["lat"], e.latlng["lng"], "Me");
  mapSetView(e.latlng["lat"], e.latlng["lng"], 16);
});

//Tab Companies
function addCompany2Result(companies){
  var resultDiv = document.getElementById("result");

  var newResultDiv = document.createElement("div");
  newResultDiv.className = "row";
  newResultDiv.setAttribute("id", "result");

  resultDiv.parentNode.appendChild(newResultDiv);
  resultDiv.parentNode.removeChild(resultDiv);

  var title = document.createElement("h1");
  title.innerHTML = "Résultats : ";
  newResultDiv.appendChild(title);

  var col = document.createElement("div");
  col.className = "col-lg-6";
  newResultDiv.appendChild(col);

  var panel = document.createElement("div");
  panel.className = "panel panel-default";
  col.appendChild(panel);

  var panelHeading = document.createElement("div");
  panelHeading.className = "panel-heading";
  panel.appendChild(panelHeading);

  panelHeading.innerHTML = "Sociétés";

  var panelBody = document.createElement("div");
  panelBody.className = "panel-body";
  panel.appendChild(panelBody);

  var tableResponsive = document.createElement("div");
  tableResponsive.className = "table-responsive";
  panelBody.appendChild(tableResponsive);

  var table = document.createElement("table");
  table.className = "table table-striped table-bordered table-hover";
  tableResponsive.appendChild(table);

  var thead = document.createElement("thead");
  var tr = document.createElement("tr");
  var thNom = document.createElement("th");
  thNom.innerHTML = "Nom";
  var thDistance = document.createElement("th");
  thDistance.innerHTML = "Distance";

  tr.appendChild(thNom);
  tr.appendChild(thDistance);


  var tbody = document.createElement("tbody");
  var td = document.createElement("td");

  table.appendChild(thead);
  thead.appendChild(tr);

  table.appendChild(tbody);

  for (var i = 0; i < companies.length; i++) {
    var tr = document.createElement("tr");
    var tdNom = document.createElement("td");

    tdNom.innerHTML = companies[i].nomen_long;
    var tdDistance = document.createElement("td");
    tdDistance.innerHTML = companies[i].distance / 1000 + " km";
    tr.appendChild(tdNom);
    tr.appendChild(tdDistance);

    tbody.appendChild(tr);
  }

}

//Tab Advertisements
function addAdvertisement2Result(advertisements){
  var resultDiv = document.getElementById("result");

  var newResultDiv = document.createElement("div");
  newResultDiv.className = "row";
  newResultDiv.setAttribute("id", "result");

  resultDiv.parentNode.appendChild(newResultDiv);
  resultDiv.parentNode.removeChild(resultDiv);

  var title = document.createElement("h1");
  title.innerHTML = "Résultats : ";
  newResultDiv.appendChild(title);

  var col = document.createElement("div");
  col.className = "col-lg-6";
  newResultDiv.appendChild(col);

  var panel = document.createElement("div");
  panel.className = "panel panel-default";
  col.appendChild(panel);

  var panelHeading = document.createElement("div");
  panelHeading.className = "panel-heading";
  panel.appendChild(panelHeading);

  panelHeading.innerHTML = (advertisements.length + 1) + " Annonces";

  var panelBody = document.createElement("div");
  panelBody.className = "panel-body";
  panel.appendChild(panelBody);

  var tableResponsive = document.createElement("div");
  tableResponsive.className = "table-responsive";
  panelBody.appendChild(tableResponsive);

  var table = document.createElement("table");
  table.className = "table table-striped table-bordered table-hover";
  tableResponsive.appendChild(table);

  var thead = document.createElement("thead");
  var tr = document.createElement("tr");
  var thPseudo = document.createElement("th");
  thPseudo.innerHTML = "Pseudo";
  var thTitre = document.createElement("th");
  thTitre.innerHTML = "Titre";
  var thDesignation = document.createElement("th");
  thDesignation.innerHTML = "Désignation";
  var thCout = document.createElement("th");
  thCout.innerHTML = "Coût";
  var thDistance = document.createElement("th");
  thDistance.innerHTML = "Distance";

  tr.appendChild(thPseudo);
  tr.appendChild(thTitre);
  tr.appendChild(thDesignation);
  tr.appendChild(thCout);
  tr.appendChild(thDistance);


  var tbody = document.createElement("tbody");
  var td = document.createElement("td");

  table.appendChild(thead);
  thead.appendChild(tr);

  table.appendChild(tbody);

  for (var i = 0; i < advertisements.length; i++) {
    var tr = document.createElement("tr");

    var tdPseudo = document.createElement("td");
    tdPseudo.innerHTML = advertisements[i].pseudo;
    tr.appendChild(tdPseudo);

    var tdTitre = document.createElement("td");
    tdTitre.innerHTML = advertisements[i].titre;
    tr.appendChild(tdTitre);

    var tdDesignation = document.createElement("td");
    tdDesignation.innerHTML = advertisements[i].designation;
    tr.appendChild(tdDesignation);

    var tdCout = document.createElement("td");
    tdCout.innerHTML = advertisements[i].prix + " / " + advertisements[i].unite;
    tr.appendChild(tdCout);

    var tdDistance = document.createElement("td");
    tdDistance.innerHTML = advertisements[i].distance / 1000 + " km";
    tr.appendChild(tdDistance);

    tbody.appendChild(tr);
  }
}
