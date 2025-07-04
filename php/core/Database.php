<?php
class Database {
    private static $instance;
    public static function getInstance() {
        if (!self::$instance) {
            $cfg = include __DIR__.'/../config.php';
            $db = $cfg['db'];
            $dsn = "mysql:host={$db['host']};dbname={$db['dbname']};charset={$db['charset']}";
            self::$instance = new PDO($dsn, $db['user'], $db['pass']);
            self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return self::$instance;
    }
}
