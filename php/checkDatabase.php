<?php

    $mongoDB = new MongoClient();

    $database = $mongoDB->selectDB('neighbor');


    $collections = $database->getCollectionNames();

    echo json_encode($collections, true);

?>