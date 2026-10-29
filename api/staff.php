<?php
/**
 * API ENDPOINT STAFF ACCOUNTS & WILAYAH - SIMPEL UINSSC
 * Lokasi: api/staff.php
 * -------------------------------------------------------------
 * Menyediakan endpoint RESTful JSON untuk mengambil (GET)
 * dan menyimpan/memperbarui (POST) akun staf/teknisi serta penugasan wilayah.
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

// GET: Ambil Seluruh Data Akun Staff, Teknisi & Mitra
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, username, nama, role, bidang, wa, wilayah, status, created_at FROM staff_accounts ORDER BY role ASC, id ASC");
        $staffs = $stmt->fetchAll();

        // Decode JSON wilayah
        $formatted = array_map(function($s) {
            $s['wilayah'] = !empty($s['wilayah']) ? json_decode($s['wilayah'], true) : [];
            return $s;
        }, $staffs);

        echo json_encode([
            'status' => 'success',
            'data' => $formatted
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal membaca data personil: ' . $e->getMessage()
        ]);
    }
    exit;
}

// POST: Simpan / Sinkronkan Akun Staff & Penugasan Wilayah
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!is_array($inputData)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Payload JSON staff tidak valid.'
        ]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO staff_accounts (id, username, password, nama, role, bidang, wa, wilayah, status)
            VALUES (:id, :username, :password, :nama, :role, :bidang, :wa, :wilayah, :status)
            ON DUPLICATE KEY UPDATE 
                username = VALUES(username),
                nama = VALUES(nama),
                role = VALUES(role),
                bidang = VALUES(bidang),
                wa = VALUES(wa),
                wilayah = VALUES(wilayah),
                status = VALUES(status)");

        foreach ($inputData as $index => $s) {
            $id = !empty($s['id']) ? $s['id'] : 'STF-' . str_pad($index + 1, 2, '0', STR_PAD_LEFT);
            $username = !empty($s['username']) ? $s['username'] : null;
            $password = !empty($s['password']) ? $s['password'] : 'petugas123';
            $nama = !empty($s['nama']) ? $s['nama'] : 'Nama Personil';
            $role = !empty($s['role']) ? $s['role'] : 'petugas';
            $bidang = !empty($s['bidang']) ? $s['bidang'] : 'Operasional';
            $wa = !empty($s['wa']) ? $s['wa'] : '';

            $wilayah = isset($s['wilayah']) ? $s['wilayah'] : [];
            $wilayahJson = is_string($wilayah) ? $wilayah : json_encode($wilayah);

            $status = !empty($s['status']) ? $s['status'] : 'Aktif';

            $stmt->execute([
                ':id' => $id,
                ':username' => $username,
                ':password' => $password,
                ':nama' => $nama,
                ':role' => $role,
                ':bidang' => $bidang,
                ':wa' => $wa,
                ':wilayah' => $wilayahJson,
                ':status' => $status
            ]);
        }

        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Data personil & penugasan wilayah berhasil disinkronkan ke database MySQL.',
            'count' => count($inputData)
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal menyimpan data personil: ' . $e->getMessage()
        ]);
    }
    exit;
}
