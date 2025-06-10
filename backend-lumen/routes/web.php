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

// Users
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
    

// Admins
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

// Penyakit
$router->group(['prefix' => 'penyakit'], function () use ($router) {
    $router->get('/', 'PenyakitController@index');
    $router->get('/{id}', 'PenyakitController@show');
    $router->post('/', 'PenyakitController@store');
    $router->put('/{id}', 'PenyakitController@update');
    $router->delete('/{id}', 'PenyakitController@destroy');
});

$router->get('/seed-penyakit', function () {
    require_once database_path('seeders/PenyakitSeeder.php');
    $seeder = new \Database\Seeders\PenyakitSeeder();
    $seeder->run();
    return response()->json(['status' => 'Seeder berhasil dijalankan!']);
});

// Ras
$router->group(['prefix' => 'ras'], function () use ($router) {
    $router->get('/', 'RasController@index');
    $router->get('/{id}', 'RasController@show');
    $router->post('/', 'RasController@store');
    $router->put('/{id}', 'RasController@update');
    $router->delete('/{id}', 'RasController@destroy');
});

$router->get('/seed-ras', function () {
    require_once database_path('seeders/RasSeeder.php');
    $seeder = new \Database\Seeders\RasSeeder();
    $seeder->run();
    return response()->json(['status' => 'Seeder Ras berhasil dijalankan!']);
});

// Warna
$router->group(['prefix' => 'warna'], function () use ($router) {
$router->get('/', 'WarnaController@index');
$router->get('/{id}', 'WarnaController@show');
$router->post('/', 'WarnaController@store');
$router->put('/{id}', 'WarnaController@update');
$router->delete('/{id}', 'WarnaController@destroy');
});

$router->get('/seed-warna', function () {
    require_once database_path('seeders/WarnaSeeder.php');
    $seeder = new \Database\Seeders\WarnaSeeder();
    $seeder->run();
    return response()->json(['status' => 'Seeder Warna berhasil dijalankan!']);
});

// Pets
$router->group(['prefix' => 'pets'], function () use ($router) {
    $router->get('/', 'PetController@index');               
    $router->get('/{id}', 'PetController@show');         

    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'PetController@store');                  
        $router->put('/{id}', 'PetController@update');         
        $router->put('/status/{field}/{id}', 'PetController@updateStatus');
        $router->delete('/{id}', 'PetController@destroy');          
    });
});

//Pengajuan
$router->group(['prefix' => 'pengajuan'], function () use ($router) {
    $router->get('/', 'PengajuanController@index');
    $router->get('/{id}', 'PengajuanController@show');
    $router->delete('/{id}', 'PengajuanController@destroy');
    
    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'PengajuanController@store');
        $router->put('/{id}', 'PengajuanController@update');
    });
});

//Konfirmasi
$router->group(['prefix' => 'konfirmasi', 'middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
    $router->get('/', 'KonfirmasiController@index');
    $router->post('/', 'KonfirmasiController@store');
    $router->delete('/{id}', 'KonfirmasiController@destroy');
});
