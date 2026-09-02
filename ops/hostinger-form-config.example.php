<?php
declare(strict_types=1);

// Copy to domains/cloudstudios.co.nz/form-config.php on Hostinger.
// Keep the real password outside public_html and never commit it to Git.
return array(
  'smtp_host' => 'smtp.hostinger.com',
  'smtp_port' => 465,
  'smtp_security' => 'ssl',
  'smtp_username' => 'admin@cloudstudios.co.nz',
  'smtp_password' => 'PASTE_THE_MAILBOX_PASSWORD_HERE',
  'from_email' => 'admin@cloudstudios.co.nz',
  'from_name' => 'Cloud Studios',
  'admin_to' => 'admin@cloudstudios.co.nz',
);
