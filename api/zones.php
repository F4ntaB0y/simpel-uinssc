<?php
/**
 * API ENDPOINT CAMPUS ZONES & GEOFENCING - SIMPEL UINSSC
 * Lokasi: api/zones.php
 * -------------------------------------------------------------
 * Menyediakan endpoint RESTful JSON untuk mengambil (GET)
 * dan menyimpan/memperbarui (POST) data batas wilayah polygon geofencing kampus.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';

try {
    $pdo = getPdoConnection();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Koneksi ke Database MySQL Laragon Gagal: ' . $e->getMessage()
    ]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: Ambil Seluruh Data Kawasan & Polygon Geofence
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM campus_zones ORDER BY id ASC");
        $zones = $stmt->fetchAll();

        // Decode JSON coordinates string to array
        $formatted = array_map(function($zone) {
            $coords = json_decode($zone['polygon_coordinates'], true);
            $zone['coordinates'] = $coords ?: [];
            return $zone;
        }, $zones);

        echo json_encode([
            'status' => 'success',
            'data' => $formatted
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal membaca data zona kampus: ' . $e->getMessage()
        ]);
    }
    exit;
}

// POST: Simpan / Perbarui Seluruh Daftar Zona Geofencing
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!is_array($inputData)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Format payload JSON tidak valid.'
        ]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO campus_zones (id, key_code, name, short_name, color, icon, desc_info, polygon_coordinates, status)
            VALUES (:id, :key_code, :name, :short_name, :color, :icon, :desc_info, :polygon_coordinates, :status)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name),
                short_name = VALUES(short_name),
                color = VALUES(color),
                icon = VALUES(icon),
                desc_info = VALUES(desc_info),
                polygon_coordinates = VALUES(polygon_coordinates),
                status = VALUES(status),
                updated_at = NOW()");

        foreach ($inputData as $index => $z) {
            $id = !empty($z['id']) ? $z['id'] : 'ZONE-' . str_pad($index + 1, 2, '0', STR_PAD_LEFT);
            $keyCode = !empty($z['key']) ? $z['key'] : (!empty($z['key_code']) ? $z['key_code'] : 'zone_' . ($index + 1));
            $name = !empty($z['name']) ? $z['name'] : 'Kawasan Kampus';
            $shortName = !empty($z['short']) ? $z['short'] : (!empty($z['short_name']) ? $z['short_name'] : $name);
            $color = !empty($z['color']) ? $z['color'] : '#10b981';
            $icon = !empty($z['icon']) ? $z['icon'] : 'fa-building-columns';
            $desc = !empty($z['desc']) ? $z['desc'] : (!empty($z['desc_info']) ? $z['desc_info'] : '');
            
            $coords = isset($z['coordinates']) ? $z['coordinates'] : (isset($z['polygon_coordinates']) ? $z['polygon_coordinates'] : []);
            $coordsJson = is_string($coords) ? $coords : json_encode($coords);

            $status = !empty($z['status']) ? $z['status'] : 'Aktif';

            $stmt->execute([
                ':id' => $id,
                ':key_code' => $keyCode,
                ':name' => $name,
                ':short_name' => $shortName,
                ':color' => $color,
                ':icon' => $icon,
                ':desc_info' => $desc,
                ':polygon_coordinates' => $coordsJson,
                ':status' => $status
            ]);
        }

        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Seluruh batas wilayah geofencing berhasil disimpan ke database MySQL Laragon.',
            'count' => count($inputData)
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal menyimpan perubahan batas geofencing: ' . $e->getMessage()
        ]);
    }
    exit;
}
