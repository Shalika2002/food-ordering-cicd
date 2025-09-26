# GitHub Repository Setup Script
# Replace YOUR_GITHUB_USERNAME and YOUR_REPOSITORY_NAME with your actual values

Write-Host "🚀 Setting up GitHub repository connection..." -ForegroundColor Green
Write-Host ""

# Get user input for GitHub details
$username = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter your repository name (e.g., food-ordering-cicd)"

# Construct the repository URL
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "📋 Repository URL: $repoUrl" -ForegroundColor Yellow
Write-Host ""

# Confirm with user
$confirm = Read-Host "Is this correct? (y/n)"

if ($confirm -eq "y" -or $confirm -eq "Y") {
    Write-Host ""
    Write-Host "🔗 Adding remote origin..." -ForegroundColor Cyan
    
    try {
        # Add the remote repository
        git remote add origin $repoUrl
        Write-Host "✅ Remote origin added successfully!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
        
        # Push to GitHub
        git push -u origin main
        
        Write-Host ""
        Write-Host "🎉 SUCCESS! Your repository is now on GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Repository URL: https://github.com/$username/$repoName" -ForegroundColor Yellow
        Write-Host "⚙️  GitHub Actions: https://github.com/$username/$repoName/actions" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📋 Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Go to your repository on GitHub"
        Write-Host "2. Click the 'Actions' tab"
        Write-Host "3. Watch your CI/CD pipeline run automatically!"
        Write-Host "4. Use this for your viva demonstration"
        
    } catch {
        Write-Host "❌ Error occurred: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
        Write-Host "1. Make sure you created the repository on GitHub"
        Write-Host "2. Verify the repository URL is correct"
        Write-Host "3. Check your internet connection"
        Write-Host "4. Make sure you're logged into GitHub"
    }
} else {
    Write-Host "❌ Setup cancelled. Please run the script again with correct details." -ForegroundColor Red
}

Write-Host ""
Write-Host "🎬 Ready for your CI/CD pipeline demonstration!" -ForegroundColor Magenta