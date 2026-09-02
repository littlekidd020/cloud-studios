# Cloud Studios form delivery

The production forms require authenticated Hostinger SMTP. They do not use PHP `mail()` as a fallback because that route rewrites the envelope sender and has caused spam rejection and false-positive send results.

## Private Hostinger configuration

Create `domains/cloudstudios.co.nz/form-config.php`, one level above `public_html`, using `hostinger-form-config.example.php` as the template. Enter the existing `admin@cloudstudios.co.nz` mailbox password directly in Hostinger File Manager. Do not paste the password into chat, commit it, or place it under `public_html`.

Rotate the mailbox password before configuring this version if any older site copy or backup contains an embedded credential.

Use file permissions `0600` where Hostinger permits it. The tracked application reads this private file at runtime, and GitHub deployments do not replace it.

Hostinger's supported SMTP settings are:

- Host: `smtp.hostinger.com`
- Port: `465`
- Security: SSL/TLS
- Username: full mailbox address
- Password: mailbox password

## Delivery behavior

- Every valid request is written to the private JSONL submission log before email is attempted.
- The customer confirmation is sent only after the admin notification is accepted by authenticated SMTP.
- The UI reports whether the confirmation was accepted instead of treating a queued message as proof of delivery.
- Tour confirmations include a tentative iCalendar invitation with the requested Auckland time and Cloud Studios address.
- Mail event logs record the transport and failure stage without storing credentials.

## Production verification

1. Submit one contact enquiry to a controlled external mailbox.
2. Confirm the admin notification appears outside Junk in `admin@cloudstudios.co.nz`.
3. Confirm the external mailbox receives the acknowledgement.
4. Submit one tour request and confirm the `.ics` invitation opens at the selected time.
5. Match both submissions to their request IDs in the private logs and confirm the mail event rows use `transport: smtp` with `ok: true`.
