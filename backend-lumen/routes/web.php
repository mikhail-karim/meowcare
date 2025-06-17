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
    $router->post('/register', 'UserController@register'); //Nama_Lengkap, Username, Email, Password, Foto_Profil
    $router->post('/login', 'UserController@login'); //Email, Password
    $router->post('/upload_photo', 'UserController@uploadProfilePhoto');
    $router->put('/forget_password', 'UserController@forgetPassword');

    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/logout', 'UserController@logout');
        $router->put('/edit', 'UserController@edit'); //Nama_Lengkap, Username, Email, Nomor_HP, Alamat, Password, Foto_Profil
        $router->put('/change-role', 'UserController@changeRole');
        $router->delete('/', 'UserController@delete');
    });
});
    

// Admins
$router->group(['prefix' => 'admins'], function () use ($router) {
    $router->get('/', 'AdminController@getAll');
    $router->get('/id/{id}', 'AdminController@getById');
    $router->post('/register', 'AdminController@register'); //Nama_Lengkap, Username, Email, Password
    $router->post('/login', 'AdminController@login'); //Email, Password

    $router->group(['middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
        $router->post('/logout', 'AdminController@logout');
        $router->put('/edit', 'AdminController@edit'); //Nama_Lengkap, Username, Email, Nomor_HP, Alamat, Password
        $router->delete('/', 'AdminController@delete');
    });
});

// Penyakit
$router->group(['prefix' => 'penyakit'], function () use ($router) {
    $router->get('/', 'PenyakitController@index');
    $router->get('/{id}', 'PenyakitController@show');
    $router->post('/', 'PenyakitController@store'); //Nama, Gejala, Penyebab, Obat
    $router->put('/{id}', 'PenyakitController@update');
    $router->delete('/{id}', 'PenyakitController@destroy');
});


// Ras
$router->group(['prefix' => 'ras'], function () use ($router) {
    $router->get('/', 'RasController@index');
    $router->get('/{id}', 'RasController@show');
    $router->post('/', 'RasController@store'); //Nama, Asal, Ciri_Khas
    $router->put('/{id}', 'RasController@update');
    $router->delete('/{id}', 'RasController@destroy');
});



// Warna
$router->group(['prefix' => 'warna'], function () use ($router) {
$router->get('/', 'WarnaController@index');
$router->get('/{id}', 'WarnaController@show');
$router->post('/', 'WarnaController@store');//Nama, Kode_warna
$router->put('/{id}', 'WarnaController@update');
$router->delete('/{id}', 'WarnaController@destroy');
});



// Pets
$router->group(['prefix' => 'pets'], function () use ($router) {
    $router->get('/', 'PetController@index');               
    $router->get('/{id}', 'PetController@show');         

    // User routes
    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'PetController@store'); //Nama, Foto, Umur, Jenis_Kelamin, Ras_ID, Warna_ID              
        $router->put('/{id}', 'PetController@update');//Nama, Foto, Umur, Jenis_Kelamin, Ras_ID, Warna_ID     
        $router->put('/status/{field}/{id}', 'PetController@updateStatus'); //Field = Adopted, Divaksin, Sterilisasi
        $router->delete('/{id}', 'PetController@destroy');          
    });

    // Admin routes
    $router->group(['middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
        $router->post('/as-admin', 'PetController@storeAsAdmin'); //Nama, Foto, Umur, Jenis_Kelamin, Ras_ID, Warna_ID 
        $router->put('/{id}', 'PetController@update'); //Nama, Foto, Umur, Jenis_Kelamin, Ras_ID, Warna_ID 
        $router->put('/status/{field}/{id}', 'PetController@updateStatus'); //Field = Adopted, Divaksin, Sterilisasi
        $router->delete('/{id}', 'PetController@destroy');          
    });
});

//Riwayat Penyakit
$router->group(['prefix' => 'riwayat_penyakit'], function () use ($router) {

    $router->get('/', 'RiwayatPenyakitController@index');
    $router->get('/{id}', 'RiwayatPenyakitController@show');
    $router->get('/pet/{pet_id}', 'RiwayatPenyakitController@getByPetId');

    $router->group(['middleware' => ['jwt.auth', 'role:user,admin']], function () use ($router) {
        $router->post('/', 'RiwayatPenyakitController@store'); //Penyakit_ID, Pet_ID, Status
        $router->put('/{id}', 'RiwayatPenyakitController@update'); //Status
        $router->delete('/{id}', 'RiwayatPenyakitController@destroy');
    });
});


//Pengajuan
$router->group(['prefix' => 'pengajuan'], function () use ($router) {
    $router->get('/', 'PengajuanController@index');
    $router->get('/{id}', 'PengajuanController@show');
    $router->delete('/{id}', 'PengajuanController@destroy');
    
    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'PengajuanController@store'); //Alasan, Pet_ID
        $router->put('/{id}', 'PengajuanController@update'); //Alasan, Pet_ID, Approved, User_ID
    });
});

//Konfirmasi
$router->group(['prefix' => 'konfirmasi', 'middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
    $router->get('/', 'KonfirmasiController@index');
    $router->post('/', 'KonfirmasiController@store'); //Pengajuan_ID
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
        $router->post('/', 'ArtikelController@storeAsAdmin'); //Judul, Thumbnail, Artikel, Kategori
        $router->put('/{id}', 'ArtikelController@update'); //Judul, Thumbnail, Artikel, Kategori          
        $router->delete('/{id}', 'ArtikelController@destroy');       
    });
});

//Comments
$router->group(['prefix' => 'comments', 'middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
    $router->get('/', 'CommentsController@index');
    $router->get('/{id}', 'CommentsController@show');
    $router->get('artikel/{artikel_ID}', 'CommentsController@getByArtikelId');
    $router->post('/', 'CommentsController@store'); //Artikel_ID, Comments
    $router->put('/{id}', 'CommentsController@update'); //Comments
    $router->delete('/{id}', 'CommentsController@destroy');
});

//Donation
$router->group(['prefix' => 'donation'], function () use ($router) {
    $router->get('/', 'DonationController@index');
    $router->get('/{id}', 'DonationController@show');

    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'DonationController@store'); //Nominal, Catatan
        $router->put('/{id}', 'DonationController@update'); //Nominal, Catatan
        $router->delete('/{id}', 'DonationController@destroy');
    });
});

//Report
$router->group(['prefix' => 'report'], function () use ($router) {
    $router->get('/', 'ReportController@index');
    $router->get('/rescued', 'ReportController@getRescued');
    $router->get('/notrescued', 'ReportController@getNotRescued');

    $router->group(['middleware' => ['jwt.auth', 'role:admin']], function () use ($router) {
        $router->put('/rescued/{reportId}', 'ReportController@updateRescuedStatus');
    });
    
    $router->get('/{id}', 'ReportController@show');
    $router->group(['middleware' => ['jwt.auth', 'role:user']], function () use ($router) {
        $router->post('/', 'ReportController@store'); //Deskripsi, Foto
        $router->put('/{id}', 'ReportController@update'); //Deskripsi, Foto
        $router->delete('/{id}', 'ReportController@destroy');
    });
    
});


//Seeders

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
