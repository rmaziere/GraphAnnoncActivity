# Proxyret

**Sujet : ** Permettre la recherche et l'affichage en fonction de critères de recherche (localisation, activité) :

- de sociétés,
- d'annonces.

Faire un affichage sous forme de carte de chaleur des entreprises.
Établir et afficher la mise en relation de sociétés pour une annonces choisie.

## Les données

Les données de ce projet sont :

- la base adresse nationale,
- la base SIRENE,
- la liste des code APE,
- un fichier d'annonces de particuliers.

### BAN Base Adresses Nationale

La base adresse nationale fournie une archive de 1 Go contenant autant de fichiers *csv* que de départements.
L'ensemble des 102 fichiers font 4.5Go. Pour exemple, le fichier correspondant au département 93 fait 40 Mo.

Les différentes champs sont donc les suivants : 

- **id** : identifiant de la BD Adresse
- **nom_voie** : nom de la voie
- id_fantoir : identifiant Fantoir
- **numero** : numéro dans la voie
- **rep** : indice de répétition
- **code_insee** : code INSEE
- code_post : code Postal
- alias : nom en langue régionale, et/ou différent de l'officiel
- nom_ld : nom du lieu-dit
- **nom_afnor** : nom normalisé selon la norme postale
- libelle_acheminement : nom de la commune d'acheminement
- **x** : coordonnée en Lambert 93 EPSG:2154
- **y** : coordonnée en Lambert 93 EPSG:2154
- **lon** : longitude en WGS85 EPSG:4326
- **lat** : latitude en WGS85 EPSG:4326
- **nom_commune** : nom officiel de la commune

*En gras, les champs présentant un intérêt supérieur.

**Un exemple :**

```csv
id;nom_voie;id_fantoir;numero;rep;code_insee;code_post;alias;nom_ld;nom_afnor;libelle_acheminement;x;y;lon;lat;nom_commune
ADRNIVX_0000000276535697;;A045;152;"";33199;33470;"";LE VILLAGE DES PINS;;GUJAN MESTRAS;374053.7;6399654.5;-1.11036564643895;44.6196154013104;Gujan-Mestras
```

### SIRENE

La base SIRENE est fournie en un fichier unique, au format *csv*, avec une fréquence de mise à jour mensuelle.
Des fichiers de mise à jour régulière sont aussi disponible. Nous utiliserons ici le fichier global de 8.5Go et disponible compressé sur le site open data d'une taille de 1.5 Go.

Ce fichier est d'une qualité très particulière, il est aussi à noter que les types des champs ne sont pas particulièrement judicieux (quasiment que du type caractères).
Il est composé de 100 champs ! Ils ne seront donc pas listés en intégralité ici. Voici la liste des plus intéressants :

- **SIREN** : identifiant de l'entreprise
- **NIC** : identifiant de l'établissement
- {...}
- **NUMVOIE** : numéro dans la voie
- **INDREP** : indice de répétition
- **TYPVOIE** : type de voie
- **LIBVOIE** : libellé de la voie
- **CODPOS** : code postal
- {...}
- **DEPET** : code du département
- {...}
- **COMET** : code de la commune au sein du département
- **LIBCOM** : libellé de la commune
- {...}
- ENSEIGNE : Nom d'exploitation
- {...}
- NATETAB : nature de l'établissement
- LIBNATETAB : libellé de la nature de l'établissement
- **APET700** : activité principale de l'établissement
- **LIBAPET** : libellé de l'activité principale de l'établissement
- {...}
- **NOMEN_LONG** : raison sociale
- SIGLE : sigle de l'entreprise
- {...}
- APEN700 : activité principale de l'entreprise
- LIBAPEN : libellé de l'activité principale de l'entreprise
- {...}

**Un exemple :**

```csv
"SIREN";"NIC";"L1_NORMALISEE";"L2_NORMALISEE";"L3_NORMALISEE";"L4_NORMALISEE";"L5_NORMALISEE";"L6_NORMALISEE";"L7_NORMALISEE";"L1_DECLAREE";"L2_DECLAREE";"L3_DECLAREE";"L4_DECLAREE";"L5_DECLAREE";"L6_DECL
AREE";"L7_DECLAREE";"NUMVOIE";"INDREP";"TYPVOIE";"LIBVOIE";"CODPOS";"CEDEX";"RPET";"LIBREG";"DEPET";"ARRONET";"CTONET";"COMET";"LIBCOM";"DU";"TU";"UU";"EPCI";"TCD";"ZEMET";"SIEGE";"ENSEIGNE";"IND_PUBLIPO"
;"DIFFCOM";"AMINTRET";"NATETAB";"LIBNATETAB";"APET700";"LIBAPET";"DAPET";"TEFET";"LIBTEFET";"EFETCENT";"DEFET";"ORIGINE";"DCRET";"DDEBACT";"ACTIVNAT";"LIEUACT";"ACTISURF";"SAISONAT";"MODET";"PRODET";"PROD
PART";"AUXILT";"NOMEN_LONG";"SIGLE";"NOM";"PRENOM";"CIVILITE";"RNA";"NICSIEGE";"RPEN";"DEPCOMEN";"ADR_MAIL";"NJ";"LIBNJ";"APEN700";"LIBAPEN";"DAPEN";"APRM";"ESS";"DATEESS";"TEFEN";"LIBTEFEN";"EFENCENT";"D
EFEN";"CATEGORIE";"DCREN";"AMINTREN";"MONOACT";"MODEN";"PRODEN";"ESAANN";"TCA";"ESAAPEN";"ESASEC1N";"ESASEC2N";"ESASEC3N";"ESASEC4N";"VMAJ";"VMAJ1";"VMAJ2";"VMAJ3";"DATEMAJ"

"000325175";"00057";"TAHITI PERLES CREATION";"MONSIEUR THIERRY JANOYER";"";"61 RUE MARX DORMOY";"";"13004 MARSEILLE";"FRANCE";"MONSIEUR THIERRY JANOYER";"TAHITI PERLES CREATION";"";"61 RUE MARX DORMOY";""
;"13004 MARSEILLE 4";"";"61";"";"RUE";"MARX DORMOY";"13004";"";"93";"Provence-Alpes-Côte d'Azur";"13";"3";"98";"204";"MARSEILLE 4";"00";"7";"59";"200054807";"73";"9310";"1";"TAHITI PERLES CREATION";"1";"O
";"201401";"3";"Artisan ";"3212Z";"Fabrication d'articles de joaillerie et bijouterie";"2014";"00";"0 salarié";"NN";"2014";"1";"20140107";"20140107";"";"";"";"P";"S";"O";"";"0";"JANOYER*THIERRY/";"";"JANO
YER";"THIERRY";"1";"";"00057";"93";"13204";"";"";"";"3212Z";"Fabrication d'articles de joaillerie et bijouterie";"2008";"";"";"";"00";"0 salarié";"NN";"2014";"PME";"20000926";"201209";"1";"S";"O";"";"";""
;"";"";"";"";"";"";"";"";"2014-01-08T00:00:00"
"005420021";"00056";"ETABLISSEMENTS LUCIEN BIQUEZ";"";"";"21 B BOULEVARD DES PRES";"";"80100 ABBEVILLE";"FRANCE";"ETABLISSEMENTS LUCIEN BIQUEZ";"";"";"21 B BD DES PRES";"";"80100 ABBEVILLE";"";"21";"B";"B
D";"DES PRES";"80100";"";"32";"Nord-Pas-de-Calais-Picardie";"80";"1";"98";"001";"ABBEVILLE";"80";"4";"01";"248000556";"41";"2209";"1";"";"1";"O";"201209";"";"";"4669B";"Commerce de gros de fournitures et 
équipements industriels divers";"2009";"11";"10 à 19 salariés";"10";"2009";"1";"20091223";"20091223";"";"";"";"P";"S";"O";"";"0";"ETABLISSEMENTS LUCIEN BIQUEZ";"";"";"";"";"";"00056";"32";"80001";"";"5710
";"SAS, société par actions simplifiée";"4669B";"Commerce de gros de fournitures et équipements industriels divers";"2008";"";"";"";"11";"10 à 19 salariés";"10";"2009";"PME";"19540101";"201209";"1";"S";"O
";"";"";"";"";"";"";"";"";"";"";"";"2011-07-19T00:00:00"
"005420120";"00015";"SOCIETE DES SUCRERIES DU MARQUENTERRE";"";"";"RUE DE LA FONTAINE";"";"80120 RUE";"FRANCE";"SOCIETE DES SUCRERIES DU MARQUENTERRE";"";"";"RUE DE LA FONTAINE";"";"80120 RUE";"";"";"";"R
UE";"DE LA FONTAINE";"80120";"";"32";"Nord-Pas-de-Calais-Picardie";"80";"1";"23";"688";"RUE";"80";"1";"13";"200011997";"17";"2209";"0";"";"1";"O";"201209";"";"";"1081Z";"Fabrication de sucre";"2008";"02";
"3 à 5 salariés";"3";"2015";"1";"19890127";"19890127";"NR";"99";"";"P";"S";"O";"";"0";"SOCIETE DES SUCRERIES DU MARQUENTERRE";"";"";"";"";"";"00031";"32";"62550";"";"5599";"SA à conseil d'administration (
s.a.i.)";"7010Z";"Activités des sièges sociaux";"2014";"";"";"";"11";"10 à 19 salariés";"10";"2015";"PME";"19540101";"201209";"3";"S";"O";"2012";"0";"7010Z";"7010Z";"";"";"";"";"";"";"";"1997-09-02T00:00:
00"
```

## La base de données

Le SGBD utilisé pour ce projet est PostgreSQL.
Les extensions sont :

- PostGIS : pour la gestion des géométries,
- Fuzzystrmatch : pour bénéficier des fonctions, telle levenshtein distance.

La première étape consiste à créer la base de données

**Nota : ** Cette étape ne sera par explicitée ici, voir la documentation du projet [Proxyrest](https://github.com/rmaziere/Proxyret/blob/master/README.md)

## L'API Web

Le site est basé sur l'utilisation de requêtes AJAX, Nous avons donc pris la décision de réaliser une API Web qui fait l'interface entre le site (client) et la base de données.

Le principe est le suivant, lors d'une requête, des paramètres (variables) sont passées en GET dans une URL, exemple :

{...}/api.php?format=json&type=companies&distance=2500&activity=boulangerie&lat=48.84872194738811&lon=2.572860717773438
Ici nous voulons la liste des *companies* dont l'activité est *boulangerie* dans un rayon de *2500* m autour des coordonnées fournies.

En fonction de ces différents paramètres, l'API construira la requête SQL.

```php
if (isset($_GET["type"]) && $_GET["type"] == "companies" && isset($_GET["lat"]) && is_numeric($_GET["lat"]) && isset($_GET["lon"]) && is_numeric($_GET["lon"]) && isset($_GET["distance"]) && is_numeric($_GET["distance"])) {
  $companies_list = "SELECT s.siren, s.nic, s.nomen_long, s.libapet, b.lat, b.lon, ST_Distance(ST_SetSRID(ST_Point(" . $_GET['lon'] . ", " . $_GET['lat'] . "), 4326), b.geom) AS distance, b.numero, b.nom_voie, b.code_post, b.nom_commune FROM public.siren s, public.ban b WHERE s.banid = b.id ";
  if (isset($_GET["lat"]) && is_numeric($_GET["lat"]) && isset($_GET["lon"]) && is_numeric($_GET["lon"]) && isset($_GET["distance"]) && is_numeric($_GET["distance"])) { //Lat/Long in WGS84
    $companies_list .= " AND ST_DWithin(ST_SetSRID(ST_Point(" . $_GET['lon'] . ", " . $_GET['lat'] . "), 4326), b.geom, " . distanceConverter($_GET['distance'], "m2dgr") . ")";
  }
  if (isset($_GET["activity"]) && !empty($_GET["activity"])) {
    $companies_list .= " AND libapet ILIKE '%" . $_GET['activity'] . "%'";
  }
  //Exécution de la requête
  if ($result = pg_query($dbconn, $companies_list)) {
    $count = pg_num_rows($result);
    if (isset($_GET["DEBUG"])) {
      echo "<p><strong>Count :</strong> " . $count . "</p>";
    }
    $json_companies = "{\"companies\":[";

    $i = 0;
    while ($data = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
      //Conversion en mètre des distances
      $data['distance'] = distanceConverter($data['distance'], "dgr2m");

      if (isset($_GET["format"]) && strtolower($_GET["format"]) == "json") {
        $json_companies .= json_encode($data);
        if($i < $count - 1){
          $json_companies .= ",";
        }
        $i++;
      }
    }
    echo $json_companies .= "]}";
  }
}

```

Comme nous le voyons ici, une série de vérification des différents paramètres permet cette construction de requête, puis une fois les données retournées, la construction du json.

### Les différents flux de données

#### Sens client -> serveur

Les requêtes AJAX envoient au serveur seulement des données ASCII via l'URL de l'API.

#### Sens client <- serveur

Les résultats de l'API sont retournés dans un JSON, qu'il suffit au script js de "parsser".

## HeatMap

La carte de chaleur permet l'affichage des concentrations de sociétés sur les départements du 93 ainsi que du 77.

Les données ont été obtenues en réalisant une requête qui a regroupé les sociétés par lat/lon et effectué un comptage. Ces données sont stockées dans le script javascript. 
En effet, elle n'est pas exécutée à la volée, car les données du siren ne changent que lors de la mise à jour de la base. Il n'est donc pas nécessaire, même si l'exécution est assez rapide, d'effectuer cette requête régulièrement.
Pour donner un ordre d'idée, pour seulement ces deux départements, il faut moins de 1.5 sec au SGBD pour retourner un résultat.

Si nous souhaitions disposer d'une carte de chaleur sur l'ensemble du territoire, on peut estimer un temps de requêtage d'environ une minute.

Une solution pour avoir du dynamisme serait de réaliser différentes requêtes, une pour chaque niveau de zoom et de prendre en compte la zone d'affichage de la carte.

## Graphe de relations

La mise en relation d'entreprise vis-à-vis d'une annonce est affichée sous d'un graphe avec un nœud central qui est l'annonce et des nœuds à l'extrèmité des arcs, qui sont les entreprises situées dans la zone d'action de l'annonce en question.
La bibliothèque utilisée est basée sur [http://d3js.org](D3.js) et est [Mobile Patent Suits](http://bl.ocks.org/mbostock/1153292)

Elle prend en paramètres des *sources* et des *targets* reliées entre elles par un lien de longueur fixe.

Quelques unes des limitations de cette bibliothèque sont la non possibilité d'avoir des liens de longueurs variables, la non possibilité d'interroger des entités. Il faudrait donc adapter cette dernière à nos désidérats.

Pour ce projet, les graphes ne sont pas stockés mais bien calculés à la volée et affichés.
Pour ce faire, il faut rechercher des annonces, puis cliquer sur l'intitulé de celle choisie, le graphe s'affichera en-dessous.

