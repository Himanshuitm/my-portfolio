<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Please use POST.'
    ]);
    exit;
}

// Function to sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get and sanitize form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required.';
} elseif (strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters long.';
}

if (empty($email)) {
    $errors[] = 'Email is required.';
} elseif (!validateEmail($email)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($subject)) {
    $errors[] = 'Subject is required.';
} elseif (strlen($subject) < 5) {
    $errors[] = 'Subject must be at least 5 characters long.';
}

if (empty($message)) {
    $errors[] = 'Message is required.';
} elseif (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters long.';
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// Email configuration
$to = 'himanshusaini8518@gmail.com';
$from = $email;
$fromName = $name;

// Email subject and body
$emailSubject = "Portfolio Contact: " . $subject;
$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #0a0e1a;
            color: #00ff88;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1a1f2e;
            border: 1px solid #2d3748;
            border-radius: 8px;
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #2d3748;
        }
        .header h1 {
            color: #ffd700;
            margin: 0;
            font-size: 24px;
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            color: #64ffda;
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        .field-value {
            color: #00ff88;
            background-color: #0f1419;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #2d3748;
        }
        .message-content {
            line-height: 1.6;
            white-space: pre-wrap;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #2d3748;
            text-align: center;
            color: #64ffda;
            font-size: 12px;
        }
        .terminal-prompt {
            color: #ffd700;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1><span class='terminal-prompt'>$</span> New Portfolio Contact Message</h1>
        </div>
        
        <div class='field'>
            <span class='field-label'>From:</span>
            <div class='field-value'>{$name}</div>
        </div>
        
        <div class='field'>
            <span class='field-label'>Email:</span>
            <div class='field-value'>{$email}</div>
        </div>
        
        <div class='field'>
            <span class='field-label'>Subject:</span>
            <div class='field-value'>{$subject}</div>
        </div>
        
        <div class='field'>
            <span class='field-label'>Message:</span>
            <div class='field-value message-content'>{$message}</div>
        </div>
        
        <div class='footer'>
            <p><span class='terminal-prompt'>$</span> Sent from Portfolio Contact Form</p>
            <p>Timestamp: " . date('Y-m-d H:i:s T') . "</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $fromName . ' <' . $from . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 1',
    'Importance: High'
];

// Additional security headers
$additionalHeaders = implode("\r\n", $headers);

// Simple spam protection
$spamWords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here'];
$messageText = strtolower($message . ' ' . $subject);

foreach ($spamWords as $spamWord) {
    if (strpos($messageText, $spamWord) !== false) {
        echo json_encode([
            'success' => false,
            'message' => 'Message appears to be spam. Please contact directly via email.'
        ]);
        exit;
    }
}

// Rate limiting (simple implementation)
session_start();
$currentTime = time();
$lastSubmission = isset($_SESSION['last_contact_submission']) ? $_SESSION['last_contact_submission'] : 0;

if ($currentTime - $lastSubmission < 60) { // 1 minute cooldown
    echo json_encode([
        'success' => false,
        'message' => 'Please wait a moment before sending another message.'
    ]);
    exit;
}

// Send email
$emailSent = false;

// Try to use mail() function
if (function_exists('mail')) {
    $emailSent = mail($to, $emailSubject, $emailBody, $additionalHeaders);
}

// If mail() failed or doesn't exist, try alternative methods
if (!$emailSent) {
    // Log the contact attempt
    $logEntry = "[" . date('Y-m-d H:i:s') . "] Contact from: $name ($email) - Subject: $subject\n";
    $logEntry .= "Message: " . substr($message, 0, 100) . "...\n";
    $logEntry .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
    $logEntry .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n\n";
    
    // Try to write to log file
    $logFile = 'contact_log.txt';
    if (is_writable(dirname($logFile)) || is_writable($logFile)) {
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    // Since we can't send email, we'll save the contact info and return success
    // In a production environment, you might want to integrate with a service like SendGrid, Mailgun, etc.
    $contactData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
    ];
    
    // Save to JSON file for backup
    $contactsFile = 'contacts.json';
    $contacts = [];
    
    if (file_exists($contactsFile)) {
        $existingData = file_get_contents($contactsFile);
        $contacts = json_decode($existingData, true) ?: [];
    }
    
    $contacts[] = $contactData;
    
    // Keep only last 100 contacts to prevent file from growing too large
    if (count($contacts) > 100) {
        $contacts = array_slice($contacts, -100);
    }
    
    if (is_writable(dirname($contactsFile)) || is_writable($contactsFile)) {
        file_put_contents($contactsFile, json_encode($contacts, JSON_PRETTY_PRINT), LOCK_EX);
    }
}

// Update session with current submission time
$_SESSION['last_contact_submission'] = $currentTime;

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Thank you for your message! I will get back to you soon.'
]);

// Optional: Send auto-reply to the sender
$autoReplySubject = "Thank you for contacting Himanshu Saini";
$autoReplyBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #0a0e1a;
            color: #00ff88;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1a1f2e;
            border: 1px solid #2d3748;
            border-radius: 8px;
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #ffd700;
            margin: 0;
        }
        .content {
            color: #64ffda;
            line-height: 1.6;
        }
        .terminal-prompt {
            color: #ffd700;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #2d3748;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1><span class='terminal-prompt'>$</span> Message Received!</h1>
        </div>
        
        <div class='content'>
            <p>Hi {$name},</p>
            
            <p>Thank you for reaching out through my portfolio! I've received your message about:</p>
            <p><strong>\"{$subject}\"</strong></p>
            
            <p>I appreciate your interest and will get back to you as soon as possible, typically within 24-48 hours.</p>
            
            <p>In the meantime, feel free to connect with me on LinkedIn or check out my other projects on GitHub.</p>
            
            <p>Best regards,<br>
            <span class='terminal-prompt'>$</span> Himanshu Saini<br>
            Full Stack Web Developer</p>
        </div>
        
        <div class='footer'>
            <p>This is an automated response. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
";

$autoReplyHeaders = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Himanshu Saini <himanshusaini8518@gmail.com>',
    'X-Mailer: PHP/' . phpversion()
];

$autoReplyHeadersString = implode("\r\n", $autoReplyHeaders);

// Send auto-reply (optional)
if (function_exists('mail')) {
    @mail($email, $autoReplySubject, $autoReplyBody, $autoReplyHeadersString);
}

exit;
?>
