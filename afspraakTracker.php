<?php
require_once "Includes/init.php";
//print_r($_GET['af']);
$info = getByTrackId($_GET['af'], $connection);

echo "<pre>";
echo(json_encode($info, JSON_PRETTY_PRINT));
echo "</pre>";

$ICSurl = createAfspraakICS($connection, $info);
?>
<!doctype html>
<html lang="en">
<head>
    <?= file_get_contents("Includes/head.html"); ?>
    <title>Surely Beauty</title>
</head>
<body>
<a href="<?= $ICSurl ?>">Download .ics bestand</a>
<!--<footer>-->
<!--    --><?//= file_get_contents("Includes/footer.html"); ?>
<!--</footer>-->
</body>
