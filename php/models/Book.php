<?php
require_once __DIR__ . '/../core/Database.php';
class Book {
    public static function all() {
        $pdo = Database::getInstance();
        $stmt = $pdo->query('SELECT * FROM books');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
