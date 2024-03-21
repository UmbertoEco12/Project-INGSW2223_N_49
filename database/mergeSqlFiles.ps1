# Get all SQL files in the current directory
$sqlFiles = Get-ChildItem -Path . -Filter *.sql | Sort-Object

# Create a new file named all_database.sql
$outputFile = "all_database.sql"
New-Item -ItemType file -Path $outputFile -Force | Out-Null

# Loop through each SQL file and append its content to all_database.sql
foreach ($file in $sqlFiles) {
    Get-Content $file.FullName | Add-Content $outputFile
}

Write-Host "All SQL files combined into $outputFile"
