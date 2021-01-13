<?php
# deze pagina werkt als een soort API om SQL-queries uit te voeren in JavaScript
# dat zorgt ervoor dat je de pagina niet hoeft te herladen met elke query
# indien de query iets returnt wordt dit als JSON uitgeprint voor de JS
require_once "Includes/init.php";

function returnIfValid($connection, $query) {
    $result = $connection->query($query)
    ->fetchAll(PDO::FETCH_ASSOC);
    if ($result != FALSE){
        return $result;
    }
    return false;
}

/* type queries
 * 0 -> haal afspraken op per dag [admin]
 * 1 -> haal behandelingen op
 * 2 -> haal openingstijden specifieke dag op | d = date-string
 * 3 -> haal per dag van maand op of SB die dag open is | d = date-string
 * 4 -> update status van specifieke afspraak [admin] | status = integer, id = integer
 * 5 -> voeg een admin_account toe [admin+] | newU = string, newP = string
 * */

if (isset($_GET['t'])){
    switch ($_GET['t']) {
        case 0: // haal afspraken op
            require_once "Includes/loginValidation.php";
            if (checkLogin($connection, $_GET)) {
                $startTime = strtotime($_GET['d']);
                if (!is_integer($startTime)) break;
                $endTime = $startTime + 86400;

                $statement = $connection->prepare
                ("SELECT * FROM afspraken WHERE start > :start AND end < :end");
                $statement->execute([
                    ':start' => $startTime,
                    ':end' => $endTime
                ]);
                $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
                break;
            }
            break;
        case 1:
            echo json_encode(returnIfValid($connection, "SELECT * FROM behandelingen"));
            break;
        case 2: // json openingstijden van specifieke dag (_get[d])
            $startTime = strtotime($_GET['d']);
            if (!is_integer($startTime)) break;
            $endTime = $startTime + 86400;

            $statement = $connection->prepare
            ("SELECT * FROM openingstijden WHERE start > :start AND end < :end");
            $statement->execute([
                ':start' => $startTime,
                ':end' => $endTime
            ]);
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
            break;
        case 3: // json array per dag van maand wel of geen mogelijke tijden
            $baseTime = strtotime($_GET['d']);

            $isOpen = [];

            for ($i = 0; $i < 32; $i++) {
                $startTime = $baseTime + 86400 * $i;
                $endTime = $startTime + 86400;
                $statement = $connection->prepare
                ("SELECT * FROM openingstijden WHERE start > :start AND end < :end");
                $statement->execute([
                    ':start' => $startTime,
                    ':end' => $endTime
                ]);
                $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                if (count($result) > 0) {
                    array_push($isOpen, true);
                }
                else {
                    array_push($isOpen, false);
                }
            }
            echo json_encode($isOpen);
            break;
        case 4: // accept/deny afspraak
            require_once "Includes/loginValidation.php";
            if (checkLogin($connection, $_GET)) {

                $status = intval($_GET['status']);
                $id = intval($_GET['id']);

                $query = "UPDATE `afspraken` SET status = :status WHERE id = :id";
                $statement = $connection->prepare($query);
                $statement->execute([
                    ":status" => $status,
                    ":id" => $id
                ]);

            }
            break;
        case 5:
            require_once "Includes/loginValidation.php";
            if (checkAdmin($connection, $_GET)) {
                $newUser = $_GET['newU'];
                $newPass = password_hash($_GET['newP'], PASSWORD_BCRYPT, ['cost' => 12]);
                $statement = $connection->prepare("INSERT INTO admin_accounts VALUES 
                (NULL, :user, :pass, 0)");
                $statement->execute([':user' => $newUser, ':pass' => $newPass]);
            }
            break;
    }
}