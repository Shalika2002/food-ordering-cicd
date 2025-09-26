# PowerShell script to remove emojis from test files
$loginFile = "tests\ui\enhanced-login.test.js"
$cartFile = "tests\ui\enhanced-add-to-cart.test.js"

# Read login file
$loginContent = Get-Content $loginFile -Raw

# Replace specific emojis with empty strings
$emojiMap = @{
    '🔐' = ''
    '🚀' = ''
    '📍' = ''
    '🏁' = ''
    '📋' = ''
    '✅' = ''
    '🧪' = ''
    '✓' = ''
    '❌' = ''
    '⚠️' = ''
    '📱' = ''
    '💻' = ''
    '🔒' = ''
    '🎯' = ''
    '🛡️' = ''
    '💡' = ''
    '⏰' = ''
    '📊' = ''
    '🔄' = ''
    '🛒' = ''
    '🍕' = ''
    '🍔' = ''
    '🥗' = ''
    '💰' = ''
    '🔢' = ''
    '➕' = ''
    '➖' = ''
    '🛍️' = ''
    '📦' = ''
}

# Clean login file
foreach ($emoji in $emojiMap.Keys) {
    $loginContent = $loginContent -replace [regex]::Escape($emoji), $emojiMap[$emoji]
}

# Write cleaned login file
$loginContent | Set-Content $loginFile -Encoding UTF8

Write-Host "Login test file cleaned of emojis"

# Clean cart file if it exists
if (Test-Path $cartFile) {
    $cartContent = Get-Content $cartFile -Raw
    
    # Clean cart file
    foreach ($emoji in $emojiMap.Keys) {
        $cartContent = $cartContent -replace [regex]::Escape($emoji), $emojiMap[$emoji]
    }
    
    # Write cleaned cart file
    $cartContent | Set-Content $cartFile -Encoding UTF8
    
    Write-Host "Cart test file cleaned of emojis"
}

Write-Host "Emoji cleanup completed successfully"