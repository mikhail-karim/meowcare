<?php

/** @var \Laravel\Lumen\Routing\Router $router */

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

// Ras
$router->group(['prefix' => 'ras'], function () use ($router) {
    $router->get('/', 'RasController@index');
    $router->get('/{id}', 'RasController@show');
    $router->post('/', 'RasController@store');
    $router->put('/{id}', 'RasController@update');
    $router->delete('/{id}', 'RasController@destroy');
});

// Warna
$router->group(['prefix' => 'warna'], function () use ($router) {
    $router->get('/', 'WarnaController@index');
    $router->get('/{id}', 'WarnaController@show');
    $router->post('/', 'WarnaController@store');
    $router->put('/{id}', 'WarnaController@update');
    $router->delete('/{id}', 'WarnaController@destroy');
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

    $router->group(['middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
        $router->post('/as-admin', 'PetController@storeAsAdmin');
        $router->put('/{id}', 'PetController@update');
        $router->put('/status/{field}/{id}', 'PetController@updateStatus');
        $router->delete('/{id}', 'PetController@destroy');
    });
});

// Riwayat Penyakit
$router->group(['prefix' => 'riwayat_penyakit'], function () use ($router) {
    $router->get('/', 'RiwayatPenyakitController@index');
    $router->get('/{id}', 'RiwayatPenyakitController@show');
    $router->get('/pet/{pet_id}', 'RiwayatPenyakitController@getByPetId');

    $router->group(['middleware' => ['jwt.auth', 'role:user,admin']], function () use ($router) {
        $router->post('/', 'RiwayatPenyakitController@store');
        $router->put('/{id}', 'RiwayatPenyakitController@update');
        $router->delete('/{id}', 'RiwayatPenyakitController@destroy');
    });
});

// Pengajuan
$router->group(['prefix' => 'pengajuan'], function () use ($router) {
    $router->get('/', 'PengajuanController@index');
    $router->get('/{id}', 'PengajuanController@show');
    $router->delete('/{id}', 'PengajuanController@destroy');

    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'PengajuanController@store');
        $router->put('/{id}', 'PengajuanController@update');
    });
});

// Konfirmasi
$router->group(['prefix' => 'konfirmasi', 'middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
    $router->get('/', 'KonfirmasiController@index');
    $router->post('/', 'KonfirmasiController@store');
    $router->delete('/{id}', 'KonfirmasiController@destroy');
});

// Artikel
$router->group(['prefix' => 'artikel'], function () use ($router) {
    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->get('/', 'ArtikelController@index');
        $router->get('/{id}', 'ArtikelController@show');
        $router->put('/view/{id}', 'ArtikelController@view');
        $router->put('/likes/{id}', 'ArtikelController@likes');
    });

    $router->group(['middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
        $router->post('/', 'ArtikelController@storeAsAdmin');
        $router->put('/{id}', 'ArtikelController@update');
        $router->delete('/{id}', 'ArtikelController@destroy');
    });
});

// Comments
$router->group(['prefix' => 'comments', 'middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
    $router->get('/', 'CommentsController@index');
    $router->get('/{id}', 'CommentsController@show');
    $router->get('artikel/{artikel_ID}', 'CommentsController@getByArtikelId');
    $router->post('/', 'CommentsController@store');
    $router->put('/{id}', 'CommentsController@update');
    $router->delete('/{id}', 'CommentsController@destroy');
});

// Donation
$router->group(['prefix' => 'donation'], function () use ($router) {
    $router->get('/', 'DonationController@index');
    $router->get('/{id}', 'DonationController@show');

    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'DonationController@store');
        $router->put('/{id}', 'DonationController@update');
        $router->delete('/{id}', 'DonationController@destroy');
    });
});

// Report
$router->group(['prefix' => 'report'], function () use ($router) {
    $router->get('/', 'ReportController@index');
    $router->get('/rescued', 'ReportController@getRescued');
    $router->get('/notrescued', 'ReportController@getNotRescued');
    $router->get('/listreport', 'ReportController@allreport');

    $router->group(['middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
        $router->put('/rescued/{reportId}', 'ReportController@updateRescuedStatus');
    });

    $router->get('/{id}', 'ReportController@show');

    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'ReportController@store');
        $router->put('/{id}', 'ReportController@update');
        $router->delete('/{id}', 'ReportController@destroy');
    });
});

// Seeder route
$router->get('/seed-all', function () {
    require_once database_path('seeders/UserSeeder.php');
    require_once database_path('seeders/AdminSeeder.php');
    require_once database_path('seeders/PenyakitSeeder.php');
    require_once database_path('seeders/RasSeeder.php');
    require_once database_path('seeders/WarnaSeeder.php');

    $usersSeeder = new \Database\Seeders\UserSeeder();
    $adminSeeder = new \Database\Seeders\AdminSeeder();
    $penyakitSeeder = new \Database\Seeders\PenyakitSeeder();
    $rasSeeder = new \Database\Seeders\RasSeeder();
    $warnaSeeder = new \Database\Seeders\WarnaSeeder();

    $usersSeeder->run();
    $adminSeeder->run();
    $penyakitSeeder->run();
    $rasSeeder->run();
    $warnaSeeder->run();

    return response()->json(['status' => 'Semua Seeder berhasil dijalankan!']);
});
