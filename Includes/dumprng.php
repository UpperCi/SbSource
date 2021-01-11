<?php
require_once "init.php";
// dumpt waarden in openingstijden, geen zin om ze handmatig in te voeren
for ($i = 1; $i < 15; $i++) {
    $base = strtotime("2/{$i}/2021");
    $hourStart = rand(9, 11);
    $hourEnd = rand(16, 19);
    $start = $base + $hourStart * 3600;
    $end = $base + $hourEnd * 3600;

    $delQuery = "DELETE FROM `openingstijden` WHERE id = {$i};";
    $addQuery = "INSERT INTO `openingstijden` (`id`, `start`, `end`) VALUES ({$i},$start,$end);";

    $connection->query($delQuery);
    $connection->query($addQuery);
}