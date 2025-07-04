<?php
require_once __DIR__ . '/../models/Book.php';
class BookController {
    public function index() {
        $books = Book::all();
        header('Content-Type: application/json');
        echo json_encode($books);
    }
}
