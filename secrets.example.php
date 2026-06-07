<?php
/**
 * Template for secrets.php — safe to commit to Git (contains no real values).
 *
 * To set up the contact form locally or on a new server:
 *   1. Copy this file and rename the copy to "secrets.php"
 *   2. Fill in the real SMTP mailbox details below
 *   3. Upload secrets.php to the server manually (Hostinger File Manager / FTP)
 *      — never through Git, it is excluded via .gitignore
 */

define('SMTP_HOST', 'smtp.yourhost.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'you@yourdomain.co.za');
define('SMTP_PASS', 'your-mailbox-password');
define('FROM_NAME', 'Your Company Name');
define('FROM_ADDR', 'you@yourdomain.co.za');
define('TO_ADDR',   'you@yourdomain.co.za');
