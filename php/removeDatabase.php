<?php

    $mongoDB = new MongoClient();

    $database = $mongoDB->selectDB('neighbor');

    $dbname = $_GET['dbname'];


    $collections = $database->dropCollection($dbname);


    echo json_encode($collections, true);

?>