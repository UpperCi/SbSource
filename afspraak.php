<?php
require_once "Includes/init.php";
$behandelingen = behandelAssoc($connection);
$errs = [];
# de pagina's form redirect naar zichzelf, dit handelt de data af
# indien anlles geldig is, voeg het aan de database toe en ga naar de tracker
if (isset($_POST['submit'])) {
    $errs = validateAfspraak($_POST);
    if (empty($errs)) {
        print_r($_POST);
        $tr = addAfspraak($_POST, $connection);
        $fullUrl = htmlspecialchars($_SERVER["PHP_SELF"]);
        $url = explode("/afspraak.php", $fullUrl)[0];
        header("Location: {$url}/afspraakTracker.php?af=" . $tr);
        die('redirect');
    }
}
?>

<!doctype html>
<html lang="en">
<head>
    <?= file_get_contents("Includes/head.html"); ?>
    <link rel="stylesheet" type="text/css" href="css/afspraak.css"/>
    <title>Surely Beauty - Maak een afspraak</title>
</head>
<body>
<form action="afspraak.php" method="post" action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
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
    </div>
    <h2 id="afspraak-selected-date"></h2>
    <p class="error" id="time-error"><?= arrIfSet($errs,'time'); ?></p>
    <ul id="time-select">
    </ul>
    <p class="error" id="behandel-error"><?= arrIfSet($errs,'behandelingen'); ?></p>
    <div id="behandel-selectie">

        <?php foreach ($behandelingen as $catNaam => $categorie){?>
            <button type="button" class="collapsible"><?= $catNaam ?></button>
            <div class="behandel-sectie">
                <?php foreach($categorie as $behandeling) { ?>
                    <label class="behandeling" for=<?= "behandeling_{$behandeling['id']}" ?>>
                        <?= behandelHTML($behandeling); ?>
                        <input type="checkbox" id=<?= "behandeling_{$behandeling['id']}" ?> class="behandel-check" name="behandelingen[]" value="<?= $behandeling['id']; ?>">
                    </label>
                <?php } ?>

            </div>
        <?php } ?>

    </div>

    <div id="contact-info">
        <p class="error" id="email-error"><?= arrIfSet($errs,'email'); ?></p>
        <label for="e-mailIn">
            <input type="email" name="e-mail" id="e-mailIn" placeholder="e-mail">
        </label>

        <p class="error" id="tel-error"><?= arrIfSet($errs,'phone'); ?></p>
        <label for="telIn">
            <input type="tel" name="phone" id="telIn" placeholder="tel">
        </label>

        <input type="submit" name="submit" value="submit">
    </div>


</form>

<footer>
    <?= file_get_contents("Includes/footer.html") ?>
</footer>

<script async defer src="Includes/index.js"></script>
<script async defer src="Includes/afspraak.js"></script>
</body>