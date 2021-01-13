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
    <div id="kalendar-container">
        <div id="afspraak-kalender">
            <h2 id="kalender-date-desc"></h2>
            <table>
                <thead>
                <tr>
                    <th>Zo</th>
                    <th>Ma</th>
                    <th>Di</th>
                    <th>Wo</th>
                    <th>Do</th>
                    <th>Vr</th>
                    <th>Za</th>
                </tr>
                </thead>
                <tbody id="kalender-body">

                </tbody>
            </table>
            <div id="kalender-btns">
                <input type="button" id="kalender-prev" value="vorige">
                <input type="button" id="kalender-next" value="volgende">
            </div>
        </div>
        <div id="afspraken">

        </div>
    </div>


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