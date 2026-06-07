<?php
/**
 * Jabulani Tech Solutions — Contact Form Handler
 * Uses Hostinger SMTP (STARTTLS on port 587) via pure-PHP socket.
 * No external libraries required.
 */

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

/* Honeypot anti-spam */
if (!empty($_POST['_honeypot'])) {
    echo json_encode(['success' => true, 'message' => "Thank you! We'll be in touch within 24 hours."]);
    exit;
}

/* ── SMTP CONFIG ───────────────────────────────────── */
/* Real credentials live in secrets.php, which is gitignored and never
   committed. Copy secrets.example.php to secrets.php and fill in the
   real values, then upload it to the server by hand (not via Git). */
$secrets_file = __DIR__ . '/secrets.php';
if (!file_exists($secrets_file)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error. Please email us directly at info@jabulanigroupofcompanies.co.za or call (+27) 660 684 585.',
    ]);
    exit;
}
require $secrets_file;

/* ── SANITISE INPUT ────────────────────────────────── */
$name     = trim(htmlspecialchars(strip_tags($_POST['name']     ?? ''), ENT_QUOTES, 'UTF-8'));
$business = trim(htmlspecialchars(strip_tags($_POST['business'] ?? ''), ENT_QUOTES, 'UTF-8'));
$email    = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$phone    = trim(htmlspecialchars(strip_tags($_POST['phone']    ?? ''), ENT_QUOTES, 'UTF-8'));
$service  = trim(htmlspecialchars(strip_tags($_POST['service']  ?? ''), ENT_QUOTES, 'UTF-8'));
$message  = trim(htmlspecialchars(strip_tags($_POST['message']  ?? ''), ENT_QUOTES, 'UTF-8'));

if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$service_labels = [
    'web-design' => 'Web Design & Development',
    'pos'        => 'POS & Business Software',
    'seo'        => 'SEO & Digital Marketing',
    'support'    => 'IT Support & Maintenance',
    'ai'         => 'AI Automation',
    'marketing'  => 'Marketing Pipelines',
    'other'      => 'Other / Not Sure',
];
$service_display = $service_labels[$service] ?? ($service ?: 'Not specified');

/* ── BUILD EMAIL BODY ──────────────────────────────── */
$subject = "New Enquiry — Jabulani Tech Solutions Website";
$body    = "New enquiry from the Jabulani Tech Solutions website.\n\n"
         . "────────────────────────────────\n"
         . "Name:     {$name}\n"
         . "Business: " . ($business ?: 'N/A') . "\n"
         . "Email:    {$email}\n"
         . "Phone:    " . ($phone ?: 'N/A') . "\n"
         . "Service:  {$service_display}\n"
         . "────────────────────────────────\n\n"
         . "Message:\n{$message}\n\n"
         . "────────────────────────────────\n"
         . "Sent: " . date('Y-m-d H:i:s T') . "\n"
         . "Via:  agency.jabulanigroupofcompanies.co.za\n";

$auto_subject = "We received your enquiry — Jabulani Tech Solutions";
$auto_body    = "Hi {$name},\n\n"
              . "Thank you for reaching out to Jabulani Tech Solutions!\n\n"
              . "We have received your enquiry and a member of our team will get back to you within 24 hours "
              . "(Monday to Friday, 08:00 – 17:00 SAST).\n\n"
              . "In the meantime, feel free to chat with us on WhatsApp: +27 660 684 585\n\n"
              . "Best regards,\n"
              . "Jabulani Tech Solutions Team\n"
              . "agency.jabulanigroupofcompanies.co.za\n"
              . "Phone: (+27) 660 684 585\n";

/* ── SMTP SEND ─────────────────────────────────────── */
function smtp_send(string $to, string $subject, string $body, string $reply_to = ''): bool {
    $socket = @fsockopen('tcp://' . SMTP_HOST, SMTP_PORT, $errno, $errstr, 15);
    if (!$socket) return false;

    $read = function ($s) { $r = ''; while ($l = fgets($s, 512)) { $r .= $l; if (substr($l, 3, 1) === ' ') break; } return $r; };

    $read($socket);                                                     // greeting
    fwrite($socket, "EHLO jabulanigroupofcompanies.co.za\r\n");        // EHLO
    $read($socket);
    fwrite($socket, "STARTTLS\r\n");                                    // negotiate TLS
    $read($socket);
    stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
    fwrite($socket, "EHLO jabulanigroupofcompanies.co.za\r\n");        // re-EHLO post-TLS
    $read($socket);
    fwrite($socket, "AUTH LOGIN\r\n");                                  // authenticate
    $read($socket);
    fwrite($socket, base64_encode(SMTP_USER) . "\r\n");
    $read($socket);
    fwrite($socket, base64_encode(SMTP_PASS) . "\r\n");
    $auth = $read($socket);
    if (substr(trim($auth), 0, 3) !== '235') { fclose($socket); return false; }

    fwrite($socket, "MAIL FROM:<" . FROM_ADDR . ">\r\n");
    $read($socket);
    fwrite($socket, "RCPT TO:<{$to}>\r\n");
    $read($socket);
    fwrite($socket, "DATA\r\n");
    $read($socket);

    $headers  = "From: " . FROM_NAME . " <" . FROM_ADDR . ">\r\n";
    $headers .= "To: {$to}\r\n";
    if ($reply_to) $headers .= "Reply-To: {$reply_to}\r\n";
    $headers .= "Subject: {$subject}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: JTS-Mailer/2.0\r\n";

    fwrite($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
    $result = $read($socket);
    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return substr(trim($result), 0, 3) === '250';
}

$sent = smtp_send(TO_ADDR, $subject, $body, $email);

if ($sent) {
    /* Auto-reply to the visitor */
    smtp_send($email, $auto_subject, $auto_body);
    echo json_encode([
        'success' => true,
        'message' => "Thank you, {$name}! We've received your enquiry and will be in touch within 24 hours. Check your inbox for a confirmation email.",
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Message could not be sent right now. Please email us directly at info@jabulanigroupofcompanies.co.za or call (+27) 660 684 585.",
    ]);
}
