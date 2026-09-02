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
  header('Location: /book-a-tour?sent=1', true, 303);
  exit;
}

$name = cs_clean_single_line($_POST['name'] ?? '', 120);
$email = cs_clean_single_line($_POST['email'] ?? '', 180);
$phone = cs_clean_single_line($_POST['phone'] ?? '', 60);
$preferredDatetime = cs_clean_single_line($_POST['preferred_datetime'] ?? '', 80);
$interest = cs_clean_single_line($_POST['interest'] ?? '', 120);
$message = cs_clean_multiline($_POST['message'] ?? '', 5000);

if ($name === '' || $email === '' || $preferredDatetime === '' || $interest === '') {
  cs_fail(400, 'Please complete all required fields.', $isAjax);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  cs_fail(400, 'Please enter a valid email address.', $isAjax);
}

$nzTimezone = new DateTimeZone('Pacific/Auckland');
$dateTimeNz = DateTimeImmutable::createFromFormat('!Y-m-d\TH:i', $preferredDatetime, $nzTimezone);
if (!$dateTimeNz) {
  cs_fail(400, 'Please choose a valid preferred date and time.', $isAjax);
}

$preferredPretty = $dateTimeNz->format('l, F j, Y \a\t g:i A');
$dateTimeUtcStart = $dateTimeNz->setTimezone(new DateTimeZone('UTC'));
$dateTimeUtcEnd = $dateTimeUtcStart->modify('+45 minutes');
$requestId = cs_request_id();
$config = cs_form_config();
$logged = cs_log_submission('tour', $requestId, array(
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'preferred_datetime' => $preferredDatetime,
  'preferred_datetime_pretty' => $preferredPretty,
  'interest' => $interest,
  'message' => $message,
));
if (!$logged) {
  cs_fail(503, 'We could not safely record your tour request right now. Please call 09 218 8670 or email admin@cloudstudios.co.nz.', $isAjax);
}

$adminBody =
  "New tour request received:\n\n" .
  "Request ID: {$requestId}\n" .
  "Name: {$name}\n" .
  "Email: {$email}\n" .
  'Phone: ' . ($phone !== '' ? $phone : '-') . "\n" .
  "Preferred date & time: {$preferredPretty}\n" .
  "Interest: {$interest}\n\n" .
  "Team requirements:\n" . ($message !== '' ? $message : '-') . "\n";
$adminHeaders = "Reply-To: {$email}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit";
$adminMailOk = cs_send_message('tour-admin', $requestId, (string) $config['admin_to'], 'New Book a Tour Request — Cloud Studios', $adminBody, $adminHeaders);

$calendar = implode("\r\n", array(
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Cloud Studios//Tour Request//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:REQUEST',
  'BEGIN:VEVENT',
  'UID:' . $requestId . '@cloudstudios.co.nz',
  'DTSTAMP:' . gmdate('Ymd\THis\Z'),
  'DTSTART:' . $dateTimeUtcStart->format('Ymd\THis\Z'),
  'DTEND:' . $dateTimeUtcEnd->format('Ymd\THis\Z'),
  'SUMMARY:Cloud Studios Tour Request',
  'LOCATION:Level 2\, 109 Great South Road\, Epsom\, Auckland 1051\, New Zealand',
  'DESCRIPTION:Requested tour time. Cloud Studios will contact you to confirm availability.',
  'STATUS:TENTATIVE',
  'END:VEVENT',
  'END:VCALENDAR',
)) . "\r\n";

$customerMessage =
  "Hi {$name},\n\n" .
  "Thanks — we’ve received your Cloud Studios tour request.\nWe’ll be in touch to confirm the time.\n\n" .
  "Preferred date & time:\n{$preferredPretty}\n\n" .
  "Location:\nLevel 2, 109 Great South Road\nEpsom, Auckland 1051\nNew Zealand\n\n" .
  "For urgent enquiries, call 09-218 8670.\n\nKind regards,\nCloud Studios\ncloudstudios.co.nz\n";
$boundary = 'CSBOUNDARY' . md5($requestId . microtime(true));
$customerHeaders = "Reply-To: admin@cloudstudios.co.nz\r\nContent-Type: multipart/mixed; boundary=\"{$boundary}\"";
$customerBody = "--{$boundary}\r\n";
$customerBody .= "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n{$customerMessage}\r\n";
$customerBody .= "--{$boundary}\r\n";
$customerBody .= "Content-Type: text/calendar; method=REQUEST; charset=UTF-8; name=\"Cloud-Studios-Tour.ics\"\r\n";
$customerBody .= "Content-Disposition: attachment; filename=\"Cloud-Studios-Tour.ics\"\r\nContent-Transfer-Encoding: base64\r\n\r\n";
$customerBody .= chunk_split(base64_encode($calendar)) . "\r\n--{$boundary}--\r\n";
cs_send_message('tour-customer', $requestId, $email, 'Your Cloud Studios Tour Request', $customerBody, $customerHeaders);

if (!$adminMailOk) {
  cs_fail(503, 'Your details were safely recorded, but we could not email your tour request right now. Please call 09 218 8670 or email admin@cloudstudios.co.nz.', $isAjax);
}

if ($isAjax) cs_json_response(200, array('ok' => true, 'request_id' => $requestId));
header('Location: /book-a-tour?sent=1', true, 303);
exit;
