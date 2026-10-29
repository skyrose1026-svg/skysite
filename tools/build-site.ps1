# Builds the data-driven pages into a separate site copy so the live source pages
# are never overwritten by the older data-driven templates.
# Run: powershell -NoProfile -ExecutionPolicy Bypass -File tools\build-site.ps1
# Optional: -OutputDirectory path\to\output (must not be the project root).

param(
    [string]$OutputDirectory = (Join-Path (Split-Path -Parent $PSScriptRoot) 'generated-site')
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$rootPath = [System.IO.Path]::GetFullPath($root).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
$outputRoot = [System.IO.Path]::GetFullPath($OutputDirectory).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
if ($outputRoot -eq $rootPath) {
    throw 'OutputDirectory cannot be the project root. Choose a separate generated-site directory.'
}
$rootPrefix = $rootPath + [System.IO.Path]::DirectorySeparatorChar
if (-not $outputRoot.StartsWith($rootPrefix, [System.StringComparison]::Ordinal)) {
    throw 'OutputDirectory must be inside the project root.'
}
$outputRelative = $outputRoot.Substring($rootPrefix.Length)
if ($outputRelative.Contains([System.IO.Path]::DirectorySeparatorChar) -or $outputRelative.Contains([System.IO.Path]::AltDirectorySeparatorChar)) {
    throw 'OutputDirectory must be a direct child of the project root to prevent copying or overwriting unrelated files.'
}
if ($outputRelative -in @('.git', 'fish', 'waters', 'gear', 'tools')) {
    throw 'OutputDirectory cannot replace a source directory.'
}

New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
foreach ($entry in Get-ChildItem -LiteralPath $root -Force) {
    $entryPath = [System.IO.Path]::GetFullPath($entry.FullName).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
    if ($entry.Name -eq '.git' -or $entryPath -eq $outputRoot) { continue }
    Copy-Item -LiteralPath $entry.FullName -Destination $outputRoot -Recurse -Force
}

. (Join-Path $PSScriptRoot 'species-data.ps1')
. (Join-Path $PSScriptRoot 'waters-data.ps1')
if (-not $species -or -not $waters) {
    throw 'Species or water data is empty; refusing to generate an incomplete site.'
}

# ---------- helpers ----------

function ConvertTo-HtmlTable {
    param([object]$rows, [string[]]$headers)
    if (-not $rows -or $rows.Count -eq 0) { return '' }
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<table class="table"><thead><tr>')
    foreach ($h in $headers) { [void]$sb.Append('<th>' + $h + '</th>') }
    [void]$sb.Append('</tr></thead><tbody>')
    foreach ($row in $rows) {
        [void]$sb.Append('<tr>')
        foreach ($cell in $row) { [void]$sb.Append('<td>' + $cell + '</td>') }
        [void]$sb.Append('</tr>')
    }
    [void]$sb.Append('</tbody></table>')
    return $sb.ToString()
}

function ConvertTo-List {
    param([object]$items)
    if (-not $items -or $items.Count -eq 0) { return '' }
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<ul>')
    foreach ($item in $items) { [void]$sb.Append('<li>' + $item + '</li>') }
    [void]$sb.Append('</ul>')
    return $sb.ToString()
}

function Get-SpeciesLink {
    param([string]$name, [hashtable]$bySlug, [string]$basePath = '../')
    $aliases = @{
        'cutthroat-trout' = 'coastal-cutthroat-trout'
        'white sturgeon' = 'white-sturgeon'
    }
    $slug = $name
    if ($aliases.ContainsKey($name)) { $slug = $aliases[$name] }
    if ($bySlug.ContainsKey($slug)) {
        $sp = $bySlug[$slug]
        $badgeGroup = $sp.group.ToLowerInvariant() -replace '[^a-z0-9]+', '-'
        return '<a class="badge badge--' + $badgeGroup + '" href="' + $basePath + 'fish/' + $sp.slug + '.html">' + $sp.name + '</a>'
    }
    return '<span class="badge badge--other">' + $name + '</span>'
}

function Get-SvgArt {
    param([hashtable]$sp)
    $a = $script:artRecipes[$sp.art]
    if (-not $a) { $a = $script:artRecipes['default'] }
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<svg class="fish-art" viewBox="0 0 280 120" role="img" aria-label="' + $sp.name + ' illustration">')
    [void]$sb.Append('<path d="' + $a.tail + '" fill="' + $a.base + '" stroke="' + $a.markColor + '" stroke-width="1.5"/>')
    [void]$sb.Append('<path d="' + $a.body + '" fill="' + $a.base + '" stroke="' + $a.markColor + '" stroke-width="1.5"/>')
    [void]$sb.Append('<path d="' + $a.dorsal + '" fill="' + $a.base + '" stroke="' + $a.markColor + '" stroke-width="1"/>')
    [void]$sb.Append('<path d="' + $a.pectoral + '" fill="' + $a.belly + '" stroke="' + $a.markColor + '" stroke-width="1"/>')
    [void]$sb.Append('<path d="' + $a.adipose + '" fill="' + $a.base + '" stroke="' + $a.markColor + '" stroke-width="1"/>')
    [void]$sb.Append('<circle cx="37" cy="51" r="5" fill="#fff"/><circle cx="37" cy="51" r="2.5" fill="' + $a.markColor + '"/>')
    [void]$sb.Append('<path d="M20 61 Q 25 65 30 62" fill="none" stroke="' + $a.markColor + '" stroke-width="1.5"/>')
    foreach ($mark in $a.marks) {
        if ($mark.type -eq 'speckles') {
            $count = [Math]::Min([int]$mark.count, 40)
            for ($i = 0; $i -lt $count; $i++) {
                $x = 62 + (($i * 29) % 145)
                $y = 43 + (($i * 17) % 30)
                [void]$sb.Append('<circle cx="' + $x + '" cy="' + $y + '" r="1.5" fill="' + $mark.color + '"/>')
            }
        } elseif ($mark.type -eq 'lateral-stripe') {
            [void]$sb.Append('<path d="M39 62 Q 120 67 220 58" fill="none" stroke="' + $mark.color + '" stroke-width="' + $mark.width + '" opacity="0.75"/>')
        } elseif ($mark.type -eq 'jaw-slash') {
            [void]$sb.Append('<path d="M27 67 L 39 75" stroke="' + $mark.color + '" stroke-width="4"/>')
        }
    }
    [void]$sb.Append('</svg>')
    return $sb.ToString()
}

function New-MapElement {
    param([string]$id, [object]$pins, [string]$className = 'map')
    $json = ConvertTo-Json -InputObject @($pins) -Compress -Depth 6
    $encoded = [System.Net.WebUtility]::HtmlEncode($json)
    return '<div class="' + $className + '" id="' + $id + '" data-pins="' + $encoded + '"></div>'
}

function New-Page {
    param([string]$title, [string]$description, [string]$bodyHtml, [string]$active, [string]$basePath)
    $nav = @(
        @('Angler Guide', $basePath + 'index.html'),
        @('Fish', $basePath + 'fish/fish.html'),
        @('Waters', $basePath + 'waters/waters.html'),
        @('Gear', $basePath + 'gear/gear.html'),
        @('Setup Builder', $basePath + 'setup-builder.html'),
        @('Trip Planning', $basePath + 'trip-planning.html'),
        @('Fishing Calendar', $basePath + 'fishing-calendar.html'),
        @('Fishing Log', $basePath + 'fishing-log.html'),
        @('Newsletter', $basePath + 'newsletter.html'),
        @('Suggest a correction', $basePath + 'feedback.html'),
        @('Regulations', 'https://myodfw.com/fishing/regulations')
    )
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<!DOCTYPE html>')
    [void]$sb.Append('<html lang="en">')
    [void]$sb.Append('<head>')
    [void]$sb.Append('<meta charset="utf-8">')
    [void]$sb.Append('<meta name="viewport" content="width=device-width, initial-scale=1">')
    [void]$sb.Append('<title>' + $title + ' | Southern Oregon Angler Guide</title>')
    [void]$sb.Append('<meta name="description" content="' + $description + '">')
    [void]$sb.Append('<link rel="stylesheet" href="' + $basePath + 'styles/styles.css">')
    [void]$sb.Append('</head>')
    [void]$sb.Append('<body>')
    [void]$sb.Append('<header class="site-header"><details class="site-nav-menu"><summary>Menu</summary><nav class="site-nav" aria-label="Main">')
    foreach ($item in $nav) {
        $cls = 'site-nav__link'
        if ($item[0] -eq $active) { $cls = 'site-nav__link site-nav__link--active' }
        [void]$sb.Append('<a class="' + $cls + '" href="' + $item[1] + '">' + $item[0] + '</a>')
    }
    [void]$sb.Append('</nav></details>')
    [void]$sb.Append('<form class="site-search" role="search" data-site-search data-index="' + $basePath + 'data/site-search-index.json" data-root="' + $basePath + '">')
    [void]$sb.Append('<label for="site-search-input">Search the whole site</label><div class="site-search__controls">')
    [void]$sb.Append('<input type="search" id="site-search-input" name="q" placeholder="Fish, waters, gear…" autocomplete="off" aria-controls="site-search-results">')
    [void]$sb.Append('<button type="submit">Search</button></div><div class="site-search__results" id="site-search-results" data-search-results aria-live="polite"></div></form></header>')
    [void]$sb.Append('<main>')
    [void]$sb.Append($bodyHtml)
    [void]$sb.Append('</main>')
    [void]$sb.Append('<footer class="site-footer"><p>Southern Oregon Angler Guide — a student project. Always confirm rules at <a href="https://myodfw.com/fishing/regulations">myodfw.com</a> before you fish.</p></footer>')
    [void]$sb.Append('<script src="' + $basePath + 'map.js"></script>')
    [void]$sb.Append('<script src="' + $basePath + 'scripts/site-search.js" defer></script>')
    [void]$sb.Append('</body></html>')
    return $sb.ToString()
}

function New-SpeciesPage {
    param([hashtable]$sp)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<h1>' + $sp.name + '</h1>')
    [void]$sb.Append('<p class="lede">' + $sp.blurb + '</p>')
    [void]$sb.Append('<div class="fish-art-frame">' + (Get-SvgArt $sp) + '</div>')
    [void]$sb.Append('<p class="photo-credit">Original illustration — field marks exaggerated for identification.</p>')
    [void]$sb.Append('<section id="identify"><h2>How to identify</h2>')
    [void]$sb.Append((ConvertTo-List $sp.idMarks))
    [void]$sb.Append('<div class="fish-photo"><img src="' + $sp.img + '" alt="' + $sp.alt + '" loading="lazy"></div>')
    [void]$sb.Append('<p class="photo-credit">Photo: <a href="' + $sp.imgPage + '">' + $sp.imgPage + '</a> (Wikimedia Commons)</p>')
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="where"><h2>Where to find it</h2>')
    [void]$sb.Append('<p>Explore the mapped locations below and check the water-specific access, season, and regulation notes before fishing.</p>')
    [void]$sb.Append((New-MapElement -id ('map-' + $sp.slug) -pins $sp.mapPins))
    [void]$sb.Append('<ul class="pin-list">')
    foreach ($pin in $sp.mapPins) {
        [void]$sb.Append('<li><strong>' + $pin.name + '</strong> — ' + $pin.note + '</li>')
    }
    [void]$sb.Append('</ul>')
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="prey"><h2>What it eats and what to throw</h2>')
    [void]$sb.Append((ConvertTo-HtmlTable $sp.prey @('Prey', 'When', 'Lures and bait that mimic it')))
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="activity"><h2>When it feeds</h2>')
    [void]$sb.Append((ConvertTo-HtmlTable $sp.activity @('Season', 'Time of day', 'Water temp', 'Notes')))
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="regs"><h2>Rules and regulations</h2>')
    [void]$sb.Append('<div class="alert"><strong>Always verify:</strong> rules change by zone and season. Check <a href="https://myodfw.com/fishing/regulations">myodfw.com</a> before every trip.</div>')
    [void]$sb.Append((ConvertTo-List $sp.regs))
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="stocking"><h2>Stocking</h2>')
    [void]$sb.Append('<p>' + $sp.stocking + '</p>')
    [void]$sb.Append('<p><a href="https://myodfw.com/articles/trout-stocking-maps">ODFW trout stocking maps and schedules</a></p>')
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="gear"><h2>Gear basics</h2>')
    [void]$sb.Append((ConvertTo-List $sp.gear))
    [void]$sb.Append('<p><a class="button button--primary" href="../gear/shop.html?category=all&amp;q=' + $sp.name + '">Browse shop recommendations for ' + $sp.name + '</a></p>')
    [void]$sb.Append('<p><a class="button button--secondary" href="../setup-builder.html?fish=' + $sp.slug + '">Build a setup for this fish</a></p>')
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="related"><h2>Waters that hold ' + $sp.name + '</h2>')
    [void]$sb.Append('<ul>')
    foreach ($w in $sp.waters) {
        [void]$sb.Append('<li><strong>' + $w[0] + '</strong> — ' + $w[1] + '</li>')
    }
    [void]$sb.Append('</ul></section>')
    [void]$sb.Append('<section id="fun-facts"><h2>Fun facts</h2>')
    [void]$sb.Append((ConvertTo-List $sp.funFacts))
    [void]$sb.Append('</section>')
    return $sb.ToString()
}

function New-WaterPage {
    param([hashtable]$w, [hashtable]$bySlug)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<h1>' + $w.name + '</h1>')
    [void]$sb.Append('<p class="lede">' + $w.blurb + '</p>')
    [void]$sb.Append((New-MapElement -id ('map-' + $w.slug) -pins $w.pins -className 'map map--wide'))
    [void]$sb.Append('<section id="fish"><h2>Fish in this water</h2>')
    [void]$sb.Append('<div class="card__badges">')
    foreach ($f in $w.fish) {
        [void]$sb.Append((Get-SpeciesLink $f $bySlug))
    }
    [void]$sb.Append('</div>')
    [void]$sb.Append('</section>')
    if ($w.pins.Count -gt 0) {
        $forecastPin = $w.pins[0]
        [void]$sb.Append('<section><h2>7-Day Weather Forecast</h2><div class="weather" id="weather" data-lat="' + $forecastPin.lat + '" data-lng="' + $forecastPin.lng + '"><p>Use the Trip Planning page for a date-specific forecast.</p></div></section>')
    }
    [void]$sb.Append('<section id="tributaries"><h2>Tributaries</h2>')
    [void]$sb.Append((ConvertTo-HtmlTable $w.tributaries @('Tributary', 'Notes')))
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="regs"><h2>Rules and regulations</h2>')
    [void]$sb.Append('<div class="alert"><strong>Always verify:</strong> rules change by zone and season. Check <a href="https://myodfw.com/fishing/regulations">myodfw.com</a> before every trip.</div>')
    [void]$sb.Append((ConvertTo-HtmlTable $w.regs @('Topic', 'Rule')))
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="details"><h2>Details</h2>')
    [void]$sb.Append((ConvertTo-HtmlTable $w.details @('Topic', 'Information')))
    [void]$sb.Append('</section>')
    [void]$sb.Append('<p><a class="button button--primary" href="../trip-planning.html?water=' + $w.slug + '">Plan a trip to this water</a></p>')
    return $sb.ToString()
}

function New-FishCatalog {
    param([object]$species, [hashtable]$bySlug)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<h1>Fish species</h1>')
    [void]$sb.Append('<p class="lede">All ' + $species.Count + ' species with identification, prey, lures, activity, regulations, stocking, and maps.</p>')
    $groups = @{}
    foreach ($sp in $species) {
        if (-not $groups.ContainsKey($sp.group)) { $groups[$sp.group] = New-Object System.Collections.ArrayList }
        [void]$groups[$sp.group].Add($sp)
    }
    foreach ($g in $groups.Keys) {
        [void]$sb.Append('<section id="' + ($g -replace '\s+', '-').ToLower() + '"><h2>' + $g + '</h2>')
        [void]$sb.Append('<div class="fish-grid">')
        foreach ($sp in $groups[$g]) {
            [void]$sb.Append('<a class="fish-card" href="./' + $sp.slug + '.html">')
            [void]$sb.Append('<div class="fish-card__photo"><img src="' + $sp.img + '" alt="' + $sp.alt + '" loading="lazy"></div>')
            [void]$sb.Append('<h3>' + $sp.name + '</h3>')
            [void]$sb.Append('<p>' + $sp.blurb + '</p>')
            [void]$sb.Append('<div class="card__badges">')
            foreach ($t in $sp.tags) {
                [void]$sb.Append('<span class="badge badge--' + $t + '">' + $t + '</span>')
            }
            [void]$sb.Append('</div></a>')
        }
        [void]$sb.Append('</div></section>')
    }
    return $sb.ToString()
}

function New-WatersCatalog {
    param([object]$waters, [hashtable]$bySlug)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<h1>Oregon waters</h1>')
    [void]$sb.Append('<p class="lede">Every river with fish, tributaries, regulations, and a map.</p>')
    $allPins = @($waters | ForEach-Object { $_.pins })
    [void]$sb.Append((New-MapElement -id 'map-all' -pins $allPins -className 'map map--wide'))
    $coastalPinMap = @{}
    foreach ($saltwaterSpecies in ($script:species | Where-Object { $_.group -eq 'Saltwater Fish' })) {
        foreach ($pin in $saltwaterSpecies.mapPins) {
            $pinKey = "$($pin.lat),$($pin.lng)"
            if (-not $coastalPinMap.ContainsKey($pinKey)) {
                $coastalPinMap[$pinKey] = $pin
            }
        }
    }
    $coastalPins = @($coastalPinMap.Values)
    if ($coastalPins.Count -gt 0) {
        [void]$sb.Append('<section aria-labelledby="coastal-access-heading"><h2 id="coastal-access-heading">Southern Oregon saltwater access</h2>')
        [void]$sb.Append('<p>Markers show coastal ports and nearby access regions, not exact fishing spots. Check access, ocean conditions, and current rules before going.</p>')
        [void]$sb.Append((New-MapElement -id 'map-saltwater' -pins $coastalPins -className 'map map--wide'))
        [void]$sb.Append('</section>')
    }
    [void]$sb.Append('<div class="water-grid">')
    foreach ($w in $waters) {
        [void]$sb.Append('<a class="water-card" href="./' + $w.slug + '.html">')
        [void]$sb.Append('<h3>' + $w.name + '</h3>')
        [void]$sb.Append('<p class="water-card__region">' + $w.region + '</p>')
        [void]$sb.Append('<p>' + $w.blurb + '</p>')
        [void]$sb.Append('<div class="card__badges">')
        foreach ($f in $w.fish) {
            [void]$sb.Append((Get-SpeciesLink $f $bySlug '../'))
        }
        [void]$sb.Append('</div></a>')
    }
    [void]$sb.Append('</div>')
    return $sb.ToString()
}

# ---------- build ----------

$bySlug = @{}
foreach ($sp in $species) { $bySlug[$sp.slug] = $sp }

# species pages
$fishOutput = Join-Path $outputRoot 'fish'
$watersOutput = Join-Path $outputRoot 'waters'
New-Item -ItemType Directory -Path $fishOutput -Force | Out-Null
New-Item -ItemType Directory -Path $watersOutput -Force | Out-Null

foreach ($sp in $species) {
    $html = New-Page -title $sp.name -description $sp.blurb -active 'Fish' -bodyHtml (New-SpeciesPage $sp) -basePath '../'
    [System.IO.File]::WriteAllText((Join-Path $fishOutput ($sp.slug + '.html')), $html, (New-Object System.Text.UTF8Encoding $false))
}

# water pages
foreach ($w in $waters) {
    $html = New-Page -title $w.name -description $w.blurb -active 'Waters' -bodyHtml (New-WaterPage $w $bySlug) -basePath '../'
    [System.IO.File]::WriteAllText((Join-Path $watersOutput ($w.slug + '.html')), $html, (New-Object System.Text.UTF8Encoding $false))
}

# fish catalog
$html = New-Page -title 'Fish species' -description 'All species with identification, prey, lures, activity, regulations, stocking, and maps.' -active 'Fish' -bodyHtml (New-FishCatalog $species $bySlug) -basePath '../'
[System.IO.File]::WriteAllText((Join-Path $fishOutput 'fish.html'), $html, (New-Object System.Text.UTF8Encoding $false))

# waters catalog
$html = New-Page -title 'Oregon waters' -description 'Every river with fish, tributaries, regulations, and a map.' -active 'Waters' -bodyHtml (New-WatersCatalog $waters $bySlug) -basePath '../'
[System.IO.File]::WriteAllText((Join-Path $watersOutput 'waters.html'), $html, (New-Object System.Text.UTF8Encoding $false))

# leaflet map script (shared by every page with a map)
$mapScript = @'
document.addEventListener('DOMContentLoaded', function () {
  var mapEls = document.querySelectorAll('.map');
  if (!mapEls.length) return;
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(css);
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  s.onload = function () {
    var oregon = [43.9, -120.5];
    var zoom = 6;
    mapEls.forEach(function (el) {
      var pins = JSON.parse(el.getAttribute('data-pins') || '[]');
      if (!pins.length) return;
      var m = L.map(el).setView(oregon, zoom);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(m);
      pins.forEach(function (p) {
        L.marker([p.lat, p.lng]).addTo(m).bindPopup('<strong>' + p.name + '</strong>');
      });
      if (pins.length === 1) {
        m.setView([pins[0].lat, pins[0].lng], 10);
      } else if (pins.length > 1) {
        m.fitBounds(pins.map(function (p) { return [p.lat, p.lng]; }), { padding: [30, 30] });
      }
    });
  };
  document.head.appendChild(s);
});
'@
$mapPath = Join-Path $outputRoot 'map.js'
[System.IO.File]::WriteAllText($mapPath, $mapScript, (New-Object System.Text.UTF8Encoding $false))

$searchBuilder = Join-Path $outputRoot 'tools/build-search-index.py'
if (Test-Path -LiteralPath $searchBuilder) {
    $python = Get-Command python3 -ErrorAction SilentlyContinue
    if (-not $python) { $python = Get-Command python -ErrorAction SilentlyContinue }
    if ($python) {
        & $python.Source $searchBuilder
        if ($LASTEXITCODE -ne 0) { throw 'Search-index generation failed.' }
    } else {
        Write-Warning 'Python was not found; run tools/build-search-index.py in the output directory to refresh search.'
    }
}

Write-Host ('Built ' + $species.Count + ' species pages and ' + $waters.Count + ' water pages under ' + $outputRoot)
