<?php
/**
 * API ROUTER / GATEWAY - SIMPEL UINSSC
 * Lokasi: api/index.php
 * -------------------------------------------------------------
 * Router utama untuk mendistribusikan request ke handler endpoint masing-masing.
 */

$resource = isset($_GET['resource']) ? strtolower(trim($_GET['resource'])) : 'reports';

switch ($resource) {
    case 'zones':
    case 'geofence':
        require_once __DIR__ . '/zones.php';
        break;

    case 'categories':
    case 'kategori':
        require_once __DIR__ . '/categories.php';
        break;

    case 'staff':
    case 'teknisi':
        require_once __DIR__ . '/staff.php';
        break;

    case 'reports':
    default:
        require_once __DIR__ . '/reports.php';
        break;
}
