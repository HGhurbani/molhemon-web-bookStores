<?php
require_once __DIR__ . '/core/Router.php';
$router = new Router();
$router->get('/books', ['BookController', 'index']);
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$router->dispatch($_SERVER['REQUEST_METHOD'], rtrim($path,'/'));
