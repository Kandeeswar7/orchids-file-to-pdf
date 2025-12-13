$body = @{
    html = "<h1>Test Document</h1><p>This is a test PDF conversion.</p>"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/convert/html" -Method Post -Body $body -ContentType "application/json"
Write-Output "Job ID: $($response.jobId)"

Start-Sleep -Seconds 3

$status = Invoke-RestMethod -Uri "http://localhost:3000/api/convert/status/$($response.jobId)" -Method Get
Write-Output "Status: $($status.status)"
Write-Output "Filename: $($status.filename)"
