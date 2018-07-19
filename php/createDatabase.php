<?php

    $mongoDB = new MongoClient();

    $database = $mongoDB->selectDB('neighbor');

    $dbname = $_GET['dbname'];


    $collections = $database->createCollection($dbname);


    echo json_encode($collections, true);

?>