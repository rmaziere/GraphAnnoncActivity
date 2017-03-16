<?php
$dbconn = pg_connect("host=localhost port=5432 dbname=bigdata user=username password=*******");

if (!$dbconn) {
    die("Erreur de connexion");
}else{
    //echo "Succès...";
}
?>
