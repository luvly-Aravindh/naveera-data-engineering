<?php
session_start();

// ================= ALWAYS JSON =================
header("Content-Type: application/json");

// ================= SAFE ERROR HANDLING =================
ini_set('display_errors', 0);
error_reporting(0);

// ================= RESPONSE =================
function respond($status, $message) {
    echo json_encode([
        "status" => $status,
        "message" => $message
    ]);
    exit;
}

// ================= SAFE MAIL =================
function safeMail($to, $subject, $body) {

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: Naveera <hello@getnos.io>\r\n";

    // prevent crash even if mail fails
    @mail($to, $subject, $body, $headers);
}

// ================= INPUT =================
$input = $_POST;

if (empty($input)) {
    $raw = file_get_contents("php://input");
    $input = json_decode($raw, true) ?? [];
}

// Debug file (check if needed)
file_put_contents(__DIR__ . "/debug.txt", print_r($input, true));

$action = $input['action'] ?? '';

// ================= SEND OTP =================
if ($action === "send_otp") {

    $email = trim($input['email'] ?? '');

    if (!$email) respond("error", "Email is required");

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond("error", "Invalid email");
    }

    // Generate OTP
    $otp = rand(100000, 999999);

    $_SESSION['otp'] = $otp;
    $_SESSION['otp_time'] = time();
    $_SESSION['form_data'] = $input;

    $subject = "Your OTP Code - Naveera";

    // ✅ EMAIL TEMPLATE
    $message = "
    <html>
    <body style='margin:0;padding:0;background:#f4f6f8;font-family:Arial;'>

    <table width='100%' style='padding:20px'>
    <tr><td align='center'>

    <table width='500' style='background:#fff;border-radius:10px;padding:20px'>
        
        <tr>
            <td align='center'>
                <img src='https://naveeratech.com/wp-content/uploads/2025/11/NT_Logo_light-1.svg'
                     style='max-width:140px;' />
            </td>
        </tr>

        <tr>
            <td align='center'>
                <h2>Verify Your Email</h2>
                <p>Your OTP is:</p>

                <div style='font-size:32px;font-weight:bold;color:#00A63E'>
                    {$otp}
                </div>

                <p style='font-size:12px;color:#777'>
                    Valid for 5 minutes
                </p>
            </td>
        </tr>

    </table>

    </td></tr>
    </table>

    </body>
    </html>
    ";

    safeMail($email, $subject, $message);

    respond("success", "OTP sent");
}

// ================= VERIFY OTP =================
if ($action === "verify_otp") {

    $enteredOtp = trim($input['otp'] ?? '');

    if (!isset($_SESSION['otp'])) {
        respond("error", "Session expired");
    }

    if ($enteredOtp != $_SESSION['otp']) {
        respond("error", "Invalid OTP");
    }

    if (time() - $_SESSION['otp_time'] > 300) {
        respond("error", "OTP expired");
    }

    // ================= GET FORM DATA =================
    $data = $_SESSION['form_data'] ?? [];

    $name      = htmlspecialchars($data['name'] ?? '');
    $email     = htmlspecialchars($data['email'] ?? '');
    $company   = htmlspecialchars($data['company'] ?? '');
    $challenge = htmlspecialchars($data['challenge'] ?? '');
    $details   = htmlspecialchars($data['details'] ?? '');

    // ================= SEND LEAD EMAIL =================
    $subject = "Naveera Data Engineering";

    $body = "
    <html>
    <body style='font-family:Arial;background:#f4f6f8;padding:20px'>

    <div style='background:#fff;padding:20px;border-radius:10px'>

        <h2>New Lead Received</h2>

        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Company:</strong> {$company}</p>
        <p><strong>Challenge:</strong> {$challenge}</p>
        <p><strong>Details:</strong> {$details}</p>

    </div>

    </body>
    </html>
    ";

    safeMail("sriethiraj@getnos.io", $subject, $body);

    session_destroy();

    respond("success", "Form submitted successfully");
}

// ================= CONTACT FORM =================
if (in_array($action, ["submit_contact", "submit_lead", "contact_form", "default_form"], true)) {
    $name = trim((string)($input['name'] ?? ''));
    $email = trim((string)($input['email'] ?? ''));
    $phone = trim((string)($input['phone'] ?? ''));
    $website = trim((string)($input['website'] ?? ''));
    $company = trim((string)($input['company'] ?? ''));
    $source = trim((string)($input['source'] ?? 'website'));
    $challenge = trim((string)($input['challenge'] ?? ''));
    $details = trim((string)($input['details'] ?? ''));

    if (!$name || !$email || !$phone || !$website) {
        respond("error", "Name, email, phone and website are required");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond("error", "Invalid email address");
    }

    $website = preg_match('/^https?:\/\//i', $website) ? $website : 'https://' . $website;
    $company = $company ?: parse_url($website, PHP_URL_HOST) ?: 'N/A';
    $company = str_replace(['www.', 'https://', 'http://'], '', $company);

    $body = "
    <html>
    <body style='font-family:Arial;background:#f4f6f8;padding:20px'>
        <div style='background:#fff;padding:20px;border-radius:10px'>
            <h2>New Lead Received</h2>
            <p><strong>Source:</strong> " . htmlspecialchars($source) . "</p>
            <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
            <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
            <p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>
            <p><strong>Company:</strong> " . htmlspecialchars($company) . "</p>
            <p><strong>Website:</strong> " . htmlspecialchars($website) . "</p>
            <p><strong>Challenge:</strong> " . htmlspecialchars($challenge ?: 'Not provided') . "</p>
            <p><strong>Details:</strong> " . htmlspecialchars($details ?: 'Not provided') . "</p>
        </div>
    </body>
    </html>
    ";

    $subject = "Naveera Contact Form Lead - " . htmlspecialchars($source);
    safeMail("sriethiraj@getnos.io", $subject, $body);
    safeMail("hello@getnos.io", $subject, $body);

    respond("success", "Form submitted successfully");
}

// ================= DEFAULT =================
respond("error", "Invalid request");