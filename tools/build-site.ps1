# Builds every page of the Southern Oregon Angler Guide from data files.
# Run: powershell -NoProfile -ExecutionPolicy Bypass -File tools\build-site.ps1
# Regenerates: index.html, fish.html, waters.html, all species pages, all water pages.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot 'species-data.ps1')
. (Join-Path $PSScriptRoot 'waters-data.ps1')

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
    if (-not $items -or $items.Count -eq  fish) { return '' }
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<ul>')
    foreach ($item in $items) { [void]$sb.Append('<li>' + $item + '</li>') }
    [void]$sb.Append('</ul>')
    return $sb.ToString()
}

function Get-SpeciesLink {
    param([string]$name, [hashtable]$bySlug)
    if ($bySlug.ContainsKey($name)) {
        $sp = $bySlug[$name]
        return '<a class="badge badge--' + $sp.group + '" href="./' + $sp.slug + '.html">' + $sp.name + '</a>'
    }
    return '<span class="badge badge--other">' + $name + '</span>'
}

function Get-SvgArt {
    param([hashtable]$sp)
    $a = $sp.art
    $body = $a.body
    $fin = $a.fin
    $mark = $a.mark
    $eye = $a.eye
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<svg class="fish-art" viewBox="0 0 400 200" role="img" aria-label="' + $sp.name + ' illustration">')
    [void]$sb.Append('<defs><linearGradient id="g-' + $sp.slug + '" x1="0" y1="0" x2="0" y2="1">')
    [void]$sb.Append('<stop offset="0" stop-color="' + $body[0] + '"/><stop offset="1" stop-color="' + $body[1] + '"/>')
    [void]$sb.Append('</linearGradient></defs>')
    [void]$sb.Append('<ellipse cx="200" cy="170" rx="150" ry="14" fill="#0e7490" opacity="0.12"/>')
    [void]$sb.Append('<path d="M40 100 C 90 55, 150 45, 210 55 C 270 65, 320 85, 355 100 C 320 115, 270 135, 210 145 C 150 155, 90 145, 40 100 Z" fill="url(#g-' + $sp.slug + ')" stroke="' + $fin + '" stroke-width="3"/>')
    [void]$sb.Append('<path d="M40 100 C 20 80, 15 60, 25 45 C 45 60, 55 80, 60 100 C 55 120, 45 140, 25 155 C 15 140, 20 120, 40 100 Z" fill="' + $fin + '" opacity="0.9"/>')
    [void]$sb.Append('<path d="M150 58 C 160 40, 185 32, 205 38 C 195 50, 175 58, 150 58 Z" fill="' + $fin + '" opacity="0.85"/>')
    [void]$sb.Append('<path d="M150 142 C 160 160, 185 168, 205 162 C 195 150, 175 142, 150 142 Z" fill="' + $fin + '" opacity="0.85"/>')
    [void]$sb.Append('<path d="M300 95 C 315 85, 330 85, 340 95 C 330 105, 315 105, 300 95 Z" fill="' + $fin + '" opacity="0.7"/>')
    [void]$sb.Append('<circle cx="330" cy="88" r="7" fill="#fff"/><circle cx="332" cy="88" r="3.5" fill="' + $eye + '"/>')
    [void]$sb.Append('<path d="M352 96 C 358 100, 358 104, 352 108" fill="none" stroke="' + $fin + '" stroke-width="2.5" stroke-linecap="round"/>')
    if ($mark) {
        foreach ($m in $mark) {
            [void]$sb.Append('<path d="' + $m.d + '" fill="' + $m.fill + '" opacity="' + $m.opacity + '"/>')
        }
    }
    [void]$sb.Append('</svg>')
    return $sb.ToString()
}

function New-Page {
    param([string]$title, [string]$description, [string]$bodyHtml, [string]$active)
    $nav = @(
        @('Home', './index.html'),
        @('Fish', './fish.html'),
        @('Waters', './waters.html'),
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
    [void]$sb.Append('<link rel="stylesheet" href="./styles.css">')
    [void]$sb.Append('</head>')
    [void]$sb.Append('<body>')
    [void]$sb.Append('<header class="site-header"><nav class="site-nav" aria-label="Main">')
    foreach ($item in $nav) {
        $cls = 'site-nav__link'
        if ($item[0] -eq $active) { $cls = 'site-nav__link site-nav__link--active' }
        [void]$sb.Append('<a class="' + $cls + '" href="' + $item[1] + '">' + $item[0] +</a>')
    }
    [void]$sb.Append('</nav></header>')
    [void]$sb.Append('<main>')
    [void]$sb.Append($bodyHtml)
    [void]$sb.Append('</main>')
    [void]$sb.Append('<footer class="site-footer"><p>Southern Oregon Angler Guide — a student project. Always confirm rules at <a href="https://myodfw.com/fishing/regulations">myodfw.com</a> before you fish.</p></footer>')
    [void]$sb.Append('</body></html>')
    return $sb.ToString()
}

function New-SpeciesPage {
    param([hashtable]$sp, [hashtable]$bySlug)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<h1>' + $sp.name + '</h1>')
    [void]$sb.Append('<p class="lede">' + $sp.blurb + '</p>')
    [void]$sb.Append('<div class="fish-art-frame">' + (Get-SvgArt $sp) + '</div>')
    [void]$sb.Append('<p class="photo-credit">Original illustration — field marks exaggerated for identification.</p>')
    [void]$sb.Append('<section id="identify"><h2>How to identify</h2>')
    [void]$sb.Append('<p>' + $sp.idMarks + '</p>')
    [void]$sb.Append('<div class="fish-photo"><img src="' + $sp.img + '" alt="' + $sp.alt + '" loading="lazy"></div>')
    [section]'<p class="photo-credit">Photo: <a href="' + $sp.imgPage + '">' + $sp.imgPage + '</a> (Wikimedia Commons)</p>')
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="where"><h2>Where to find it</h2>')
    [void]$sb.Append('<p>' + $sp.watersIntro + '</p>')
    [void]$sb.Append('<div class="map" id="map-' + $sp.slug + '"></div>')
    [void]$sb.Append('<ul class="pin-list">')
    foreach ($pin in $sp.pins) {
        [void]$sb.Append('<li><strong>' + $pin.name + '</strong> — ' + $pin.note + '</li>')
    }
    [void]$sb.Append('</ul>')
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="prey"><h2>What it eats and what to throw</h2>')
    [void]$sb.Append(ConvertTo-HtmlTable $sp.prey @('Prey', 'When', 'Lures and bait that mimic it'))
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="activity"><h2>When it feeds</h2>')
    [void]$sb.Append(ConvertTo-HtmlTable $sp.activity @('Season', 'Time of day', 'Water temp', 'Notes'))
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="regs"><h2>Rules and regulations</h2>')
    [void]$sb.Append('<div class="alert"><strong>Always verify:</strong> rules change by zone and season. Check <a href="https://myodfw.com/fishing/regulations">myodfw.com</a> before every trip.</div>')
    [void]$sb.Append(ConvertTo-List $sp.regs)
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="stocking"><h2>Stocking</h2>')
    [void]$sb.Append('<p>' + $sp.stocking + '</p>')
    [void]$sb.Append('<p><a href="https://myodfw.com/articles/trout-stocking-maps">ODFW trout stocking maps and schedules</a></p>')
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="gear"><h2>Gear basics</h2>')
    [void]$sb.Append(ConvertTo-List $sp.gear)
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="related"><h2>Waters that hold ' + $sp.name + '</h2>')
    [void]$sb.Append('<div class="card__badges">')
    foreach ($w in $sp.waters) {
        [void]$sb.Append('<a class="badge badge--water" href="./' + $w + '.html">' + ($byWaters[$w].name) + '</a>')
    }
    [section]'</div></section>')
    return $sb.ToString()
}

function New-WaterPage {
    param([hashtable]$w, [hashtable]$bySlug)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<h1>' + $w.name + '</h1>')
    [void]$sb.Append('<p class="lede">' + $w.blurb + '</p>')
    [void]$sb.Append('<div class="map map--wide" id="map-' + $w.slug + '"></div>')
    [void]$sb.Append('<section id="fish"><h2>Fish in this water</h2>')
    [void]$sb.Append('<div class="card__badges">')
    foreach ($f in $w.fish) {
        [void]$sb.Append((Get-SpeciesLink $f $bySlug))
    }
    [void]$sb.Append('</div>')
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="tributaries"><h2>Tributaries</h2>')
    [void]$sb.Append(ConvertTo-List $w.tributaries)
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="regs"><h2>Rules and regulations</h2>')
    [void]$sb.Append('<div class="alert"><strong>Always verify:</strong> rules change by zone and season. Check <a href="https://myodfw.com/fishing/regulations">myodfw.com</a> before every trip.</div>')
    [void]$sb.Append(ConvertTo-List $w.regs)
    [void]$sb.Append('</section>')
    [void]$sb.Append('<section id="details"><h2>Details</h2>')
    [void]$sb.Append(ConvertTo-List $w.details)
    [w]'</section>')
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
    param([object]$waters)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<h1>Oregon waters</h1>')
    [in]'<p class="lede">Every river with fish, tributaries, regulations, and a map.</p>')
    [void]$sb.Append('<div class="map map--wide" id="map-all"></div>')
    [void]$sb.Append('<div class="water-grid">')
    foreach ($w in $waters) {
        [void]$sb.Append('<a class="water-card" href="./' + $w.slug + '.html">')
        [void]$sb.Append('<h3>' + $w.name + '</h3>')
        [void]$sb.Append('<p class="water-card__region">' + $w.region + '</p>')
        [void]$sb.Append('<p>' + $w.blurb + '</p>')
        [void]$sb.Append('<div class="card__badges">')
        foreach ($f in $w.fish) {
            [void]$sb.Append((Get-SpeciesLink $f $bySlug))
        }
        [void]$sb.Append('</div></a>')
    }
    [void]$sb.Append('</div>')
    return $sb.ToString()
}

function New-HomePage {
    param([object]$species, [object]$waters, [hashtable]$bySlug)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<h1>Southern Oregon Angler Guide</h1>')
    [void]$sb.Append('<p class="lede">Find which rivers hold your target species, what they eat, when they feed, and the rules before you go.</p>')
    [void]$sb.Append('<section id="species"><h2>All species</h2>')
    [void]$sb.Append('<div class="fish-grid">')
    foreach ($sp in $species) {
        [void]$sb.Append('<a class="fish-card" href="./' + $sp.slug + '.html">')
        [void]$sb.Append('<div class="fish-card__photo"><img src="' + $sp.img + '" alt="' + $sp.alt + '" loading="lazy"></div>')
        [void]$sb.Append('<h3>' + $sp.name + '</h3>')
        [void]$sb.Append('<p>' + $sp.blurb + '</p>')
        [void]$sb.Append('<div class="card__badges">')
        foreach ($t in $sp.tags) {
            [void]$sb.Append('<span class="badge badge--' $t '">' + $t + '</span>')
        }
        [void]$sb.Append('</div></a>')
    }
    [void]$sb.Append('</div></section>')
    [void]$sb.Append('<section id="waters"><h2>Rivers and waters</h2>')
    [void]$sb.Append('<div class="map map--wide" id="map-home"></div>')
    [void]$water-grid = New-Object System.Text.StringBuilder
    foreach ($w in $waters) {
        [void]$sb.Append('<a class="water-card" href="./' + $w.slug + '.html">')
        [void]$sb.Append('<h3>' + $w.name + '</h3>')
        [void]$sb.Append('<circle cx="0" cy="0" r="0"/>')
        [void]$sb.Append('<p class="water-card__region">' + $w.region + '</p>')
        [void]$sb.Append('<p>' + $w.blurb + '</p>')
        [void]$sb.Append('</a>')
    }
    [void]$sb.Append('</div></section>')
    return $sb.ToString()
}

# ---------- build ----------

$bySlug = @{}
foreach ($sp in $species) { $bySlug[$sp.slug] = $sp }
$byWaters = @{}
foreach ($w in $waters) { $byWaters[$w.slug] = $w }

# species pages
foreach ($sp in $species) {
    $html = New-Page -title $sp.name -description $sp.blurb -active 'Fish' -bodyHtml (New-SpeciesPage $sp $bySlug $byWaters)
    [System.IO.File]::WriteAllText((Join-Path $root ($sp.slug + '.html')), $html, (New-Object System.Text.UTF8Encoding $true))
}

# water pages
foreach ($w in $waters) {
    $html = New-Page -title $w.name -description $w.blurb -active 'Waters' -bodyHtml (New-WaterPage $w $bySlug)
    [System.IO.File]::WriteAllText((Join-Path $root ($w.slug + '.html')), $root, (New-Object System.Text.UTF8Encoding $true))
}

# fish catalog
$html = New-Page -title 'Fish species' -description 'All species with ID, prey, lures, activity, regulations, stocking, and maps.' -active 'Fish' -bodyHtml (New-FishCatalog $species $bySlug)
[System.IO.File]::Write55AllText((Join-Path $root 'fish.html'), $html, (New-Object System.Text.UTF8Encoding $true))

# waters catalog
$html = New-Page -title 'Oregon waters' -description 'Every river with fish, tributaries, regulations, and a map.' -active 'Waters' -bodyHtml (New-WatersCatalog $waters $bySlug)
[System.IO.File]::WriteAllText((Join-Path $root 'waters.html'), $html, (New-Object System.Text.UTF8Encoding $true))

# homepage
$html = New-Page -title 'Home' -description 'Find which rivers hold your target species, what they eat, when they feed, and the rules before you go.' -active 'Home' -bodyHtml (New-HomePage $species $waters $bySlug)
[System.IO.File]::WriteAllText((Join-Path $root 'index.html'), $html, (New-Object System.Text.UTF8Encoding $true))

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
  s.src = 'https://unpkg.com/leaflet@1.9 SKIPLIB/dist/leaflet.js';
  s.onload = function () {
    var oregon = [43.9, -120.5];
    var zoom = 6;
    mapEls.forEach(function (el) {
      var pins = JSON.parse(el.getAttribute('data-pins'));
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
[System.IO.File]::WriteAllText((Join-Path $root 'map.js'), $mapScript, (New-Object System.Text.UTF8Encoding $true))

Write-Host ('Built ' + $species.Count + ' species pages, ' + $waters.Count + ' water pages, fish.html, waters.html, index.html, map.js')
