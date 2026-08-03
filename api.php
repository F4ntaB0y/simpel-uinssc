<?php
/**
 * API ENDPOINT UNTUK KONEKSI KE DATABASE LARAGON MYSQL
 * SIMPEL-UINSSC (Sistem Informasi Manajemen Pengaduan Layanan Sarpras)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load Konfigurasi Database Terpisah
require_once __DIR__ . '/config/database.php';

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

// GET: Ambil Seluruh Data Laporan dari Laragon MySQL
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM reports ORDER BY tanggalLapor DESC");
        $reports = $stmt->fetchAll();
        echo json_encode($reports);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// POST: Sync/Simpan Data Laporan ke Laragon MySQL
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!is_array($inputData)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Format JSON tidak valid']);
        exit;
    }

    try {
        $pdo->beginTransaction();
        
        // Hapus data lama & ganti dengan dataset terbaru
        $pdo->exec("DELETE FROM reports");

        $sql = "INSERT INTO reports 
            (id, namaPelapor, nimNip, peranPelapor, kontakPelapor, gedung, ruangan, lat, lng, kategori, urgensi, deskripsi, foto, status, teknisi, catatanAdmin, tanggalLapor, tanggalUpdate) 
            VALUES 
            (:id, :namaPelapor, :nimNip, :peranPelapor, :kontakPelapor, :gedung, :ruangan, :lat, :lng, :kategori, :urgensi, :deskripsi, :foto, :status, :teknisi, :catatanAdmin, :tanggalLapor, :tanggalUpdate)";
        
        $stmt = $pdo->prepare($sql);

        foreach ($inputData as $row) {
            $stmt->execute([
                ':id' => $row['id'] ?? '',
                ':namaPelapor' => $row['namaPelapor'] ?? '',
                ':nimNip' => $row['nimNip'] ?? '',
                ':peranPelapor' => $row['peranPelapor'] ?? 'Mahasiswa',
                ':kontakPelapor' => $row['kontakPelapor'] ?? '',
                ':gedung' => $row['gedung'] ?? '',
                ':ruangan' => $row['ruangan'] ?? '',
                ':lat' => $row['lat'] ?? '-6.735000',
                ':lng' => $row['lng'] ?? '108.533800',
                ':kategori' => $row['kategori'] ?? '',
                ':urgensi' => $row['urgensi'] ?? 'Sedang',
                ':deskripsi' => $row['deskripsi'] ?? '',
                ':foto' => $row['foto'] ?? '',
                ':status' => $row['status'] ?? 'Diajukan',
                ':teknisi' => $row['teknisi'] ?? 'Belum Ditunjuk',
                ':catatanAdmin' => $row['catatanAdmin'] ?? '',
                ':tanggalLapor' => $row['tanggalLapor'] ?? date('Y-m-d H:i:s'),
                ':tanggalUpdate' => $row['tanggalUpdate'] ?? date('Y-m-d H:i:s')
            ]);
        }

        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Data berhasil disinkronkan ke Laragon MySQL']);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Gagal simpan ke MySQL: ' . $e->getMessage()]);
    }
    exit;
}
