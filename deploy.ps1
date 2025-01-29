# Remove the docs folder if it exists
if (Test-Path -Path docs) {
    Remove-Item -Path docs -Recurse -Force
}

# Build the Angular project
ng build --configuration production --base-href /teams-generator/ --output-path docs

# Navigate to the docs directory
Set-Location -Path docs

# Move all contents of the browser folder to the root docs folder
Move-Item -Path browser\* -Destination .

# Remove the now-empty browser folder
Remove-Item -Path browser -Recurse

# Copy index.html to 404.html
Copy-Item -Path index.html -Destination 404.html

# Navigate back to the root directory
Set-Location -Path ..

# Stage all changes
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Push the changes to the remote repository
git push origin main

Write-Output "Deployment script executed successfully."