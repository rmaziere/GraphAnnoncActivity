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
document.getElementById("heatMapShow").addEventListener("click", heatMapShow);
document.getElementById("advertisementSearchShow").addEventListener("click", getAdvertisements);
document.getElementById("removeMarker").addEventListener("click", removeMarker);
document.getElementById("locateMe").addEventListener("click", locateMe);

//Companies
function getCompanies(event){
  var distance = document.getElementById('distance').value;
  var activity = document.getElementById('activity').value;

  if(mylat != undefined && mylon != undefined){
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
  else {
    console.log("Erreur, pas de coordonnées");
  }
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

      var nodes = {};

      // Compute the distinct nodes from the links.
      links.forEach(function(link) {
        var distance = 250;
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

//HeatMap
var heatMapStatus = false;
var heat = L.heatLayer([
  [48.96,2.44,1],
  [48.87,2.58,2],
  [48.97,2.58,2],
  [49.00,2.55,2],
  [48.95,2.40,4],
  [48.96,2.45,4],
  [48.96,2.47,4],
  [48.96,2.52,6],
  [48.94,2.40,7],
  [48.91,2.31,9],
  [48.96,2.41,11],
  [49.00,2.52,11],
  [48.94,2.33,15],
  [48.97,2.52,16],
  [48.94,2.60,18],
  [48.96,2.51,18],
  [48.94,2.41,19],
  [48.99,2.55,20],
  [49.00,2.54,20],
  [48.92,2.56,21],
  [48.96,2.59,21],
  [48.94,2.39,31],
  [48.97,2.54,31],
  [48.91,2.57,33],
  [48.86,2.59,34],
  [48.89,2.58,34],
  [48.92,2.59,34],
  [48.83,2.59,37],
  [48.86,2.55,37],
  [48.93,2.58,37],
  [48.82,2.57,41],
  [48.99,2.54,42],
  [48.97,2.35,43],
  [48.97,2.34,44],
  [48.94,2.56,46],
  [48.96,2.40,50],
  [48.97,2.39,54],
  [48.98,2.55,54],
  [48.86,2.41,55],
  [48.90,2.59,56],
  [48.98,2.50,56],
  [48.83,2.55,60],
  [48.95,2.29,78],
  [48.82,2.58,79],
  [48.97,2.30,79],
  [48.88,2.56,80],
  [48.91,2.56,80],
  [48.97,2.57,85],
  [48.84,2.53,92],
  [48.92,2.32,92],
  [48.97,2.53,92],
  [48.89,2.57,94],
  [48.85,2.58,100],
  [48.92,2.57,100],
  [48.92,2.58,109],
  [48.96,2.42,111],
  [48.94,2.55,117],
  [48.88,2.57,118],
  [48.93,2.56,121],
  [48.96,2.49,125],
  [48.97,2.55,139],
  [48.98,2.52,139],
  [48.97,2.56,142],
  [48.95,2.41,147],
  [48.94,2.54,153],
  [48.97,2.50,155],
  [48.95,2.42,160],
  [48.95,2.47,160],
  [48.98,2.51,162],
  [48.95,2.30,168],
  [48.91,2.59,174],
  [48.98,2.56,179],
  [48.95,2.59,180],
  [48.95,2.58,184],
  [48.96,2.39,184],
  [48.96,2.53,185],
  [48.90,2.38,192],
  [48.91,2.58,199],
  [48.87,2.57,201],
  [48.93,2.57,209],
  [48.92,2.55,215],
  [48.90,2.32,217],
  [48.96,2.58,218],
  [48.87,2.55,219],
  [48.91,2.35,224],
  [48.91,2.32,233],
  [48.99,2.52,233],
  [48.83,2.56,234],
  [48.91,2.41,237],
  [48.87,2.54,251],
  [48.94,2.42,253],
  [48.95,2.35,258],
  [48.83,2.58,262],
  [48.90,2.45,262],
  [48.86,2.49,264],
  [48.86,2.48,267],
  [48.85,2.52,271],
  [48.88,2.55,273],
  [48.85,2.45,275],
  [48.96,2.32,279],
  [48.89,2.54,281],
  [48.85,2.51,290],
  [48.95,2.48,292],
  [48.97,2.51,292],
  [48.94,2.51,293],
  [48.86,2.47,297],
  [49.01,2.56,302],
  [48.95,2.46,305],
  [48.86,2.57,315],
  [48.96,2.57,316],
  [48.89,2.56,323],
  [48.96,2.34,323],
  [48.85,2.54,333],
  [48.96,2.35,337],
  [48.88,2.50,342],
  [48.91,2.42,347],
  [48.85,2.53,351],
  [48.94,2.48,356],
  [48.94,2.59,366],
  [48.88,2.40,370],
  [48.95,2.32,370],
  [48.85,2.56,383],
  [48.96,2.29,383],
  [48.94,2.44,386],
  [48.96,2.33,387],
  [48.97,2.38,394],
  [48.93,2.34,397],
  [48.89,2.43,398],
  [48.96,2.54,401],
  [48.87,2.56,403],
  [48.95,2.54,403],
  [48.87,2.51,406],
  [48.90,2.36,406],
  [48.87,2.50,407],
  [48.96,2.56,409],
  [48.95,2.37,410],
  [48.84,2.54,413],
  [48.92,2.51,413],
  [48.89,2.48,416],
  [48.93,2.53,418],
  [48.95,2.55,423],
  [48.86,2.54,426],
  [48.89,2.55,427],
  [48.90,2.43,429],
  [48.93,2.41,429],
  [48.95,2.57,430],
  [48.93,2.52,435],
  [48.94,2.52,435],
  [48.93,2.48,438],
  [48.93,2.44,440],
  [48.88,2.54,442],
  [48.93,2.46,444],
  [48.92,2.53,451],
  [48.95,2.53,452],
  [48.96,2.50,459],
  [48.96,2.55,461],
  [48.84,2.58,462],
  [48.92,2.35,464],
  [48.93,2.40,478],
  [48.92,2.52,480],
  [48.90,2.46,482],
  [48.93,2.51,483],
  [48.95,2.44,488],
  [48.95,2.49,488],
  [48.86,2.46,490],
  [48.84,2.57,491],
  [48.89,2.53,498],
  [48.89,2.49,499],
  [48.94,2.38,502],
  [48.95,2.45,505],
  [48.92,2.49,507],
  [48.86,2.58,515],
  [48.94,2.45,516],
  [48.86,2.52,517],
  [48.84,2.56,521],
  [48.87,2.41,521],
  [48.93,2.47,522],
  [48.94,2.49,523],
  [48.89,2.44,526],
  [48.90,2.56,528],
  [48.92,2.48,529],
  [48.95,2.34,532],
  [48.90,2.57,533],
  [48.93,2.55,558],
  [48.88,2.45,559],
  [48.94,2.58,565],
  [48.85,2.57,566],
  [48.93,2.54,569],
  [48.92,2.47,570],
  [48.90,2.54,571],
  [48.92,2.50,579],
  [48.88,2.51,583],
  [48.89,2.47,584],
  [48.90,2.44,585],
  [48.96,2.37,596],
  [48.87,2.52,599],
  [48.89,2.52,599],
  [48.90,2.35,602],
  [48.94,2.47,602],
  [48.92,2.43,603],
  [48.95,2.50,604],
  [48.83,2.57,610],
  [48.90,2.47,610],
  [48.88,2.52,620],
  [48.88,2.49,626],
  [48.91,2.49,628],
  [48.90,2.49,629],
  [48.94,2.53,629],
  [48.94,2.50,630],
  [48.93,2.37,637],
  [48.95,2.36,641],
  [48.97,2.37,641],
  [48.87,2.53,643],
  [48.91,2.43,644],
  [48.94,2.57,646],
  [48.90,2.50,650],
  [48.92,2.42,652],
  [48.90,2.53,662],
  [48.92,2.54,665],
  [48.95,2.56,669],
  [48.93,2.38,675],
  [48.95,2.31,676],
  [48.90,2.37,679],
  [48.91,2.47,680],
  [48.91,2.53,680],
  [48.94,2.34,681],
  [48.97,2.36,683],
  [48.89,2.50,687],
  [48.91,2.54,694],
  [48.95,2.39,694],
  [48.96,2.36,696],
  [48.86,2.53,703],
  [48.91,2.55,711],
  [48.91,2.46,715],
  [48.90,2.51,719],
  [48.92,2.33,722],
  [48.95,2.52,723],
  [48.90,2.55,728],
  [48.93,2.45,732],
  [48.86,2.50,739],
  [48.86,2.51,746],
  [48.95,2.38,766],
  [48.91,2.48,785],
  [48.91,2.50,786],
  [48.94,2.43,790],
  [48.85,2.44,799],
  [48.95,2.33,807],
  [48.96,2.38,808],
  [48.95,2.51,810],
  [48.92,2.46,828],
  [48.87,2.46,835],
  [48.90,2.41,843],
  [48.93,2.39,844],
  [48.92,2.44,849],
  [48.87,2.49,856],
  [48.96,2.31,865],
  [48.92,2.37,891],
  [48.93,2.42,891],
  [48.88,2.47,895],
  [48.88,2.46,921],
  [48.91,2.45,922],
  [48.94,2.46,938],
  [48.88,2.53,952],
  [48.90,2.58,955],
  [48.87,2.47,976],
  [48.87,2.48,977],
  [48.96,2.30,983],
  [48.91,2.51,988],
  [48.93,2.49,1008],
  [48.88,2.48,1013],
  [48.90,2.42,1013],
  [48.93,2.50,1041],
  [48.85,2.55,1058],
  [48.92,2.36,1062],
  [48.89,2.45,1070],
  [48.92,2.40,1076],
  [48.93,2.35,1079],
  [48.86,2.45,1083],
  [48.93,2.43,1106],
  [48.92,2.39,1134],
  [48.84,2.55,1141],
  [48.90,2.52,1143],
  [48.91,2.40,1149],
  [48.87,2.43,1192],
  [48.87,2.45,1253],
  [48.89,2.46,1287],
  [48.88,2.44,1314],
  [48.90,2.33,1365],
  [48.94,2.37,1374],
  [48.90,2.48,1379],
  [48.92,2.34,1423],
  [48.92,2.38,1448],
  [48.93,2.36,1461],
  [48.89,2.42,1484],
  [48.91,2.52,1515],
  [48.87,2.44,1517],
  [48.91,2.37,1522],
  [48.91,2.36,1530],
  [48.92,2.41,1559],
  [48.88,2.43,1577],
  [48.92,2.45,1661],
  [48.89,2.51,1718],
  [48.87,2.42,1765],
  [48.88,2.41,1782],
  [48.91,2.44,1788],
  [48.94,2.36,1792],
  [48.85,2.43,1847],
  [48.91,2.33,1980],
  [48.94,2.35,2274],
  [48.90,2.34,2291],
  [48.90,2.40,2313],
  [48.86,2.43,2375],
  [48.91,2.39,2383],
  [48.85,2.42,2388],
  [48.90,2.39,2416],
  [48.91,2.38,2474],
  [48.91,2.34,2579],
  [48.89,2.41,2605],
  [48.88,2.42,2609],
  [48.89,2.40,3197],
  [48.86,2.42,3411],
  [48.86,2.44,4254]
], {
  max: 4500,
  radius: 50,
  minOpacity: 0.25,
  maxZoom: 10
});

function heatMapShow(event){
  if (!heatMapStatus) {
    heat.addTo(map);
    document.getElementById("heatMapShow").className ="btn btn-danger";
    heatMapStatus = true;
  }else{
    heat.remove();
    document.getElementById("heatMapShow").className ="btn btn-success";
    heatMapStatus = false;
  }
}
