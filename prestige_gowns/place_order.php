<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$institution = $data['institution'] ?? '';
$delivery_address = $data['delivery_address'] ?? '';
$items = json_encode($data['items'] ?? []);
$total_amount = $data['total'] ?? 0;

$sql = "INSERT INTO orders (name, email, institution, delivery_address, items, total_amount) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssd", $name, $email, $institution, $delivery_address, $items, $total_amount);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);

    // Safely decrement product stock if the 'products' table exists and items provided
    if (!empty($data['items']) && is_array($data['items'])) {
        $upd = $conn->prepare("UPDATE products SET stock = stock - 1 WHERE name = ?");
        foreach ($data['items'] as $item) {
            $prodName = $item['name'] ?? null;
            if ($prodName) {
                $upd->bind_param("s", $prodName);
                $upd->execute();
            }
        }
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

exit;