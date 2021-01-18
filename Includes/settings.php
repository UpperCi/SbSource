<?php
define("DB_HOST", "localhost");
define("DB_USER", "1007501");
define("DB_PASS", "placeholder");
define("DB_NAME", "1007501");

set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, $severity, $severity, $file, $line);
});
