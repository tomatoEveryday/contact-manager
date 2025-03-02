<?php
$secret = 'bbl';
$shellScript = '/var/github_pull/pull-prod.sh'; // Path to shell script
$shellScriptDev = '/var/github_pull/pull-dev.sh'; // Path to shell script (dev)

// Get the payload and verify the signature
$payload = file_get_contents('php://input');
$signature = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (hash_equals($signature, $_SERVER['HTTP_X_HUB_SIGNATURE_256'])) {
    $data = json_decode($payload, true);
    if ($data['ref'] === 'refs/heads/prod') {
        // Run the shell script
        shell_exec($shellScript);
        http_response_code(200);
        echo 'Script executed successfully';
    } elseif ($data['ref'] === 'refs/heads/dev') {
        // dev branch pull, run dev pull
        shell_exec($shellScriptDev);
        http_response_code(200);
        echo 'Script executed successfully for dev pull';
    } else {
        http_response_code(400);
        echo 'Invalid branch';
    }
} else {
    http_response_code(403);
    echo 'Invalid signature';
}
?>