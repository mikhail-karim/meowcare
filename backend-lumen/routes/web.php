<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'users'], function () use ($router) {
    $router->get('/', 'UserController@getAll');
    $router->get('/id/{id}', 'UserController@getById');
    $router->get('/role/{role}', 'UserController@getByRole');
    $router->post('/register', 'UserController@register');
    $router->post('/login', 'UserController@login');

    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/logout', 'UserController@logout');
        $router->put('/edit', 'UserController@edit');
        $router->put('/change-role', 'UserController@changeRole');
        $router->delete('/', 'UserController@delete');
    });
});
    
$router->group(['prefix' => 'admins'], function () use ($router) {
    $router->get('/', 'AdminController@getAll');
    $router->get('/id/{id}', 'AdminController@getById');
    $router->post('/register', 'AdminController@register');
    $router->post('/login', 'AdminController@login');

    $router->group(['middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
        $router->post('/logout', 'AdminController@logout');
        $router->put('/edit', 'AdminController@edit');
        $router->delete('/', 'AdminController@delete');
    });
});
