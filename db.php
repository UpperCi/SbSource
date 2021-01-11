<?php
require_once "Includes/init.php";
require_once "Includes/loginValidation.php";
requireLogin($connection);
$pending = afspraakAssoc($connection, 0); // afspraken die nog geen definitieve status hebben
?>

<html lang="en">
<head>
    <?= file_get_contents("Includes/head.html"); ?>
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
    <title>Surely Beauty</title>
    <script>
        const USER = "<?= $_SESSION['user']; ?>";
        const PASS = "<?= $_SESSION['pass']; ?>";
    </script>
</head>
<body>
<div id="db-afspraken">
    <div id="afspraak-overzicht"></div>
    <div id="afspraak-pending">
        <h2>In Afwachting</h2>
        <div id="pending-content">
            <?php foreach($pending as $afspraak){ ?>
                <?= quickAfspraakHTML($afspraak); ?>
            <?php } ?>
        </div>
    </div>
</div>
</body>

<script async defer src="Includes/db.js"></script>