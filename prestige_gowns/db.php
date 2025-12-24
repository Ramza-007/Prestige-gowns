<?php
$conn = new mysqli("localhost", "root", "", "prestige_gowns");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>