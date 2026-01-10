<?php
include 'db.php';
session_start();

$email = $_POST['Email'] ?? '';
$password = $_POST['Password'] ?? '';

// Use prepared statements to avoid SQL injection
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    // Successful login
    $_SESSION['user_id'] = $user['id'];
    header("Location: ../checkout.html");
    exit;
} else {
    // Failed login
    echo "Invalid email or password.";
}