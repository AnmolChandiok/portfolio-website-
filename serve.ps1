# Tiny local web server for this folder (no installs needed; uses Windows PowerShell).
# Started by START-LOCALHOST.bat. Close the window to stop it.

$root = [IO.Path]::GetFullPath((Split-Path -Parent $MyInvocation.MyCommand.Path)).TrimEnd('\') + '\'

$types = @{
  '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8'
  '.css'='text/css; charset=utf-8';   '.js'='text/javascript; charset=utf-8'
  '.json'='application/json; charset=utf-8'; '.txt'='text/plain; charset=utf-8'
  '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'; '.gif'='image/gif'
  '.webp'='image/webp'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'
  '.mp4'='video/mp4'; '.webm'='video/webm'; '.pdf'='application/pdf'
  '.woff'='font/woff'; '.woff2'='font/woff2'
}

# Use the first free port from 8080 upward
$listener = $null
foreach ($p in 8080..8099) {
  $l = New-Object System.Net.HttpListener
  $l.Prefixes.Add("http://localhost:$p/")
  try { $l.Start(); $listener = $l; $port = $p; break } catch { $l.Close() }
}
if (-not $listener) { Write-Host "Could not open a port between 8080 and 8099."; exit 1 }

$url = "http://localhost:$port/"
Write-Host ""
Write-Host "  Your portfolio is running at  $url" -ForegroundColor Green
Write-Host "  Packaging section:            ${url}#packaging"
Write-Host "  3D bucket full screen:        ${url}packaging/ortho-track/"
Write-Host ""
Write-Host "  Keep this window open while you view the site. Close it to stop."
Write-Host ""
Start-Process $url

while ($listener.IsListening) {
  try { $ctx = $listener.GetContext() } catch { break }
  $req = $ctx.Request; $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/').Replace('/', '\')
    $file = [IO.Path]::GetFullPath((Join-Path $root $rel))

    if (-not $file.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
    }
    elseif (Test-Path -LiteralPath $file -PathType Container) {
      if (-not $req.Url.AbsolutePath.EndsWith('/')) {
        # folder without trailing slash: redirect so relative links inside it work
        $res.StatusCode = 301
        $res.RedirectLocation = $req.Url.AbsolutePath + '/' + $req.Url.Query
      } else {
        $file = Join-Path $file 'index.html'
      }
    }

    if ($res.StatusCode -eq 200) {
      if (Test-Path -LiteralPath $file -PathType Leaf) {
        $bytes = [IO.File]::ReadAllBytes($file)
        $ext = [IO.Path]::GetExtension($file).ToLower()
        if ($types.ContainsKey($ext)) { $res.ContentType = $types[$ext] } else { $res.ContentType = 'application/octet-stream' }
        $res.AddHeader('Cache-Control', 'no-store')
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host ("  200  /" + $rel.Replace('\', '/'))
      } else {
        $res.StatusCode = 404
        Write-Host ("  404  /" + $rel.Replace('\', '/')) -ForegroundColor DarkGray
      }
    }
  } catch {
    # browser closed the connection mid-file; ignore and keep serving
  } finally {
    try { $res.Close() } catch {}
  }
}
