<?php
/**
 * KONFIGURASI KONEKSI DATABASE LARAGON MYSQL
 * SIMPEL-UINSSC (Sistem Informasi Manajemen Pengaduan Layanan Sarpras)
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');      // Default username MySQL Laragon
define('DB_PASS', '');          // Default password MySQL Laragon (kosong)
define('DB_NAME', 'db_simpel_uinssc');
define('DB_CHARSET', 'utf8mb4');

function getPdoConnection() {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
    ];

    return new PDO($dsn, DB_USER, DB_PASS, $options);
}
