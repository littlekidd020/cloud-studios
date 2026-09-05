<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/form-common.php';
cs_no_store_headers();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  exit('Method Not Allowed');
}

$isAjax = cs_is_ajax_request();
if (cs_honeypot_triggered()) {
  if ($isAjax) cs_json_response(200, array('ok' => true));
  header('Location: /contact?sent=1', true, 303);
  exit;
}

$name = cs_clean_single_line($_POST['name'] ?? '', 120);
$email = cs_clean_single_line($_POST['email'] ?? '', 180);
$phone = cs_clean_single_line($_POST['phone'] ?? '', 60);
$subject = cs_clean_single_line($_POST['subject'] ?? '', 180);
$message = cs_clean_multiline($_POST['message'] ?? '', 5000);

if ($name === '' || $email === '' || $subject === '' || $message === '') {
  cs_fail(400, 'Please complete all required fields.', $isAjax);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  cs_fail(400, 'Please enter a valid email address.', $isAjax);
}

$requestId = cs_request_id();
$config = cs_form_config();
$logged = cs_log_submission('enquiry', $requestId, array(
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'subject' => $subject,
  'message' => $message,
));
if (!$logged) {
  cs_fail(503, 'We could not safely record your enquiry right now. Please call 09 218 8670 or email admin@cloudstudios.co.nz.', $isAjax);
}

$plainHeaders = "Reply-To: {$email}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable";
$adminBody =
  "New enquiry received:\n\n" .
  "Request ID: {$requestId}\n" .
  "Name: {$name}\n" .
  "Email: {$email}\n" .
  'Phone: ' . ($phone !== '' ? $phone : '-') . "\n" .
  "Subject: {$subject}\n\n" .
  "Message:\n{$message}\n";

$adminMail = cs_send_message(
  'enquiry-admin',
  $requestId,
  (string) $config['admin_to'],
  'New Enquiry — Cloud Studios',
  quoted_printable_encode($adminBody),
  $plainHeaders
);

if (!$adminMail['ok']) {
  cs_fail(
    503,
    'Your enquiry was safely recorded, but the team notification could not be delivered. Please do not resubmit. Call 09 218 8670 or email admin@cloudstudios.co.nz and quote your reference.',
    $isAjax,
    array('request_id' => $requestId)
  );
}

$customerBody =
  "Hi {$name},\n\n" .
  "Thanks — Cloud Studios has received your enquiry. The team will review your details and reply directly.\n\n" .
  "Reference: {$requestId}\n\n" .
  "If it’s urgent, call 09 218 8670.\n\n" .
  "Kind regards,\nCloud Studios\nLevel 2, 109 Great South Road\nEpsom, Auckland 1051, New Zealand\ncloudstudios.co.nz\n\n" .
  "Your enquiry details:\nSubject: {$subject}\nPhone: " . ($phone !== '' ? $phone : '-') . "\nMessage:\n{$message}\n";
$customerHeaders = "Reply-To: admin@cloudstudios.co.nz\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable";
$customerMail = cs_send_message('enquiry-customer', $requestId, $email, 'Your Cloud Studios Enquiry', quoted_printable_encode($customerBody), $customerHeaders);
$confirmationSent = (bool) $customerMail['ok'];

if ($isAjax) {
  cs_json_response(200, array(
    'ok' => true,
    'request_id' => $requestId,
    'confirmation_sent' => $confirmationSent,
  ));
}
header('Location: /contact?sent=1&confirmation=' . ($confirmationSent ? '1' : '0') . '&ref=' . rawurlencode($requestId), true, 303);
exit;
