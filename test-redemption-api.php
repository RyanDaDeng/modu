<?php

// 测试兑换码 API

$apiUrl = 'http://127.0.0.1:8000/api/redemption/create';  // 本地测试
// $apiUrl = 'https://your-domain.com/api/redemption/create';  // 生产环境

$apiKey = 'your-secret-api-key-here';  // 替换为你的 API 密钥

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'X-API-Key: ' . $apiKey
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'type' => 'vip',
    'value' => 30,
    'reference' => 'test-' . time()
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
if ($error) {
    echo "Error: " . $error . "\n";
}
echo "Response: " . $response . "\n";

// 如果是 405 错误，尝试不同的 URL 格式
if ($httpCode == 405) {
    echo "\n=== URL 可能需要调整 ===\n";
    echo "如果你的 Laravel 项目在子目录，试试这些 URL:\n";
    echo "- http://your-domain.com/moxing-app/public/api/redemption/create\n";
    echo "- http://your-domain.com/backend/api/redemption/create\n";
    echo "- http://your-domain.com/api/redemption/create\n";
}