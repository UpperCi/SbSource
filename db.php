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
                    <th><label for="do-erase"><i class="fas fa-eraser"></i></label>
                        <input type="checkbox" id="do-erase"></th>
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
    </div>
    <div id="afspraken">

    </div>

    <div id="timeslot-overzicht">

    </div>
    <div id="afspraak-adder">
        <label>
            <input type="time" id="time-start">
        </label>
        <label>
            <input type="time" id="time-end">
        </label>
        <label>
            <input type="date" id="time-date">
        </label>

        <label for="do-repeat">Herhaal openingstijd</label>
        <input type="checkbox" id="do-repeat">

        <div id="repeat-div" style="display: none">
            <label for="time-repeat-type" class="time-desc">herhaal elke </label>
            <select id="time-repeat-type">
                <option value="d">dag</option>
                <option value="w">week</option>
                <option value="m">maand</option>
            </select>
            <p class="time-desc"> voor </p>
            <input type="number" id="time-repeat-amount">
            <label for="time-repeat-amount"> keer.</label>
        </div>

        <i class="fas fa-plus" id="afpsraak-adder-btn"></i>

    </div>

    <div id="afspraak-overzicht">
        <div id="afspraak-pending">
            <h2>In Afwachting</h2>
            <div id="pending-content">
                <?php foreach($pending as $afspraak){ ?>
                    <?= quickAfspraakHTML($afspraak); ?>
                <?php } ?>
            </div>
        </div>

    </div>
</div>


</body>

<script async defer src="Includes/calendar.js"></script>
<script async defer src="Includes/db.js"></script>