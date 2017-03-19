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

      addCompany2Result(result.companies, 12);

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

      addAdvertisement2Result(result.advertisements, 12);

      if (result.advertisements.length > 0) {
        var liste = "";
        for (var i = 0; i < result.advertisements.length; i++) {
          addMarker(result.advertisements[i].lat, result.advertisements[i].lon,
            "<strong>Pseudo : </strong>" + result.advertisements[i].pseudo + "<br>" +
            "<strong>Designation : </strong>" + result.advertisements[i].designation + "<br>" +
            "<strong>Titre : </strong>" + result.advertisements[i].titre + "<br>" +
            "<strong>Distance : </strong>" + result.advertisements[i].distance + " m " +
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
function addCompany2Result(companies, colWidth){
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
  col.className = "col-lg-" + colWidth;
  newResultDiv.appendChild(col);

  var panel = document.createElement("div");
  panel.className = "panel panel-default";
  col.appendChild(panel);

  var panelHeading = document.createElement("div");
  panelHeading.className = "panel-heading";
  panel.appendChild(panelHeading);

  panelHeading.innerHTML = companies.length + " Sociétés";

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
  tr.appendChild(thNom);

  var thActivity = document.createElement("th");
  thActivity.innerHTML = "Activité";
  tr.appendChild(thActivity);

  var thAddress = document.createElement("th");
  thAddress.innerHTML = "Adresse";
  tr.appendChild(thAddress);

  var thCity = document.createElement("th");
  thCity.innerHTML = "Commune";
  tr.appendChild(thCity);

  var thDistance = document.createElement("th");
  thDistance.innerHTML = "Distance";

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
    tr.appendChild(tdNom);

    var tdLibAPE = document.createElement("td");
    tdLibAPE.innerHTML = companies[i].libapet;
    tr.appendChild(tdLibAPE);

    var tdAddress = document.createElement("td");
    tdAddress.innerHTML = companies[i].numero + " " + companies[i].nom_voie;
    tr.appendChild(tdAddress);

    var tdVille = document.createElement("td");
    tdVille.innerHTML = companies[i].nom_commune;
    tr.appendChild(tdVille);

    var tdDistance = document.createElement("td");
    tdDistance.innerHTML = companies[i].distance / 1000 + " km";

    tr.appendChild(tdDistance);

    tbody.appendChild(tr);
  }
}

//Tab Advertisements
function addAdvertisement2Result(advertisements, colWidth){
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
  col.className = "col-lg-" + colWidth;
  newResultDiv.appendChild(col);

  var panel = document.createElement("div");
  panel.className = "panel panel-default";
  col.appendChild(panel);

  var panelHeading = document.createElement("div");
  panelHeading.className = "panel-heading";
  panel.appendChild(panelHeading);

  panelHeading.innerHTML = (advertisements.length) + " Annonces";

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
  var thRayon = document.createElement("th");
  thRayon.innerHTML = "Rayon";
  var thDistance = document.createElement("th");
  thDistance.innerHTML = "Distance";

  tr.appendChild(thPseudo);
  tr.appendChild(thTitre);
  tr.appendChild(thDesignation);
  tr.appendChild(thCout);
  tr.appendChild(thRayon);
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
    //tdTitre.innerHTML = advertisements[i].titre;
    tdTitre.innerHTML = "<a ad_id=" + advertisements[i].id + ">" + advertisements[i].titre + "</a>";
    tr.appendChild(tdTitre);

    var tdDesignation = document.createElement("td");
    tdDesignation.innerHTML = advertisements[i].designation;
    tr.appendChild(tdDesignation);

    var tdCout = document.createElement("td");
    tdCout.innerHTML = advertisements[i].prix + " / " + advertisements[i].unite;
    tr.appendChild(tdCout);

    var tdRayon = document.createElement("td");
    tdRayon.innerHTML = advertisements[i].rayon + " km";
    tr.appendChild(tdRayon);

    var tdDistance = document.createElement("td");
    tdDistance.innerHTML = (advertisements[i].distance / 1000) + " km";
    tr.appendChild(tdDistance);

    tbody.appendChild(tr);
  }
  var idLinks = document.querySelectorAll("td>a[ad_id]");
  for(i = 0; i < idLinks.length; i++){
    idLinks[i].addEventListener("click", graphCompanies);
  }
}

//Delete Graph
function removeSVGraph(){
  if(document.getElementsByTagName("svg")[0]){
    document.getElementsByTagName("svg")[0].parentNode.removeChild(document.getElementsByTagName("svg")[0]);
  }
}

//GraphAd2Companies
function graphCompanies(event){
  //waitingDialog.show("Recherche en cours... Veuillez patienter.");

  removeSVGraph();

  var ad_id = event.target.attributes[0].value;
  
  // création de l'objet xhr
  var ajax = new XMLHttpRequest();

  var uri_query = "http://" + server_name + directory + "/api.php?format=json&type=ad2companies&ad_id=" + ad_id;

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
      var links = JSON.parse(ajax.responseText);

      //var links = ajax.responseText;

      console.log(links);

      var nodes = {};

      console.log(links.length);

      // Compute the distinct nodes from the links.
      links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
      });

      var width = 960,
          height = 500;

      var force = d3.layout.force()
          .nodes(d3.values(nodes))
          .links(links)
          .size([width, height])
          .linkDistance(200)
          .charge(-300)
          .on("tick", tick)
          .start();

      var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height);

      // Per-type markers, as they don't inherit styles.
      svg.append("defs").selectAll("marker")
          .data(["suit", "licensing", "resolved"])
        .enter().append("marker")
          .attr("id", function(d) { return d; })
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 15)
          .attr("refY", -1.5)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
        .append("path")
          .attr("d", "M0,-5L10,0L0,5");

      var path = svg.append("g").selectAll("path")
          .data(force.links())
        .enter().append("path")
          .attr("class", function(d) { return "link " + d.type; })
          .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

      var circle = svg.append("g").selectAll("circle")
          .data(force.nodes())
        .enter().append("circle")
          .attr("r", 6)
          .call(force.drag);

      var text = svg.append("g").selectAll("text")
          .data(force.nodes())
        .enter().append("text")
          .attr("x", 8)
          .attr("y", ".31em")
          .text(function(d) { return d.name; });

      // Use elliptical arc path segments to doubly-encode directionality.
      function tick() {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr("transform", transform);
      }

      function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      }

      function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }
    }
  });
  // envoi de la requête
  ajax.send();
}
