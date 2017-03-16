<?php
header('Content-type: text/html; charset=utf-8');
header("Access-Control-Allow-Origin: *");
$beginning_time = microtime(true);
include_once("connexion.inc.php");

$limit = 100;

//Companies
if (isset($_GET["type"]) && $_GET["type"] == "companies") {
  $companies_list = "SELECT s.siren, s.nic, s.nomen_long, s.libapet, b.lat, b.lon, ST_Distance(ST_SetSRID(ST_Point(" . $_GET['lon'] . ", " . $_GET['lat'] . "), 4326), b.geom) AS distance, b.numero, b.nom_voie, b.code_post, b.nom_commune FROM test.siren93 s, test.ban b WHERE s.banid = b.id ";
  //$companies_list = "SELECT s.siren, s.nic, s.nomen_long, s.libapet, b.geom, b.lat, b.lon, ST_Distance(ST_SetSRID(ST_Point(" . $_GET['lon'] . ", " . $_GET['lat'] . "), 4326), b.geom) AS distance, b.numero, b.nom_voie, b.code_post, b.nom_commune FROM public.siren s, test.ban b WHERE s.banid = b.id ";
  if (isset($_GET["insee"]) && strlen($_GET["insee"]) == 5) {
    $companies_list .= " AND s.code_insee = '" . $_GET['insee'] . "'";
  }
  if (isset($_GET["lat"]) && is_numeric($_GET["lat"]) && isset($_GET["lon"]) && is_numeric($_GET["lon"]) && isset($_GET["distance"]) && is_numeric($_GET["distance"])) { //Lat/Long in WGS84
    $companies_list .= " AND ST_DWithin(ST_SetSRID(ST_Point(" . $_GET['lon'] . ", " . $_GET['lat'] . "), 4326), b.geom, " . distanceConverter($_GET['distance'], "m2dgr") . ")";
  }
  elseif (isset($_GET["x"]) && is_numeric($_GET["x"]) && isset($_GET["y"]) && is_numeric($_GET["y"]) && isset($_GET["distance"]) && is_numeric($_GET["distance"])) { //x/y in Lambert 93
    $companies_list .= " AND ST_DWithin(ST_Transform(ST_SetSRID(ST_Point(" . $_GET['lon'] . ", " . $_GET['lat'] . "), 2154), 4326), b.geom, " . distanceConverter($_GET['distance'], "m2dgr") . ")";
  }
  if (isset($_GET["activity"]) && !empty($_GET["activity"])) {
    $companies_list .= " AND libapet ILIKE '%" . $_GET['activity'] . "%'";
  }

  //Add the ORDER BY
  $companies_list .= " ORDER BY b.code_insee, b.nom_voie, b.numero";

  if (isset($_GET["quantity"]) && is_numeric($_GET["quantity"]) && $_GET["quantity"] <= $limit) {
    $companies_list .= " LIMIT " . $_GET['quantity'] . ";";
  }
  else {
    $companies_list .= " LIMIT " . $limit . ";";
  }

  if (isset($_GET["DEBUG"])) {
    echo "<p><strong>Query :</strong> " . $companies_list . "</p>";
  }

  if ($result = pg_query($dbconn, $companies_list)) {
    $count = pg_num_rows($result);
    if (isset($_GET["DEBUG"])) {
      echo "<p><strong>Count :</strong> " . $count . "</p>";
    }
    $json_companies = "{\"companies\":[";

    $i = 0;
    while ($data = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
      //Convertion en mètres des distance
      $data['distance'] = distanceConverter($data['distance'], "dgr2m");

      if (isset($_GET["DEBUG"])) {
        echo "<p><strong>\$data :</strong> ";
        print_r($data);
        echo "</p>";
      }
      if (isset($_GET["format"]) && strtolower($_GET["format"]) == "json") {
        $json_companies .= json_encode($data);
        if($i < $count - 1){
          $json_companies .= ",";
        }
        $i++;
      }else {
        echo "<strong>SIREN :</strong> " . $data['siren'] . $data['nic'] . " - " .
             "<strong>Activité :</strong> " . $data['libapet'] . " - " .
             "<strong>Adresse :</strong> " . $data['numero'] . " " . $data['nom_voie'] . " " . $data['code_post'] . " " . $data['nom_commune'] . " - " .
             "<strong>Distance :</strong> " . distanceConverter($data['distance'], "dgr2m") . "<br>";
      }
    }
    $json_companies .= "]}";
    if (isset($_GET["format"]) && strtolower($_GET["format"]) == "json") {
      echo $json_companies;
    }
  }
}

//advertisements
if (isset($_GET["type"]) && $_GET["type"] == "advertisements") {
 $annonces_list = "SELECT a.id, a.idm, a.pseudo, a.type, a.titre, a.description, a.prix, a.unite, a.negociable, a.date_enregistrement,
 a.lat, a.lng AS lon, ST_Distance(ST_SetSRID(ST_Point(" . $_GET['lon'] . ", " . $_GET['lat'] . "), 4326), a.geom) AS distance, a.ville, a.disponibilite, a.designation, a.rayon
 FROM public.annonce a
 WHERE 1 = 1 ";
 /*if (isset($_GET["insee"]) && strlen($_GET["insee"]) == 5) {
   $annonces_list .= " AND s.code_insee = '" . $_GET['insee'] . "'";
 }*/
 if (isset($_GET["lat"]) && is_numeric($_GET["lat"]) && isset($_GET["lon"]) && is_numeric($_GET["lon"]) && isset($_GET["distance"]) && is_numeric($_GET["distance"])) { //Lat/Long in WGS84
   $annonces_list .= " AND ST_DWithin(ST_SetSRID(ST_Point(" . $_GET['lon'] . ", " . $_GET['lat'] . "), 4326), a.geom, " . distanceConverter($_GET['distance'], "m2dgr") . ")";
 }
 if (isset($_GET["category"]) && !empty($_GET["category"])) {
   $annonces_list .= " AND designation ILIKE '%" . $_GET['category'] . "%'";
 }

 //Add the ORDER BY
 //$annonces_list .= " ORDER BY b.code_insee, b.nom_voie, b.numero";

 if (isset($_GET["quantity"]) && is_numeric($_GET["quantity"]) && $_GET["quantity"] <= $limit) {
   $annonces_list .= " LIMIT " . $_GET['quantity'] . ";";
 }
 else {
   $annonces_list .= " LIMIT " . $limit . ";";
 }

 if (isset($_GET["DEBUG"])) {
   echo "<p><strong>Query :</strong> " . $annonces_list . "</p>";
 }

 if ($result = pg_query($dbconn, $annonces_list)) {
    $count = pg_num_rows($result);
    if (isset($_GET["DEBUG"])) {
      echo "<p><strong>Count :</strong> " . $count . "</p>";
    }
    $json_annonces = "{\"advertisements\":[";

    $i = 0;
    while ($data = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
      //Convertion en mètres des distance
      $data['distance'] = distanceConverter($data['distance'], "dgr2m");
      if (isset($_GET["format"]) && strtolower($_GET["format"]) == "json") {
        $json_annonces .= json_encode($data);
        if($i < $count - 1){
          $json_annonces .= ",";
        }
        $i++;
      }else {
        echo "<p><strong>Pseudo :</strong> " . $data['pseudo'] . " - " .
     	       "<strong>type :</strong> " . $data['type'] . " - " .
             "<strong>titre :</strong> " . $data['titre'] . "<br>" .
             "<strong>description :</strong> " . $data['description'] . "<br>" .
             "<strong>Designation :</strong> " . $data['designation'] . "</p>";
      }
    }
    $json_annonces .= "]}";
    if (isset($_GET["format"]) && strtolower($_GET["format"]) == "json") {
      echo $json_annonces;
    }
  }
}

//ad2companies
if (isset($_GET["type"]) && $_GET["type"] == "ad2companies") {
 $companies_list = "SELECT a.id, a.pseudo, a.titre, a.ville,
                    s.siren, s.apet700, s.libapet, nomen_long, s.libcom, s.depet, s.codpos, s.lat, s.lon,
                    ST_Distance(a.geom, s.geom) AS distance
                    FROM annonce a
                    LEFT JOIN activity_naf AS c ON c.activity_id = a.activity_id
                    LEFT JOIN siren AS s ON s.apet700 = c.naf_code
                    WHERE ST_DWithin(a.geom, s.geom, 0.1)";

 if (isset($_GET["ad_id"]) && !empty($_GET["ad_id"])) {
   $companies_list .= " AND a.id = " . $_GET['ad_id'];
 }

  //Add the ORDER BY
  $companies_list .= " ORDER BY distance";

  if (isset($_GET["quantity"]) && is_numeric($_GET["quantity"]) && $_GET["quantity"] <= $limit) {
    $companies_list .= " LIMIT " . $_GET['quantity'] . ";";
  }
  else {
    $companies_list .= " LIMIT " . $limit . ";";
  }

  if (isset($_GET["DEBUG"])) {
    echo "<p><strong>Query :</strong> " . $companies_list . "</p>";
  }

  if ($result = pg_query($dbconn, $companies_list)) {
    $count = pg_num_rows($result);
    if (isset($_GET["DEBUG"])) {
      echo "<p><strong>Count :</strong> " . $count . "</p>";
    }
    $json_companies = "[";

    $i = 0;
    while ($data = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
      //Convertion en mètres des distance
      $data['distance'] = distanceConverter($data['distance'], "dgr2m");

      if (isset($_GET["DEBUG"])) {
        echo "<p><strong>\$data :</strong> ";
        print_r($data);
        echo "</p>";
      }
      if (isset($_GET["format"]) && strtolower($_GET["format"]) == "json") {
        $json_companies .= "{source: \"" . $data['pseudo'] . "\", ";
        $json_companies .= "target: \"" . $data['nomen_long'] . "\", ";
        $json_companies .= "type: \"licensing\"}";

        if($i < $count - 1){
          $json_companies .= ",";
        }
        $i++;
      }else {
        echo "<strong>SIREN :</strong> " . $data['siren'] . $data['nic'] . " - " .
             "<strong>Activité :</strong> " . $data['libapet'] . " - " .
             "<strong>Adresse :</strong> " . $data['numero'] . " " . $data['nom_voie'] . " " . $data['code_post'] . " " . $data['nom_commune'] . " - " .
             "<strong>Distance :</strong> " . distanceConverter($data['distance'], "dgr2m") . "<br>";
      }
    }
    $json_companies .= "]";
    if (isset($_GET["format"]) && strtolower($_GET["format"]) == "json") {
      echo $json_companies;
    }
  }
}

function distanceConverter($value, $type){
  //Distances in meters
  $defaultDistance = 500;
  $max_Distance = 10000;
  $ratioDegreeMeter = 6.2e-06;

  if($type == 'm2dgr'){
    if (is_numeric($value) && $value < $max_Distance) {
      return $value * $ratioDegreeMeter;
    }
    else {
      return $defaultDistance * $ratioDegreeMeter;
    }
  }elseif($type == 'dgr2m'){
    if (is_numeric($value) && $value < $max_Distance) {
      return round($value / $ratioDegreeMeter);
    }
    else {
      return round($defaultDistance / $ratioDegreeMeter);
    }
  }
}

pg_free_result($result);

//Company

//Addresses

//Address

pg_close($dbconn);

if (isset($_GET["DEBUG"])) {
  echo "<p><strong>Temps d'exécution :</strong> " . round(microtime(true) - $beginning_time, 4) . " s</p>";
}
?>
