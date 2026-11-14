<?php
/**
 * Contact form handler for GoDaddy shared hosting (static export, Option B).
 * Set NEXT_PUBLIC_FORM_ENDPOINT=/contact.php before `npm run build`.
 * Edit the three settings below on the server (or set them as server environment variables).
 */
$CONTACT_TO_EMAIL   = getenv('CONTACT_TO_EMAIL') ?: 'info@smartsolutionsinc.ca'; // inbox that receives enquiries
$CONTACT_FROM_EMAIL = 'noreply@smartsolutionsinc.ca'; // sender on your domain (SPF/DKIM must allow this server)
$GHL_WEBHOOK_URL    = '';                    // optional GoHighLevel inbound webhook

header('Content-Type: application/json; charset=utf-8');

function respond($code, $data) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

if ($CONTACT_TO_EMAIL === '') {
    respond(500, ['ok' => false, 'error' => 'The contact form is not configured yet. Please call us instead.']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) { $data = $_POST; }

function field($data, $key, $max) {
    $v = isset($data[$key]) && is_string($data[$key]) ? trim($data[$key]) : '';
    return mb_substr($v, 0, $max);
}

// Honeypot: pretend success.
if (field($data, 'website', 200) !== '') {
    respond(200, ['ok' => true]);
}

$name    = field($data, 'name', 100);
$email   = field($data, 'email', 200);
$phone   = field($data, 'phone', 40);
$company = field($data, 'company', 200);
$service = field($data, 'service', 120);
$budget  = field($data, 'budget', 40);
$message = field($data, 'message', 5000);

if ($name === '')    { respond(422, ['ok' => false, 'error' => 'Please enter your name.']); }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { respond(422, ['ok' => false, 'error' => 'Please enter a valid email.']); }
if ($message === '') { respond(422, ['ok' => false, 'error' => 'Please add a short message.']); }

$e = function ($s) { return htmlspecialchars($s === '' ? '—' : $s, ENT_QUOTES, 'UTF-8'); };
$rows = [
    'Name' => $name, 'Email' => $email, 'Phone' => $phone,
    'Company / website' => $company, 'Service' => $service, 'Monthly budget' => $budget,
];
$html = '<h2>New website enquiry</h2><table cellpadding="6">';
foreach ($rows as $k => $v) { $html .= '<tr><td><strong>' . $k . '</strong></td><td>' . $e($v) . '</td></tr>'; }
$html .= '</table><p><strong>Message</strong></p><p>' . nl2br($e($message)) . '</p>';

// Strip CR/LF from anything that goes into headers.
$safeName  = preg_replace('/[\r\n]+/', ' ', $name);
$safeEmail = preg_replace('/[\r\n]+/', '', $email);
$subject   = 'New lead: ' . $safeName . ($service ? ' - ' . preg_replace('/[\r\n]+/', ' ', $service) : '');

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Smart Solutions <{$CONTACT_FROM_EMAIL}>\r\n";
$headers .= "Reply-To: {$safeName} <{$safeEmail}>\r\n";

$mailOk = @mail($CONTACT_TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html, $headers);

$ghlOk = false;
if ($GHL_WEBHOOK_URL !== '' && function_exists('curl_init')) {
    $ch = curl_init($GHL_WEBHOOK_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode([
            'name' => $name, 'email' => $email, 'phone' => $phone, 'company' => $company,
            'service' => $service, 'budget' => $budget, 'message' => $message,
            'source' => 'vasay.ai website',
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $ghlOk = $status >= 200 && $status < 300;
}

if (!$mailOk && !$ghlOk) {
    respond(502, ['ok' => false, 'error' => "We couldn't send your message. Please call us instead."]);
}
respond(200, ['ok' => true]);
