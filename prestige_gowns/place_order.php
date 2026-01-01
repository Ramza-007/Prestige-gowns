<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'];
$email = $data['email'];
$institution = $data['institution'];
$delivery_address = $data['address'];
$items = json_encode($data['items']);
$total_amount = $data['total'];

$sql = "INSERT INTO orders (name, email, institution, delivery_address, items, total_amount) VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssd",
         $name, $email, $institution, $delivery_address, $items, $total_amount);

$stmt->execute();
echo json_encode(['success' => true]);

foreach ($data['items'] as $item) {
    $conn->query
    ("UPDATE products
        SET stock = stock - 1
        WHERE name = '{$item['name']}'
        ");
}