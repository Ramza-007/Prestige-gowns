<?php
include 'db.php';

$name = $_POST['Name'];
$email = $_POST['Email'];
$password = password_hash($_POST['Password'], PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $password);
$stmt->execute();

header("Location: ../login.html");