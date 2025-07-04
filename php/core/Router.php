<?php
class Router {
    private $routes = ['GET'=>[], 'POST'=>[]];
    public function get($path, $handler) { $this->routes['GET'][$path] = $handler; }
    public function post($path, $handler) { $this->routes['POST'][$path] = $handler; }
    public function dispatch($method, $path) {
        $handler = $this->routes[$method][$path] ?? null;
        if (!$handler) {
            http_response_code(404);
            echo 'Not found';
            return;
        }
        [$class, $action] = $handler;
        require_once __DIR__ . '/../controllers/' . $class . '.php';
        (new $class)->$action();
    }
}
