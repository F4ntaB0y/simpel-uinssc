<?php
/**
 * API ENDPOINT CATEGORIES - SIMPEL UINSSC
 * Lokasi: api/categories.php
 * -------------------------------------------------------------
 * Menyediakan endpoint RESTful JSON untuk mengambil (GET)
 * dan menyimpan/memperbarui (POST) kategori fasilitas sarpras kampus.
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
        'message' => 'Koneksi Database Gagal: ' . $e->getMessage()
    ]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: Ambil Seluruh Data Kategori
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC");
        $categories = $stmt->fetchAll();
        echo json_encode([
            'status' => 'success',
            'data' => $categories
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal membaca data kategori: ' . $e->getMessage()
        ]);
    }
    exit;
}

// POST: Simpan / Sinkronkan Daftar Kategori
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!is_array($inputData)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Payload JSON kategori tidak valid.'
        ]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO categories (id, name, icon, color, sla_hours, deskripsi, status)
            VALUES (:id, :name, :icon, :color, :sla_hours, :deskripsi, :status)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name),
                icon = VALUES(icon),
                color = VALUES(color),
                sla_hours = VALUES(sla_hours),
                deskripsi = VALUES(deskripsi),
                status = VALUES(status)");

        foreach ($inputData as $index => $c) {
            $id = !empty($c['id']) ? $c['id'] : 'CAT-' . str_pad($index + 1, 2, '0', STR_PAD_LEFT);
            $name = !empty($c['name']) ? $c['name'] : (!empty($c['kategori']) ? $c['kategori'] : 'Kategori ' . ($index + 1));
            $icon = !empty($c['icon']) ? $c['icon'] : 'fa-wrench';
            $color = !empty($c['color']) ? $c['color'] : '#005a36';
            $sla = !empty($c['sla_hours']) ? intval($c['sla_hours']) : 24;
            $desc = !empty($c['deskripsi']) ? $c['deskripsi'] : '';
            $status = !empty($c['status']) ? $c['status'] : 'Aktif';

            $stmt->execute([
                ':id' => $id,
                ':name' => $name,
                ':icon' => $icon,
                ':color' => $color,
                ':sla_hours' => $sla,
                ':deskripsi' => $desc,
                ':status' => $status
            ]);
        }

        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Daftar kategori fasilitas berhasil disimpan.',
            'count' => count($inputData)
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal menyimpan kategori: ' . $e->getMessage()
        ]);
    }
    exit;
}
