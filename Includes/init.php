<?php
require_once "settings.php";
require_once "database.php";
require_once "formValid.php";
require_once "afspraakData.php";
require_once "behandelingData.php";

$connection = connectDatabase(DB_HOST, DB_USER, DB_PASS, DB_NAME);