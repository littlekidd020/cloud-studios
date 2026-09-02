<?php
declare(strict_types=1);

// Shared helpers for the Cloud Studios enquiry and tour forms.
if (isset($_SERVER['SCRIPT_FILENAME']) && realpath((string) $_SERVER['SCRIPT_FILENAME']) === __FILE__) {
  http_response_code(404);
  exit('Not Found');
}

date_default_timezone_set('Pacific/Auckland');

function cs_no_store_headers(): void {
  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  header('Pragma: no-cache');
  header('X-Content-Type-Options: nosniff');
}

function cs_is_ajax_request(): bool {
  return (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower((string) $_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    || (isset($_POST['_ajax']) && $_POST['_ajax'] === '1')
    || (!empty($_SERVER['HTTP_ACCEPT']) && str_contains(strtolower((string) $_SERVER['HTTP_ACCEPT']), 'application/json'));
}

function cs_clean_single_line($value, int $maxLength): string {
  $clean = str_replace(array("\r", "\n", "\0"), ' ', (string) ($value ?? ''));
  $clean = preg_replace('/\s+/u', ' ', trim($clean)) ?? '';
  return function_exists('mb_substr') ? mb_substr($clean, 0, $maxLength, 'UTF-8') : substr($clean, 0, $maxLength);
}

function cs_clean_multiline($value, int $maxLength): string {
  $clean = str_replace("\0", '', (string) ($value ?? ''));
  $clean = str_replace(array("\r\n", "\r"), "\n", trim($clean));
  return function_exists('mb_substr') ? mb_substr($clean, 0, $maxLength, 'UTF-8') : substr($clean, 0, $maxLength);
}

function cs_request_id(): string {
  try {
    return bin2hex(random_bytes(8));
  } catch (Throwable $error) {
    return str_replace('.', '', uniqid('', true));
  }
}

function cs_honeypot_triggered(): bool {
  return trim((string) ($_POST['website'] ?? '')) !== '';
}

function cs_json_response(int $status, array $data): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=UTF-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function cs_fail(int $status, string $message, bool $isAjax, array $context = array()): void {
  if ($isAjax) {
    cs_json_response($status, array_merge($context, array('ok' => false, 'error' => $message)));
  }
  http_response_code($status);
  header('Content-Type: text/plain; charset=UTF-8');
  exit($message);
}

function cs_private_dir(): string {
  // Keep customer records outside public_html so deployments cannot expose or erase them.
  $dir = dirname(__DIR__, 2) . '/private/cloud-studios-forms';
  if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
    return '';
  }
  @chmod($dir, 0750);
  return $dir;
}

function cs_write_jsonl(string $filename, array $record): bool {
  $dir = cs_private_dir();
  if ($dir === '') return false;
  $path = $dir . '/' . $filename;
  $line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
  $written = @file_put_contents($path, $line, FILE_APPEND | LOCK_EX) !== false;
  if ($written) @chmod($path, 0640);
  return $written;
}

function cs_client_fingerprint(): string {
  $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
  return substr(hash('sha256', date('Y-m') . '|' . $ip), 0, 16);
}

function cs_log_submission(string $type, string $requestId, array $payload): bool {
  return cs_write_jsonl('form-submissions-' . date('Y-m') . '.jsonl', array(
    'timestamp' => date('c'),
    'type' => $type,
    'request_id' => $requestId,
    'client' => cs_client_fingerprint(),
    'payload' => $payload,
  ));
}

function cs_form_config(): array {
  $config = array(
    'smtp_host' => getenv('CS_SMTP_HOST') ?: 'smtp.hostinger.com',
    'smtp_port' => (int) (getenv('CS_SMTP_PORT') ?: 465),
    'smtp_security' => getenv('CS_SMTP_SECURITY') ?: 'ssl',
    'smtp_username' => getenv('CS_SMTP_USERNAME') ?: 'admin@cloudstudios.co.nz',
    'smtp_password' => getenv('CS_SMTP_PASSWORD') ?: '',
    'from_email' => getenv('CS_SMTP_FROM_EMAIL') ?: 'admin@cloudstudios.co.nz',
    'from_name' => getenv('CS_SMTP_FROM_NAME') ?: 'Cloud Studios',
    'admin_to' => getenv('CS_FORM_ADMIN_TO') ?: 'admin@cloudstudios.co.nz',
  );

  // This optional file lives one level above public_html and is never deployed by Git.
  $privateConfig = dirname(__DIR__, 2) . '/form-config.php';
  if (is_readable($privateConfig)) {
    $loaded = require $privateConfig;
    if (is_array($loaded)) $config = array_merge($config, $loaded);
  }
  return $config;
}

function cs_smtp_read($socket): string {
  $response = '';
  while (($line = fgets($socket, 515)) !== false) {
    $response .= $line;
    if (strlen($line) < 4 || $line[3] !== '-') break;
  }
  return $response;
}

function cs_smtp_expect($socket, array $expectedCodes): string {
  $response = cs_smtp_read($socket);
  $code = (int) substr($response, 0, 3);
  if (!in_array($code, $expectedCodes, true)) {
    throw new RuntimeException('SMTP error ' . $code);
  }
  return $response;
}

function cs_smtp_write_all($socket, string $data): void {
  $length = strlen($data);
  $offset = 0;
  while ($offset < $length) {
    $written = fwrite($socket, substr($data, $offset));
    if ($written === false || $written === 0) throw new RuntimeException('SMTP write failed');
    $offset += $written;
  }
}

function cs_smtp_command($socket, string $command, array $expectedCodes): void {
  cs_smtp_write_all($socket, $command . "\r\n");
  cs_smtp_expect($socket, $expectedCodes);
}

function cs_smtp_send(array $config, string $to, string $subject, string $body, string $extraHeaders): array {
  if ($config['smtp_password'] === '') {
    return array('ok' => false, 'transport' => 'smtp', 'error' => 'smtp_not_configured');
  }

  if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($config['from_email'], FILTER_VALIDATE_EMAIL)) {
    return array('ok' => false, 'transport' => 'smtp', 'error' => 'invalid_mail_address');
  }

  $security = strtolower((string) ($config['smtp_security'] ?? 'ssl'));
  if (!in_array($security, array('ssl', 'starttls', 'tls'), true)) {
    return array('ok' => false, 'transport' => 'smtp', 'error' => 'invalid_smtp_security');
  }
  $scheme = $security === 'ssl' ? 'ssl://' : 'tcp://';
  $stage = 'connect';
  $socket = @stream_socket_client(
    $scheme . $config['smtp_host'] . ':' . $config['smtp_port'],
    $errorNumber,
    $errorMessage,
    20,
    STREAM_CLIENT_CONNECT
  );
  if (!$socket) {
    error_log('Cloud Studios SMTP connection failed: ' . $errorNumber);
    return array('ok' => false, 'transport' => 'smtp', 'error' => 'smtp_connect_failed');
  }
  stream_set_timeout($socket, 20);

  try {
    $stage = 'greeting';
    cs_smtp_expect($socket, array(220));
    $stage = 'ehlo';
    cs_smtp_command($socket, 'EHLO cloudstudios.co.nz', array(250));

    if ($security === 'starttls' || $security === 'tls') {
      $stage = 'starttls';
      cs_smtp_command($socket, 'STARTTLS', array(220));
      if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        throw new RuntimeException('SMTP TLS negotiation failed');
      }
      $stage = 'ehlo_after_tls';
      cs_smtp_command($socket, 'EHLO cloudstudios.co.nz', array(250));
    }

    $stage = 'authenticate';
    cs_smtp_command($socket, 'AUTH LOGIN', array(334));
    cs_smtp_command($socket, base64_encode((string) $config['smtp_username']), array(334));
    cs_smtp_command($socket, base64_encode((string) $config['smtp_password']), array(235));
    $stage = 'sender';
    cs_smtp_command($socket, 'MAIL FROM:<' . $config['from_email'] . '>', array(250));
    $stage = 'recipient';
    cs_smtp_command($socket, 'RCPT TO:<' . $to . '>', array(250, 251));
    $stage = 'message';
    cs_smtp_command($socket, 'DATA', array(354));

    $headers = array(
      'Date: ' . date(DATE_RFC2822),
      'From: =?UTF-8?B?' . base64_encode((string) $config['from_name']) . '?= <' . $config['from_email'] . '>',
      'To: <' . $to . '>',
      'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
      'Message-ID: <' . bin2hex(random_bytes(12)) . '@cloudstudios.co.nz>',
      'MIME-Version: 1.0',
      'Auto-Submitted: auto-generated',
      'X-Auto-Response-Suppress: All',
      trim($extraHeaders),
    );
    $message = implode("\r\n", array_filter($headers)) . "\r\n\r\n" . $body;
    $message = preg_replace("/(?<!\r)\n/", "\r\n", $message) ?? $message;
    $message = preg_replace('/^\./m', '..', $message) ?? $message;
    cs_smtp_write_all($socket, $message . "\r\n.\r\n");
    $stage = 'accepted';
    cs_smtp_expect($socket, array(250));
    // Once DATA receives 250, the SMTP server has accepted responsibility for
    // the message. QUIT is courteous but its response must not turn an
    // accepted message into a false failure if the server closes first.
    @fwrite($socket, "QUIT\r\n");
    fclose($socket);
    return array('ok' => true, 'transport' => 'smtp', 'error' => '');
  } catch (Throwable $error) {
    error_log('Cloud Studios SMTP send failed at ' . $stage . ': ' . $error->getMessage());
    fclose($socket);
    return array('ok' => false, 'transport' => 'smtp', 'error' => 'smtp_' . $stage . '_failed');
  }
}

function cs_send_message(string $kind, string $requestId, string $to, string $subject, string $body, string $extraHeaders): array {
  $config = cs_form_config();
  $result = cs_smtp_send($config, $to, $subject, $body, $extraHeaders);
  cs_write_jsonl('mail-events-' . date('Y-m') . '.jsonl', array(
    'timestamp' => date('c'),
    'request_id' => $requestId,
    'kind' => $kind,
    'to' => cs_clean_single_line($to, 200),
    'ok' => $result['ok'],
    'transport' => $result['transport'],
    'error' => $result['error'],
    'subject' => cs_clean_single_line($subject, 200),
  ));
  return $result;
}
