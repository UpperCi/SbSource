<?php
require_once "Includes/init.php";
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="css/db.css"/>
    <title>Surelybeauty</title>
</head>
<body>
<p>Log in!</p>
<form action="db.php" method="post">
    <div class="login-field">
        <input type="text" value="" name="user">
    </div>
    <div class="login-field">
        <input type="password" value="" name="pass">
    </div>
    <input type="submit" name="submit" value="submit">
</form>
</body>
