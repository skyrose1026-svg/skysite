# Species data for the Southern Oregon Angler Guide.
# Sourced by tools\build-site.ps1. Edit data here, then re-run the builder.

$script:regsUrl = 'https://myodfw.com/fishing/regulations'
$script:stockingUrl = 'https://myodfw.com/articles/trout-stocking-maps'

# SVG illustration recipes. Each draws the fish's real field marks:
# body shape, fin positions, and the marks an angler uses for ID.
$script:artRecipes = @{
    default = @{
        body = 'M 20 60 Q 60 30 130 32 Q 190 34 225 55 Q 190 76 130 78 Q 60 80 20 60 Z'
        tail = 'M 225 55 L 262 34 L 254 55 L 262 76 Z'
        dorsal = 'M 105 33 Q 125 14 150 32 L 105 33 Z'
        pectoral = 'M 62 62 Q 52 78 66 84 Q 74 72 62 62 Z'
        adipose = 'M 172 74 Q 180 66 188 74 Z'
        marks = @()
        markColor = '#1c1917'
        base = '#8a9bb0'
        belly = '#e8e2d6'
    }
    rainbow = @{
        body = 'M 20 60 Q 60 30 130 32 Q 190 34 225 55 Q 190 76 130 78 Q 60 80 20 60 Z'
        tail = 'M 225 55 L 262 34 L 254 55 L 262 76 Z'
        dorsal = 'M 105 33 Q 125 14 150 32 L 105 33 Z'
        pectoral = 'M 62 62 Q 52 78 66 84 Q 74 72 62 62 Z'
        adipose = 'M 172 74 Q 180 66 188 74 Z'
        base = '#7d97a8'
        belly = '#f0e6da'
        markColor = '#3d3d3d'
        marks = @(
            @{ type = 'speckles'; count = 26; color = '#3d3d3d' },
            @{ type = 'lateral-stripe'; color = '#e75a7c'; width = 9 }
        )
    }
    steelhead = @{
        body = 'M 20 60 Q 60 30 130 32 Q 190 34 225 55 Q 190 76 130 78 Q 60 80 20 60 Z'
        tail = 'M 225 55 L 262 34 L 254 55 L 262 76 Z'
        dorsal = 'M 105 33 Q 125 14 150 32 L 105 33 Z'
        pectoral = 'M 62 62 Q 52 78 66 84 Q 74 72 62 62 Z'
        adipose = 'M 172 74 Q 180 66 188 74 Z'
        base = '#9fb4c2'
        belly = '#f4efe6'
        markColor = '#4a4a4a'
        marks = @(
            @{ type = 'speckles'; count = 18; color = '#4a4a4a' }
        )
    }
    cutthroat = @{
        body = 'M 20 60 Q 60 30 130 32 Q 190 34 225 55 Q 190 76 130 78 Q 60 80 20 60 Z'
        tail = 'M 225 55 L 262 34 L 254 55 L 262 76 Z'
        dorsal = 'M 105 33 Q 125 14 150 32 L 105 33 Z'
        pectoral = 'M 62 62 Q 52 78 66 84 Q 74 72 62 62 Z'
        adipose = 'M 172 74 Q 180 66 188 74 Z'
        base = '#8fa38f'
        belly = '#f0e6da'
        markColor = '#3d3d3d'
        marks = @(
            @{ type = 'speckles'; count = 30; color = '#3d3d3d' },
            @{ type = 'jaw-slash'; color = '#d94f2b' }
        )
    }
    kokanee = @{
        body = 'M 24 60 Q 62 34 128 34 Q 186 36 222 56 Q 186 74 128 76 Q 62 78 24 60 Z'
        tail = 'M 222 56 L 258 38 L 250 56 L 258 74 Z'
        dorsal = 'M 100 34 Q 122 18 148 33 L 100 34 Z'
        pectoral = 'M 64 62 Q 54 78 68 84 Q 76 72 64 62 Z'
        adipose = 'M 170 74 Q 178 66 186 74 Z'
        base = '#5f8fa8'
        belly = '#eef0f2'
        markColor = '#41576b'
        marks = @(
            @{ type = 'speckles'; count = 8; color = '#41576b' }
        )
    }
    chinook = @{
        body = 'M 18 60 Q 58 28 128 30 Q 192 32 226 55 Q 192 78 128 80 Q 58 82 18 60 Z'
        tail = 'M 226 55 L 264 32 L 255 55 L 264 78 Z'
        dorsal = 'M 102 31 Q 124 12 152 30 L 102 31 Z'
        pectoral = 'M 60 62 Q 50 80 66 86 Q 74 72 60 62 Z'
        adipose = 'M 172 76 Q 180 68 188 76 Z'
        base = '#5d7a8c'
        belly = '#e8e2d6'
        markColor = '#333333'
        marks = @(
            @{ type = 'speckles'; count = 14; color = '#333333' },
            @{ type = 'gumline'; color = '#4a4a4a' }
        )
    }
    coho = @{
        body = 'M 20 60 Q 60 30 130 32 Q 190 34 225 55 Q 190 76 130 78 Q 60 80 20 60 Z'
        tail = 'M 225 55 L 262 34 L 254 55 L 262 76 Z'
        dorsal = 'M 104 33 Q 124 14 150 32 L 104 33 Z'
        pectoral = 'M 62 62 Q 52 78 66 84 Q 74 72 62 62 Z'
        adipose = 'M 172 74 Q 180 66 188 74 Z'
        base = '#6b8ba3'
        belly = '#eef0f2'
        markColor = '#3d3d3d'
        marks = @(
            @{ type = 'speckles'; count = 12; color = '#3d3d3d' },
            @{ type = 'gumline'; color = '#5a5a5a' }
        )
    }
    whitefish = @{
        body = 'M 26 60 Q 66 38 132 38 Q 190 40 224 56 Q 190 72 132 74 Q 66 76 26 60 Z'
        tail = 'M 224 56 L 258 40 L 251 56 L 258 72 Z'
        dorsal = 'M 108 38 Q 126 24 148 37 L 108 38 Z'
        pectoral = 'M 66 62 Q 56 76 70 82 Q 78 72 66 62 Z'
        adipose = 'M 170 72 Q 178 65 186 72 Z'
        base = '#a9b6bf'
        belly = '#f2efe8'
        markColor = '#5a6a75'
        marks = @(
            @{ type = 'speckles'; count = 6; color = '#5a6a75' }
        )
    }
    brook = @{
        body = 'M 22 60 Q 62 32 130 33 Q 190 35 224 55 Q 190 75 130 77 Q 62 79 22 60 Z'
        tail = 'M 224 55 L 260 36 L 252 55 L 260 74 Z'
        dorsal = 'M 104 34 Q 124 16 150 33 L 104 34 Z'
        pectoral = 'M 62 62 Q 52 78 66 84 Q 74 72 62 62 Z'
        adipose = 'M 170 75 Q 178 67 186 75 Z'
        base = '#4f6b52'
        belly = '#e8a13c'
        markColor = '#1e3323'
        marks = @(
            @{ type = 'wormtrail'; color = '#c8d8b0' },
            @{ type = 'spots-light'; count = 12; color = '#f2d24b' },
            @{ type = 'fin-edge'; color = '#ffffff' }
        )
    }
    bull = @{
        body = 'M 18 60 Q 58 28 128 30 Q 192 32 226 55 Q 192 78 128 80 Q 58 82 18 60 Z'
        tail = 'M 226 55 L 264 32 L 255 55 L 264 78 Z'
        dorsal = 'M 100 31 Q 122 12 150 30 L 100 31 Z'
        pectoral = 'M 60 62 Q 50 80 66 86 Q 74 72 60 62 Z'
        adipose = 'M 172 76 Q 180 68 188 76 Z'
        base = '#5c6b5a'
        belly = '#e8a13c'
        markColor = '#2a3328'
        marks = @(
            @{ type = 'spots-light'; count = 22; color = '#e8d9a0' },
            @{ type = 'fin-edge'; color = '#ffffff' }
        )
    }
    laker = @{
        body = 'M 18 60 Q 58 28 128 30 Q 192 32 226 55 Q 192 78 128 80 Q 58 82 18 60 Z'
        tail = 'M 226 55 L 264 32 L 255 55 L 264 78 Z'
        dorsal = 'M 100 31 Q 122 12 150 30 L 100 31 Z'
        pectoral = 'M 60 62 Q 50 80 66 86 Q 74 72 60 62 Z'
        adipose = 'M 172 76 Q 180 68 188 76 Z'
        base = '#57666e'
        belly = '#e6e9ea'
        markColor = '#2f3a40'
        marks = @(
            @{ type = 'spots-light'; count = 30; color = '#e3e8d8' }
        )
    }
    largemouth = @{
        body = 'M 18 60 Q 56 26 126 28 Q 194 32 228 56 Q 194 80 126 82 Q 56 84 18 60 Z'
        tail = 'M 228 56 L 264 34 L 256 56 L 264 78 Z'
        dorsal = 'M 96 29 Q 120 10 158 30 L 96 29 Z'
        pectoral = 'M 58 62 Q 48 80 64 86 Q 72 72 58 62 Z'
        adipose = $null
        base = '#5f7d43'
        belly = '#e9e4c8'
        markColor = '#2f421f'
        marks = @(
            @{ type = 'lateral-stripe'; color = '#31451f'; width = 12 }
        )
    }
    smallmouth = @{
        body = 'M 20 60 Q 58 28 128 30 Q 192 32 226 55 Q 192 78 128 80 Q 58 82 20 60 Z'
        tail = 'M 226 55 L 262 34 L 254 55 L 262 76 Z'
        dorsal = 'M 98 31 Q 120 12 156 31 L 98 31 Z'
        pectoral = 'M 60 62 Q 50 80 66 86 Q 74 72 60 62 Z'
        adipose = $null
        base = '#a08a52'
        belly = '#e6dcc0'
        markColor = '#4a3d1e'
        marks = @(
            @{ type = 'bars'; count = 9; color = '#4a3d1e' }
        )
    }
    bluegill = @{
        body = 'M 34 60 Q 70 34 128 34 Q 178 36 208 56 Q 178 76 128 78 Q 70 80 34 60 Z'
        tail = 'M 208 56 L 240 40 L 233 56 L 240 72 Z'
        dorsal = 'M 108 35 Q 128 16 152 34 L 108 35 Z'
        pectoral = 'M 74 62 Q 66 76 78 82 Q 84 72 74 62 Z'
        adipose = $null
        base = '#5c7a52'
        belly = '#e8c86a'
        markColor = '#2f421f'
        marks = @(
            @{ type = 'bars'; count = 6; color = '#3d5427' },
            @{ type = 'earflap'; color = '#2b2b2b' }
        )
    }
    crappie = @{
        body = 'M 30 60 Q 66 32 128 33 Q 180 35 210 56 Q 180 77 128 79 Q 66 81 30 60 Z'
        tail = 'M 210 56 L 244 38 L 236 56 L 244 74 Z'
        dorsal = 'M 104 34 Q 126 14 154 33 L 104 34 Z'
        pectoral = 'M 70 62 Q 62 78 74 84 Q 80 72 70 62 Z'
        adipose = $null
        base = '#9aa79b'
        belly = '#eef0ea'
        markColor = '#3a4a3d'
        marks = @(
            @{ type = 'speckles'; count = 34; color = '#3a4a3d' }
        )
    }
    perch = @{
        body = 'M 30 60 Q 68 32 130 33 Q 184 35 214 56 Q 184 77 130 79 Q 68 81 30 60 Z'
        tail = 'M 214 56 L 248 38 L 240 56 L 248 74 Z'
        dorsal = 'M 104 34 Q 126 14 154 33 L 104 34 Z'
        pectoral = 'M 70 62 Q 62 78 74 84 Q 80 72 70 62 Z'
        adipose = $null
        base = '#b3a24a'
        belly = '#efe6c0'
        markColor = '#4a4a1e'
        marks = @(
            @{ type = 'bars'; count = 7; color = '#4a4a1e' },
            @{ type = 'fin-color'; color = '#e07b2a' }
        )
    }
    catfish = @{
        body = 'M 20 62 Q 58 36 128 36 Q 192 38 226 58 Q 192 78 128 80 Q 58 82 20 62 Z'
        tail = 'M 226 58 L 262 40 L 254 58 L 262 76 Z'
        dorsal = 'M 100 37 Q 114 22 132 36 L 100 37 Z'
        pectoral = 'M 62 64 Q 52 80 66 86 Q 74 74 62 64 Z'
        adipose = 'M 168 78 Q 178 70 188 78 Z'
        base = '#6b7280'
        belly = '#d8d3c8'
        markColor = '#3f4650'
        marks = @(
            @{ type = 'barbels'; color = '#3f4650' },
            @{ type = 'no-scales'; color = '#8a93a0' }
        )
    }
    bullhead = @{
        body = 'M 22 62 Q 60 36 128 37 Q 190 39 224 58 Q 190 77 128 79 Q 60 81 22 62 Z'
        tail = 'M 224 58 L 258 42 L 251 58 L 258 74 Z'
        dorsal = 'M 100 38 Q 112 24 128 37 L 100 38 Z'
        pectoral = 'M 62 64 Q 52 80 66 86 Q 74 74 62 64 Z'
        adipose = 'M 166 77 Q 176 70 186 77 Z'
        base = '#7a6a52'
        belly = '#d8cfae'
        markColor = '#4a3d28'
        marks = @(
            @{ type = 'barbels'; color = '#4a3d28' }
        )
    }
    carp = @{
        body = 'M 20 60 Q 58 30 128 31 Q 192 33 226 55 Q 192 77 128 79 Q 58 81 20 60 Z'
        tail = 'M 226 55 L 262 36 L 254 55 L 262 74 Z'
        dorsal = 'M 98 32 Q 116 14 140 31 L 98 32 Z'
        pectoral = 'M 60 62 Q 50 80 66 86 Q 74 72 60 62 Z'
        adipose = $null
        base = '#a8823c'
        belly = '#e8d9a8'
        markColor = '#5c4a1e'
        marks = @(
            @{ type = 'scales'; color = '#8a6a2c' },
            @{ type = 'barbels'; color = '#5c4a1e' }
        )
    }
    pikeminnow = @{
        body = 'M 24 60 Q 64 38 132 38 Q 192 40 224 56 Q 192 72 132 74 Q 64 76 24 60 Z'
        tail = 'M 224 56 L 258 40 L 251 56 L 258 72 Z'
        dorsal = 'M 110 38 Q 124 26 142 37 L 110 38 Z'
        pectoral = 'M 66 62 Q 58 76 70 82 Q 76 72 66 62 Z'
        adipose = $null
        base = '#8a9a7a'
        belly = '#e8e6d0'
        markColor = '#4a5a3a'
        marks = @()
    }
}

# One entry per species. tags drive the homepage badge row.
$script:species = @(
    @{
        slug = 'rainbow-trout'; name = 'Rainbow Trout'; group = 'Salmon & Trout'
        tags = @('trout', 'stocked', 'beginner')
        art = 'rainbow'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Close_up_of_rainbow_trout_fish_underwater_oncorhynchus_mykiss.jpg/500px-Close_up_of_rainbow_trout_fish_underwater_oncorhynchus_mykiss.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Close_up_of_rainbow_trout_fish_underwater_oncorhynchus_mykiss.jpg'
        alt = 'Rainbow trout underwater showing its pink lateral stripe'
        blurb = 'The most widely stocked fish in Southern Oregon — a reliable target for beginners and a fun one for experienced anglers.'
        idMarks = @(
            'Pink to reddish stripe along the side — the signature mark',
            'Dark spots on the back, fins, and tail (never below the lateral line)',
            'Square tail with spots; no orange slash under the jaw'
        )
        waters = @(
            @('Lost Creek Reservoir', 'stocked regularly; bank and boat fishing'),
            @('Howard Prairie Reservoir', 'stocked rainbows; check levels in late summer'),
            @('Expo Pond', 'small, easy-access pond, heavily stocked'),
            @('Lake of the Woods', 'stocked rainbows in a mountain setting'),
            @('Rogue River (upper)', 'wild and stocked rainbows in moving water')
        )
        mapPins = @(
            @{ name = 'Lost Creek Reservoir'; lat = 42.735; lng = -122.545 },
            @{ name = 'Howard Prairie Reservoir'; lat = 42.083; lng = -122.336 },
            @{ name = 'Expo Pond'; lat = 42.335; lng = -122.873 },
            @{ name = 'Lake of the Woods'; lat = 42.096; lng = -122.113 },
            @{ name = 'Rogue River (upper)'; lat = 42.640; lng = -122.520 }
        )
        prey = @(
            @('Aquatic insects (mayfly and caddis nymphs)', 'Spring through fall, all day', 'Small spinners (Rooster Tail, Panther Martin), nymph flies'),
            @('Terrestrial insects (grasshoppers, ants)', 'Summer, on windy days', 'Small dry flies, hopper patterns'),
            @('Small fish and fry', 'Early morning, low light', 'Small spoons (Kastmaster), tiny crankbaits'),
            @('Eggs and pellet feed (hatchery fish)', 'Right after stocking', 'PowerBait, salmon eggs, dough baits')
        )
        activity = @(
            @('Spring', 'Morning and evening', 'Water is cool all day; insects hatch at dawn and dusk'),
            @('Summer', 'Early morning, before the sun is high', 'Warm afternoons push fish deep and shut down feeding'),
            @('Fall', 'Mid-morning through afternoon', 'Water cools; fish feed aggressively before winter'),
            @('Winter', 'Midday warm-up', 'Cold mornings are slow; fish wait for the sun')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Daily bag limit', '5 trout per day in most lakes and ponds'),
            @('Streams', 'Most open late May through October 31; check size and catch limits per stream'),
            @('Wild trout', 'Special rules apply in many waters — some require release')
        )
        stocking = 'ODFW stocks rainbow trout in Southern Oregon lakes and ponds throughout the year, with heavy plants in spring. Recently stocked fish bite readily on bait and small lures.'
        gear = @(
            'Light spinning rod, 6 to 6.5 feet',
            '4 to 8 lb monofilament line',
            'Assortment of small spinners and spoons',
            'Bait rig: small hooks, split shot, and a bobber'
        )
    },
    @{
        slug = 'steelhead'; name = 'Steelhead'; group = 'Salmon & Trout'
        tags = @('steelhead', 'river', 'advanced')
        art = 'steelhead'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Steelhead_trout_or_rainbow_trout_hanging_on_side_of_cabin.jpg/500px-Steelhead_trout_or_rainbow_trout_hanging_on_side_of_cabin.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Steelhead_trout_or_rainbow_trout_hanging_on_side_of_cabin.jpg'
        alt = 'Steelhead caught on the Rogue River'
        blurb = 'Rainbow trout that went to sea and came back big and hard-fighting. The Rogue River is one of Oregon''s classic steelhead fisheries, with both summer and winter runs.'
        idMarks = @(
            'Same species as rainbow trout, but bigger and more silvery from ocean life',
            'Square tail with spots; no orange jaw slash (that''s a cutthroat)',
            'Hatchery fish have a clipped adipose fin — the small fin on the back near the tail'
        )
        waters = @(
            @('Rogue River (upper)', 'summer-run steelhead, drift boat and bank water below Lost Creek Dam'),
            @('Rogue River (middle)', 'the famous Agness to Grants Pass stretch; summer and winter fish'),
            @('Applegate River', 'winter-run steelhead, hatchery fish available'),
            @('Illinois River', 'wild winter steelhead; catch and release focus'),
            @('Chetco, Elk, and Sixes rivers', 'winter runs on the south coast after rain')
        )
        mapPins = @(
            @{ name = 'Rogue River (upper)'; lat = 42.640; lng = -122.520 },
            @{ name = 'Rogue River (middle)'; lat = 42.660; lng = -123.670 },
            @{ name = 'Applegate River'; lat = 42.200; lng = -123.300 },
            @{ name = 'Illinois River'; lat = 42.250; lng = -123.700 },
            @{ name = 'Chetco River'; lat = 42.030; lng = -124.270 }
        )
        prey = @(
            @('Salmon eggs drifting', 'Fall through spring, below spawning salmon', 'Egg patterns, yarn balls, cured salmon roe'),
            @('Aquatic insects (juvenile food memory)', 'Clear, low water', 'Nymph flies, small jigs under a float'),
            @('Small fish', 'Early morning, low light', 'Spoons, small plugs (Mag Lip style)'),
            @('Reaction strike', 'Any condition — aggression, not hunger', 'Spinners, Corky-and-yarn rigs, swung flies')
        )
        activity = @(
            @('Summer run (entering May–September)', 'Early morning and evening', 'Fish hold in cool, fast water and move in low light'),
            @('Winter run (December–April)', 'During and just after a rain rise', 'New water moves fish upstream and triggers bites'),
            @('Cold snaps', 'Midday warm-up', 'Metabolism slows below about 40°F; fish sit deep'),
            @('Clear, low water', 'First and last light', 'Spooky fish feed when the light is dim')
        )
        regs = @(
            @('License + Combined Angling Tag', 'Steelhead and salmon harvest requires the annual Combined Angling Tag in addition to a fishing license'),
            @('Hatchery vs. wild', 'Hatchery steelhead have a clipped adipose fin; wild fish must often be released unharmed'),
            @('Daily limit', 'Typically 2 adult salmon or steelhead per day in combination — check the water you fish'),
            @('In-season updates', 'Run sizes can trigger mid-season changes; check ODFW before every trip')
        )
        stocking = 'Cole Rivers Hatchery on the upper Rogue raises summer steelhead that are released as smolts and return as adults. Winter programs support the Applegate and south coast rivers.'
        gear = @(
            'Medium-heavy spinning rod, 8.5 to 9.5 feet for drift fishing',
            '10 to 15 lb mainline with lighter leader',
            'Drift rig: Corky and yarn, or roe, with split shot',
            'Float setup: jig or egg pattern 3 to 5 feet down',
            'Waders — steelhead water is cold year-round'
        )
    },
    @{
        slug = 'coastal-cutthroat-trout'; name = 'Cutthroat Trout'; group = 'Salmon & Trout'
        tags = @('trout', 'native', 'stream')
        art = 'cutthroat'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Coastal_cutthroat_trout_Puget_Sound.jpg/500px-Coastal_cutthroat_trout_Puget_Sound.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Coastal_cutthroat_trout_Puget_Sound.jpg'
        alt = 'Coastal cutthroat trout with its orange throat slash'
        blurb = 'The native trout of coastal streams, named for the orange-red slash under its jaw. Aggressive, willing to hit almost anything, and happy in tiny water.'
        idMarks = @(
            'Orange-red slash under the jaw — the namesake mark',
            'Spots scattered over the whole body, including below the lateral line (rainbows don''t)',
            'Longer head and jaw than a rainbow; often greenish-bronze sides'
        )
        waters = @(
            @('Rogue River tributaries', 'resident cutthroat in small creeks and pools'),
            @('Applegate and Illinois rivers', 'wild cutthroat in the upper reaches'),
            @('Chetco, Elk, and Sixes rivers', 'sea-run cutthroat in tidal and lower reaches'),
            @('High mountain lakes', 'some stocked with cutthroat')
        )
        mapPins = @(
            @{ name = 'Rogue River tributaries'; lat = 42.700; lng = -123.100 },
            @{ name = 'Applegate River'; lat = 42.200; lng = -123.300 },
            @{ name = 'Illinois River'; lat = 42.250; lng = -123.700 },
            @{ name = 'Chetco River'; lat = 42.030; lng = -124.270 }
        )
        prey = @(
            @('Aquatic insects', 'All year in streams', 'Small spinners, nymph flies'),
            @('Terrestrial insects (ants, hoppers)', 'Summer, near overhanging brush', 'Dry flies, small hoppers'),
            @('Small fish', 'Sea-run fish in estuaries', 'Small streamers, spoons'),
            @('Eggs (when salmon spawn)', 'Fall, below spawning salmon', 'Egg patterns, small roe beads')
        )
        activity = @(
            @('Spring', 'Afternoon warm-ups', 'Cold water warms through the day and turns fish on'),
            @('Summer', 'Morning and evening', 'Low flows make fish wary; they feed in dim light'),
            @('Fall', 'Midday', 'Sea-run fish return to streams with the first rains'),
            @('Winter', 'Midday, slow water', 'Resident fish feed on warm afternoons in small streams')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Wild fish', 'Many cutthroat streams have special size or catch-and-release rules'),
            @('Sea-run seasons', 'Some coastal waters close in winter — check the water you fish')
        )
        stocking = 'Most cutthroat fisheries are wild fish. A few lakes and ponds receive stocked cutthroat.'
        gear = @(
            'Ultralight spinning rod, 5.5 to 6.5 feet',
            '2 to 6 lb line',
            'Small spinners (size 0 to 2)',
            'Fly rod, 3 to 5 weight, with a dry-dropper rig'
        )
    },
    @{
        slug = 'kokanee'; name = 'Kokanee Salmon'; group = 'Salmon & Trout'
        tags = @('salmon', 'lake', 'trolling')
        art = 'kokanee'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Kokanee_salmon.jpg/500px-Kokanee_salmon.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Kokanee_salmon.jpg'
        alt = 'Kokanee salmon in spawning coloration'
        blurb = 'Landlocked sockeye salmon that spend their whole life in fresh water. They school deep in cold lakes, fight far above their weight, and turn brilliant red when spawning.'
        idMarks = @(
            'Small, silvery, and deep-bodied — a sockeye without the ocean trip',
            'Fine speckles on the back and tail; no big black spots like a rainbow',
            'Spawning males turn brilliant red with a green head and a hooked jaw'
        )
        waters = @(
            @('Applegate Reservoir', 'the closest kokanee fishery to the Rogue Valley'),
            @('Odell Lake', 'a classic Oregon kokanee lake east of the Cascades'),
            @('Crescent Lake', 'kokanee plus lake trout'),
            @('Wallowa Lake', 'Oregon''s most famous kokanee water, worth the drive')
        )
        mapPins = @(
            @{ name = 'Applegate Reservoir'; lat = 42.100; lng = -123.350 },
            @{ name = 'Odell Lake'; lat = 43.590; lng = -121.990 },
            @{ name = 'Crescent Lake'; lat = 43.470; lng = -121.910 },
            @{ name = 'Wallowa Lake'; lat = 45.250; lng = -117.220 }
        )
        prey = @(
            @('Zooplankton (they filter-feed)', 'All year — they don''t chase big prey', 'Tiny lures: wedding rings, small spoons behind a dodger'),
            @('Insects near the surface', 'Early morning', 'Small flies and micro jigs'),
            @('Scent and corn', 'Trolling and jigging', 'White corn tipped on small hooks is the classic')
        )
        activity = @(
            @('Spring', 'Mid-morning', 'Fish rise toward warmer surface layers'),
            @('Summer', 'First light, trolling deep', 'Kokanee sit in the cold layer 30 to 60 feet down'),
            @('Fall (spawning run)', 'Tributary mouths', 'Fish turn red and stage at inlets; many waters close to protect spawners'),
            @('Winter', 'Midday, deep', 'Schools hold deep; slow trolling or jigging')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Daily limit', 'Varies widely by water — some allow large limits, others restrict spawning season'),
            @('Gear rules', 'Some kokanee waters restrict bait or multiple hooks')
        )
        stocking = 'ODFW stocks kokanee in some reservoirs and lakes; Applegate Reservoir receives periodic plants.'
        gear = @(
            'Downrigger or leaded line for summer depth',
            'Small spoons and wedding-ring lures, size 6 to 10 hooks',
            'Dodger or small flasher ahead of the lure',
            'Light rod with a soft tip — kokanee tear off easily'
        )
    },
    @{
        slug = 'chinook-salmon'; name = 'Chinook Salmon'; group = 'Salmon & Trout'
        tags = @('salmon', 'river', 'advanced')
        art = 'chinook'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Chinook_Salmon_Adult_Male.jpg/500px-Chinook_Salmon_Adult_Male.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Chinook_Salmon_Adult_Male.jpg'
        alt = 'Adult male chinook salmon in spawning color'
        blurb = 'Oregon''s biggest salmon — the king. The Rogue River''s fall and spring chinook runs are legendary, and a fresh one is the fight of a lifetime.'
        idMarks = @(
            'Black gums at the base of the teeth — the surest chinook ID mark',
            'Spots on the back AND both lobes of the tail',
            'Much larger than coho; spawning males develop a hooked jaw and dark red body'
        )
        waters = @(
            @('Rogue River (lower)', 'fall run enters July through September; the bay and lower river fish first'),
            @('Rogue River (middle and upper)', 'fall run peaks September–October; spring run May–July'),
            @('Applegate River', 'fall chinook spawning tributary'),
            @('Chetco, Elk, and Sixes rivers', 'south coast fall runs, best after rain')
        )
        mapPins = @(
            @{ name = 'Rogue River (lower)'; lat = 42.430; lng = -124.420 },
            @{ name = 'Rogue River (middle)'; lat = 42.660; lng = -123.670 },
            @{ name = 'Applegate River'; lat = 42.200; lng = -123.300 },
            @{ name = 'Chetco River'; lat = 42.030; lng = -124.270 }
        )
        prey = @(
            @('Baitfish (anchovies, herring)', 'Ocean and estuary phase', 'Anchovy baits, herring, plug-cut herring'),
            @('Salmon eggs', 'River phase', 'Cured roe, egg patterns, artificial eggs'),
            @('Reaction to lures', 'All phases', 'Kwikfish-style plugs, spinners, bobber-dogging bait')
        )
        activity = @(
            @('Fall run (Sept–Nov)', 'Early morning', 'Fish move on the tide and at first light'),
            @('After freshets', 'During rising water', 'New water moves fish upstream and triggers bites'),
            @('Spring run (May–July)', 'Early morning, deep holes', 'Springers hold in cold pools and bite best at dawn')
        )
        regs = @(
            @('License + Combined Angling Tag', 'Salmon harvest requires the annual Combined Angling Tag'),
            @('Seasons and quotas', 'Set annually and can change in-season with run size — check before every trip'),
            @('Wild fish', 'Many waters require releasing unclipped (wild) chinook'),
            @('Gear rules', 'Barbless hooks required on many salmon waters')
        )
        stocking = 'Cole Rivers Hatchery on the upper Rogue and coastal hatcheries raise chinook for the Rogue basin''s runs.'
        gear = @(
            'Heavy rod, 8.5 to 10 feet',
            '20 to 30 lb line',
            'Roe setup: cured eggs, bobber or drift rig',
            'Plug setup: Kwikfish or Mag Lip style lure'
        )
    },
    @{
        slug = 'coho-salmon'; name = 'Coho Salmon'; group = 'Salmon & Trout'
        tags = @('salmon', 'river', 'fall')
        art = 'coho'
        img = 'https://upload.wikimedia.org/wikipedia/commons/4/43/Coho_salmon_%28Oncorhynchus-kisutch%29_Pt._Reyes_NPS.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Coho_salmon_(Oncorhynchus-kisutch)_Pt._Reyes_NPS.jpg'
        alt = 'Adult coho salmon spawning in a shallow stream'
        blurb = 'The silver bullet — acrobatic, aggressive, and quick to chase a bright lure. Hatchery coho runs give Southern Oregon anglers a reliable fall fishery.'
        idMarks = @(
            'White gums at the base of the teeth (chinook have black gums)',
            'Spots on the upper tail lobe only',
            'Sleeker and smaller than chinook; spawning males get a hooked jaw and red sides'
        )
        waters = @(
            @('Rogue River', 'hatchery coho return September–November'),
            @('Chetco River', 'fall coho after the first big rains'),
            @('Coos and Coquille systems', 'strong hatchery coho fisheries on the south coast')
        )
        mapPins = @(
            @{ name = 'Rogue River'; lat = 42.430; lng = -124.420 },
            @{ name = 'Chetco River'; lat = 42.030; lng = -124.270 },
            @{ name = 'Coos River'; lat = 43.370; lng = -124.220 }
        )
        prey = @(
            @('Baitfish', 'Ocean and estuary phase', 'Small spoons and spinners'),
            @('Reaction to bright lures', 'Fresh river fish strike aggressively', 'Casting spinners and spoons (silver, chartreuse, pink)'),
            @('Eggs', 'Later in the run', 'Egg patterns, cured roe under a bobber')
        )
        activity = @(
            @('Early run (Sept–Oct)', 'Early morning', 'Fresh fish are the most aggressive biters'),
            @('After rain', 'Rising water', 'New water pulls fish in from the estuary'),
            @('Late run (Nov)', 'Midday', 'Fish hold in pools; slow presentations work')
        )
        regs = @(
            @('License + Combined Angling Tag', 'Salmon harvest requires the annual Combined Angling Tag'),
            @('Hatchery only', 'Most coho waters require releasing wild fish — look for the clipped adipose fin'),
            @('In-season changes', 'Run size can close fisheries mid-season; check ODFW updates')
        )
        stocking = 'Cole Rivers Hatchery raises coho for the Rogue; coastal hatcheries support south coast runs.'
        gear = @(
            'Medium-heavy spinning rod, 8.5 to 9 feet',
            '15 to 20 lb line',
            'Casting spinners and spoons',
            'Bobber and jig setup for holding fish'
        )
    },
    @{
        slug = 'mountain-whitefish'; name = 'Mountain Whitefish'; group = 'Salmon & Trout'
        tags = @('native', 'winter', 'river')
        art = 'whitefish'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Prosopium_williamsoni.jpg/500px-Prosopium_williamsoni.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Prosopium_williamsoni.jpg'
        alt = 'Mountain whitefish, a slender silvery salmonid'
        blurb = 'The Rogue''s most overlooked native salmonid. Silvery, slender, and willing to bite all winter — when almost nothing else will.'
        idMarks = @(
            'Slender, silvery body with a small, downward-facing mouth',
            'Larger scales than any trout — easy to see at a glance',
            'One dorsal fin set far back; no spots or stripes'
        )
        waters = @(
            @('Rogue River (mainstem)', 'year-round resident in riffles and deep runs'),
            @('Applegate River', 'whitefish in the same water as trout')
        )
        mapPins = @(
            @{ name = 'Rogue River (mainstem)'; lat = 42.440; lng = -123.320 },
            @{ name = 'Applegate River'; lat = 42.200; lng = -123.300 }
        )
        prey = @(
            @('Aquatic insect nymphs and larvae', 'All year — their main food', 'Nymph flies, small jigs, worms'),
            @('Eggs (when salmon spawn)', 'Fall', 'Egg patterns and small roe beads'),
            @('Tiny mollusks and larvae', 'Winter', 'Small bait on the bottom')
        )
        activity = @(
            @('Winter', 'Midday', 'The best whitefish season — they feed when trout slow down'),
            @('Summer', 'Morning and evening', 'Fish deep runs during the day'),
            @('Cold snaps', 'Midday warm-up', 'Still willing to bite in water too cold for trout')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'Whitefish rules are often more generous than trout rules — check the regulations')
        )
        stocking = 'Wild only — whitefish are not stocked.'
        gear = @(
            'Light spinning rod or 4 weight fly rod',
            'Nymphing rig: small jig or nymph under an indicator',
            '2 to 6 lb line'
        )
    },
    @{
        slug = 'brook-trout'; name = 'Brook Trout'; group = 'Char'
        tags = @('char', 'high-lakes', 'beginner')
        art = 'brook'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Brook_trout_in_water.jpg/500px-Brook_trout_in_water.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Brook_trout_in_water.jpg'
        alt = 'Brook trout with marbled back and white-edged fins'
        blurb = 'A char, not a trout — look for the white leading edge on the fins and the worm-track marbling on the back. Beautiful, aggressive, and perfect for high mountain lakes.'
        idMarks = @(
            'White leading edge on the lower fins with a dark stripe behind it — the giveaway',
            'Worm-track (vermiculation) marbling on the dark olive back',
            'Pale yellow spots on the body plus red spots with blue halos on the sides'
        )
        waters = @(
            @('High Cascade lakes', 'Sky Lakes Wilderness lakes hold brook trout'),
            @('Small mountain streams', 'some headwater streams have self-sustaining fish')
        )
        mapPins = @(
            @{ name = 'Sky Lakes Wilderness'; lat = 43.150; lng = -122.050 },
            @{ name = 'High Cascade lakes'; lat = 42.900; lng = -122.200 }
        )
        prey = @(
            @('Aquatic and terrestrial insects', 'All day in cold water', 'Small spinners, dry flies, worms'),
            @('Small fish', 'Larger brook trout', 'Small spoons and streamers'),
            @('Zooplankton', 'High lakes', 'Tiny flies and micro jigs')
        )
        activity = @(
            @('Summer', 'Mid-morning to afternoon', 'High lakes warm just enough to trigger feeding'),
            @('Fall', 'Midday', 'Fish feed heavily before winter; colors are at their best'),
            @('Spring', 'Midday', 'Ice-out fishing can be excellent in high lakes')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'Often generous — brook trout can overpopulate small water, and ODFW encourages harvest in some lakes')
        )
        stocking = 'Some high lakes are stocked by air or on foot; many populations are self-sustaining.'
        gear = @(
            'Ultralight spinning rod or 2 to 3 weight fly rod',
            'Small spinners and flies',
            'Worms for bait waters'
        )
    },
    @{
        slug = 'bull-trout'; name = 'Bull Trout'; group = 'Char'
        tags = @('char', 'protected', 'native')
        art = 'bull'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Bull_trout_fish_salvelinus_confluentus.jpg/500px-Bull_trout_fish_salvelinus_confluentus.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Bull_trout_fish_salvelinus_confluentus.jpg'
        alt = 'Bull trout, a large char with pale spots'
        blurb = 'Oregon''s largest native char — and a threatened species. There is no bull trout fishery in Oregon: if you catch one, it must be released immediately, unharmed.'
        idMarks = @(
            'Large char with pale yellow-orange spots on an olive-green body',
            'NO black spots on the dorsal fin (brook trout have them)',
            'White leading edge on the fins, like a brook trout, but much larger and plainer'
        )
        waters = @(
            @('Klamath basin tributaries', 'small reintroduced populations in cold headwater streams'),
            @('Upper Rogue tributaries', 'rare; know how to identify one before fishing trout water')
        )
        mapPins = @(
            @{ name = 'Klamath basin tributaries'; lat = 42.500; lng = -122.300 },
            @{ name = 'Upper Rogue tributaries'; lat = 42.900; lng = -122.400 }
        )
        prey = @(
            @('Fish', 'Their main food — they are predators', 'Streamer flies and large lures (but targeting them is not the goal)'),
            @('Insects and larvae', 'Juveniles in small streams', 'Small nymphs (incidental catch while trout fishing)')
        )
        activity = @(
            @('All year', 'Cold headwater streams', 'They need the coldest, cleanest water in the basin'),
            @('Summer', 'Deep cold pools', 'Adults hold in the coldest water available')
        )
        regs = @(
            @('Threatened species', 'It is illegal to harvest or intentionally target bull trout in Oregon'),
            @('If caught', 'Release immediately with minimal handling; keep the fish in the water'),
            @('Report sightings', 'ODFW asks anglers to report bull trout catches — it helps recovery')
        )
        stocking = 'ODFW runs reintroduction programs, notably in the Klamath basin. Populations are closely monitored.'
        gear = @(
            'Know the identification: large char, pale yellow-orange spots, no black spots on the back fin',
            'Barbless hooks help with safe release'
        )
    },
    @{
        slug = 'lake-trout'; name = 'Lake Trout (Mackinaw)'; group = 'Char'
        tags = @('char', 'deep-water', 'trolling')
        art = 'laker'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Lake_trout_fishes_salvelinus_namaycush.jpg/500px-Lake_trout_fishes_salvelinus_namaycush.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Lake_trout_fishes_salvelinus_namaycush.jpg'
        alt = 'Lake trout, a deep-water char with light spots'
        blurb = 'The deep-water giant of big cold lakes. Mackinaw live deeper than almost any other game fish and can top 20 pounds in Oregon''s best waters.'
        idMarks = @(
            'Deep-bodied char with light (never red) spots on a gray-green body',
            'Deeply forked tail — trout have square tails',
            'No worm-track marbling (that''s a brook trout)'
        )
        waters = @(
            @('Odell Lake', 'Oregon''s classic mackinaw lake, east of the Cascades'),
            @('Crescent Lake', 'lake trout plus kokanee in the same water'),
            @('Wallowa Lake', 'deep, cold, and famous for big lakers')
        )
        mapPins = @(
            @{ name = 'Odell Lake'; lat = 43.590; lng = -121.990 },
            @{ name = 'Crescent Lake'; lat = 43.470; lng = -121.910 },
            @{ name = 'Wallowa Lake'; lat = 45.250; lng = -117.220 }
        )
        prey = @(
            @('Kokanee and small fish', 'Their main food', 'Trolled spoons and plugs that imitate kokanee'),
            @('Bottom prey', 'Jigging', 'Heavy jigs and jigging spoons'),
            @('Insects', 'Juveniles', 'Small lures near drop-offs')
        )
        activity = @(
            @('Summer', 'Early morning, trolling deep', 'Fish sit 40 to 80 feet down in the cold layer'),
            @('Spring and fall', 'Shallower, all day', 'Cool water brings them up within reach of normal gear'),
            @('Winter', 'Midday', 'Slow presentations in deep water')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'Check per-water rules — some lakes have liberal limits to protect other species')
        )
        stocking = 'Self-sustaining in Oregon''s lake trout waters.'
        gear = @(
            'Downriggers or heavy trolling weights',
            'Medium-heavy trolling rod, 15 to 25 lb line',
            'Large spoons and plugs',
            'Jigging spoons for vertical fishing'
        )
    },
    @{
        slug = 'largemouth-bass'; name = 'Largemouth Bass'; group = 'Sunfish & Bass'
        tags = @('bass', 'warmwater', 'beginner')
        art = 'largemouth'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Largemouth_Bass_%28Micropterus_salmoides%29_June_2023_%28cropped%29.jpg/500px-Largemouth_Bass_%28Micropterus_salmoides%29_June_2023_%28cropped%29.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Largemouth_Bass_(Micropterus_salmoides)_June_2023_(cropped).jpg'
        alt = 'Largemouth bass with its big mouth and dark lateral stripe'
        blurb = 'The ambush predator of warm, weedy water — and Southern Oregon''s most popular warmwater game fish. Big ones eat anything that fits in that famous mouth.'
        idMarks = @(
            'Upper jaw extends past the back of the eye — "largemouth"',
            'One solid dark stripe down the side (smallmouth have vertical bars)',
            'Spiny first dorsal fin with a deep notch separating it from the soft part'
        )
        waters = @(
            @('Lake Selmac', 'the Rogue Valley''s best-known largemouth lake'),
            @('Emigrant Reservoir', 'good numbers and easy access'),
            @('Agate Lake', 'shallow, warm, and weedy — classic largemouth water'),
            @('Hyatt and Howard Prairie reservoirs', 'bass plus trout in the same water'),
            @('Expo Pond and farm ponds', 'great places to learn')
        )
        mapPins = @(
            @{ name = 'Lake Selmac'; lat = 42.180; lng = -123.680 },
            @{ name = 'Emigrant Reservoir'; lat = 42.180; lng = -122.660 },
            @{ name = 'Agate Lake'; lat = 42.440; lng = -122.830 },
            @{ name = 'Howard Prairie Reservoir'; lat = 42.083; lng = -122.336 },
            @{ name = 'Expo Pond'; lat = 42.335; lng = -122.873 }
        )
        prey = @(
            @('Bluegill and perch fry', 'All year', 'Soft plastic swimbaits, spinnerbaits, crankbaits'),
            @('Crawfish', 'Spring and fall', 'Jigs, creature baits, crawfish-colored crankbaits'),
            @('Frogs and topwater prey', 'Summer mornings', 'Hollow-body frogs, topwater lures'),
            @('Worms and plastics', 'Any condition — the reliable fallback', 'Texas-rigged worms, senko-style baits')
        )
        activity = @(
            @('Spring (spawn)', 'Shallow, all day', 'Fish move to beds in warm shallow water — sight-fishing season'),
            @('Summer', 'Early morning and evening', 'Topwater bites at first light; fish go deep midday'),
            @('Fall', 'All day', 'Feeding binge before winter; follow the bait'),
            @('Winter', 'Midday, slow and deep', 'Fish hold deep; slow presentations only')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Daily limit', 'Typically 5 bass per day in most waters — check the water you fish'),
            @('Size rules', 'Some waters have slot or minimum size limits')
        )
        stocking = 'Self-sustaining in Southern Oregon''s warm waters.'
        gear = @(
            'Medium-heavy rod, baitcaster or spinning',
            '12 to 17 lb line',
            'Plastics kit: worms, creature baits, senko-style baits',
            'Spinnerbaits and a topwater frog'
        )
    },
    @{
        slug = 'smallmouth-bass'; name = 'Smallmouth Bass'; group = 'Sunfish & Bass'
        tags = @('bass', 'river', 'summer')
        art = 'smallmouth'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Smallmouth_Bass_%2849561724026%29.jpg/500px-Smallmouth_Bass_%2849561724026%29.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Smallmouth_Bass_(49561724026).jpg'
        alt = 'Smallmouth bass with bronze flanks and dark bars'
        blurb = 'The bronze bomber of moving water. The Rogue River''s smallmouth fishery is one of the best in the Northwest — hundreds of fish a day is realistic in summer.'
        idMarks = @(
            'Upper jaw does NOT reach past the eye — "smallmouth"',
            'Vertical dark bars on bronze-brown flanks (largemouth have one solid stripe)',
            'Reddish-brown eyes; body built for current'
        )
        waters = @(
            @('Rogue River (mainstem)', 'world-class smallmouth from Grants Pass down; float and wade water everywhere'),
            @('Umpqua River', 'Oregon''s famous smallmouth river, just north'),
            @('Applegate River (lower)', 'small numbers of smallmouth')
        )
        mapPins = @(
            @{ name = 'Rogue River (mainstem)'; lat = 42.440; lng = -123.320 },
            @{ name = 'Umpqua River'; lat = 43.290; lng = -123.690 },
            @{ name = 'Applegate River'; lat = 42.200; lng = -123.300 }
        )
        prey = @(
            @('Crawfish — their staple', 'All year', 'Crawfish-colored crankbaits, tube jigs, grubs'),
            @('Baitfish and fry', 'Summer', 'Small swimbaits, spinners, topwater walkers'),
            @('Aquatic insects', 'Early season', 'Small jigs and flies')
        )
        activity = @(
            @('Summer (June–Sept)', 'Morning and evening', 'Topwater bite at first light; the most consistent season'),
            @('Spring', 'Midday warm-ups', 'Fish move shallow as water passes 55°F'),
            @('Fall', 'Afternoon', 'Aggressive feeding before winter')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Daily limit', 'Typically 5 bass per day in most waters — check the water you fish'),
            @('Rogue special rules', 'Some Rogue sections encourage smallmouth harvest to protect salmon and steelhead — check current regs')
        )
        stocking = 'Self-sustaining — the Rogue''s population needs no help.'
        gear = @(
            'Medium spinning rod, 6 to 10 lb line',
            'Small crankbaits and tube jigs',
            'Topwater lures for summer mornings',
            'Fly rod, 5 to 7 weight, with crawfish patterns'
        )
    },
    @{
        slug = 'bluegill'; name = 'Bluegill'; group = 'Sunfish & Bass'
        tags = @('panfish', 'beginner', 'kids')
        art = 'bluegill'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Bluegill_%28cropped%29.jpg/500px-Bluegill_%28cropped%29.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Bluegill_(cropped).jpg'
        alt = 'Bluegill with its blue gill flap and dark ear spot'
        blurb = 'The perfect first fish: scrappy, plentiful, easy to catch, and hard to spook. If you''re teaching someone to fish, start here.'
        idMarks = @(
            'Small black ear flap (opercular flap) with a blue edge — the namesake mark',
            'Deep, round body with a yellow-orange belly',
            'Dark vertical bars on the sides; small mouth'
        )
        waters = @(
            @('Expo Pond', 'easy access, hungry fish'),
            @('Emigrant and Agate reservoirs', 'bluegill around weed beds and docks'),
            @('Lake Selmac', 'bluegill plus bass in the same water'),
            @('Farm ponds', 'ask permission — often the best bluegill water anywhere')
        )
        mapPins = @(
            @{ name = 'Expo Pond'; lat = 42.335; lng = -122.873 },
            @{ name = 'Emigrant Reservoir'; lat = 42.180; lng = -122.660 },
            @{ name = 'Agate Lake'; lat = 42.440; lng = -122.830 },
            @{ name = 'Lake Selmac'; lat = 42.180; lng = -123.680 }
        )
        prey = @(
            @('Insects and larvae', 'All year', 'Worms under a bobber, small jigs'),
            @('Small invertebrates', 'Summer', 'Tiny jigs, flies, and poppers'),
            @('Zooplankton', 'Open water schools', 'Tiny flies tipped with bait')
        )
        activity = @(
            @('Late spring (spawn)', 'Shallow beds, all day', 'Fish guard nests in the shallows and bite anything'),
            @('Summer', 'Morning and evening', 'Move to shade and deeper edges midday'),
            @('Fall', 'Midday', 'Last feeding before winter; schools bunch up')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'Generous bag limits on panfish — check current regs')
        )
        stocking = 'Self-sustaining in most warm waters.'
        gear = @(
            'Ultralight spinning rod',
            'Small hooks (size 8 to 12), split shot, bobber',
            'Live worms — the classic and still the best'
        )
    },
    @{
        slug = 'black-crappie'; name = 'Black Crappie'; group = 'Sunfish & Bass'
        tags = @('panfish', 'schools', 'eating')
        art = 'crappie'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Black_crappie.jpg/500px-Black_crappie.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Black_crappie.jpg'
        alt = 'Black crappie with speckled pattern'
        blurb = 'Speckled panfish that school in deeper water and eat tiny jigs like candy. One of the best-eating fish in the state.'
        idMarks = @(
            'Random speckled pattern (white crappie have neat vertical bars)',
            '7 to 8 spines in the front dorsal fin (white crappie have 5 to 6)',
            'Deep, paper-thin body with an upturned mouth'
        )
        waters = @(
            @('Emigrant Reservoir', 'crappie school around structure'),
            @('Agate Lake', 'good spring fishing'),
            @('Lake Selmac', 'crappie plus bass and bluegill')
        )
        mapPins = @(
            @{ name = 'Emigrant Reservoir'; lat = 42.180; lng = -122.660 },
            @{ name = 'Agate Lake'; lat = 42.440; lng = -122.830 },
            @{ name = 'Lake Selmac'; lat = 42.180; lng = -123.680 }
        )
        prey = @(
            @('Small fish and fry', 'All year', 'Small jigs (1/32 to 1/16 oz), minnows under a bobber'),
            @('Insects and larvae', 'Summer', 'Tiny jigs and micro spinners'),
            @('Zooplankton', 'Open water', 'Micro jigs trolled slowly')
        )
        activity = @(
            @('Spring (spawn)', 'Shallow, all day', 'The best crappie fishing of the year — fish move to shallow brush'),
            @('Summer', 'Evening and night', 'Schools hold deep by day; lights draw them up at night'),
            @('Winter', 'Midday, deep', 'Slow-jig deep schools')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'Generous bag limits on panfish — check current regs')
        )
        stocking = 'Self-sustaining.'
        gear = @(
            'Ultralight or light spinning rod',
            'Small jigs with soft plastic bodies',
            'Minnows under a bobber'
        )
    },
    @{
        slug = 'white-crappie'; name = 'White Crappie'; group = 'Sunfish & Bass'
        tags = @('panfish', 'schools', 'eating')
        art = 'crappie'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/White_Crappie.jpg/500px-White_Crappie.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:White_Crappie.jpg'
        alt = 'White crappie with vertical bar pattern'
        blurb = 'The black crappie''s paler cousin — look for vertical bars instead of scattered speckles, and count the dorsal spines if you want to be sure.'
        idMarks = @(
            'Neat vertical bars (black crappie have scattered speckles)',
            '5 to 6 spines in the front dorsal fin (black crappie have 7 to 8)',
            'Paler, more silvery overall'
        )
        waters = @(
            @('Emigrant and Agate reservoirs', 'less common than black crappie locally'),
            @('Murky backwaters and sloughs', 'white crappie tolerate turbid water better')
        )
        mapPins = @(
            @{ name = 'Emigrant Reservoir'; lat = 42.180; lng = -122.660 },
            @{ name = 'Agate Lake'; lat = 42.440; lng = -122.830 }
        )
        prey = @(
            @('Small fish', 'All year', 'Small jigs and minnows'),
            @('Insects', 'Summer', 'Tiny jigs and spinners'),
            @('Zooplankton', 'Open water', 'Micro jigs')
        )
        activity = @(
            @('Spring (spawn)', 'Shallow, all day', 'Same pattern as black crappie'),
            @('Summer', 'Evening', 'Schools hold over deeper structure'),
            @('Winter', 'Midday, deep', 'Slow presentations over structure')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'Generous bag limits on panfish — check current regs')
        )
        stocking = 'Self-sustaining.'
        gear = @(
            'Ultralight spinning rod',
            'Small jigs and minnows'
        )
    },
    @{
        slug = 'yellow-perch'; name = 'Yellow Perch'; group = 'Sunfish & Bass'
        tags = @('panfish', 'schools', 'eating')
        art = 'perch'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Yellow_Perch_%28Perca_flavescens%29_%28cropped%29.jpg/500px-Yellow_Perch_%28Perca_flavescens%29_%28cropped%29.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Yellow_Perch_(Perca_flavescens)_(cropped).jpg'
        alt = 'Yellow perch with green-gold stripes and orange fins'
        blurb = 'Striped, golden, and delicious — perch school tightly, so where you catch one, you''ll catch twenty. Arguably the best-eating fish in fresh water.'
        idMarks = @(
            '6 to 8 dark vertical bars on a golden-green body',
            'Bright orange lower fins — unmistakable',
            'Two dorsal fins: spiny front, soft back'
        )
        waters = @(
            @('Emigrant Reservoir', 'perch schools around structure'),
            @('Agate Lake', 'good numbers'),
            @('Lake of the Woods', 'perch plus trout in a mountain setting')
        )
        mapPins = @(
            @{ name = 'Emigrant Reservoir'; lat = 42.180; lng = -122.660 },
            @{ name = 'Agate Lake'; lat = 42.440; lng = -122.830 },
            @{ name = 'Lake of the Woods'; lat = 42.096; lng = -122.113 }
        )
        prey = @(
            @('Insects, larvae, and snails', 'All year', 'Worms, small jigs, maggots'),
            @('Small fish', 'Larger perch', 'Small minnows and jig-and-minnow combos'),
            @('Zooplankton', 'Juveniles', 'Tiny jigs and flies')
        )
        activity = @(
            @('Spring (spawn)', 'Shallow, all day', 'Fish move shallow to spawn; easy limits'),
            @('Summer', 'Morning', 'Schools hold on drop-offs; find one school and stay on it'),
            @('Winter', 'Midday, deep', 'Perch bite well in cold water — schools sit deep')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'Generous — typically 25 per day in many waters; check current regs')
        )
        stocking = 'Self-sustaining.'
        gear = @(
            'Ultralight spinning rod',
            'Small hooks and jigs',
            'Worms and maggots',
            'A bucket — you''ll likely fill it'
        )
    },
    @{
        slug = 'channel-catfish'; name = 'Channel Catfish'; group = 'Catfish, Carp & Minnows'
        tags = @('catfish', 'night', 'eating')
        art = 'catfish'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Channel_Catfish_%28Ictalurus_punctatus%29_white_background.jpg/500px-Channel_Catfish_%28Ictalurus_punctatus%29_white_background.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Channel_Catfish_(Ictalurus_punctatus)_white_background.jpg'
        alt = 'Channel catfish with forked tail and barbels'
        blurb = 'Whiskered, hard-fighting, and best after dark. Catfish fishing is simple: put smelly bait on the bottom and wait for the rod to load up.'
        idMarks = @(
            'Deeply forked tail (bullheads have a square tail)',
            'Eight long barbels ("whiskers") around the mouth',
            'Smooth, scaleless gray-blue skin with scattered dark spots when young'
        )
        waters = @(
            @('Emigrant Reservoir', 'catfish plus bass and perch'),
            @('Agate Lake', 'warm shallow water cats like'),
            @('Stocked valley ponds', 'ODFW stocks channel catfish in some waters')
        )
        mapPins = @(
            @{ name = 'Emigrant Reservoir'; lat = 42.180; lng = -122.660 },
            @{ name = 'Agate Lake'; lat = 42.440; lng = -122.830 }
        )
        prey = @(
            @('Dead and dying prey on the bottom', 'Night is prime', 'Chicken liver, cut bait, stinkbait, shrimp'),
            @('Live prey', 'Dusk and dawn', 'Nightcrawlers, live minnows'),
            @('Crawfish', 'Warm months', 'Crawfish-flavored dip baits')
        )
        activity = @(
            @('Summer', 'Night', 'The classic catfish pattern — fish feed hardest after dark'),
            @('Spring', 'Evening', 'Fish move shallow as water warms'),
            @('Winter', 'Slow, midday', 'Deep holes, patient presentations')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'Generous bag limits — check current regs')
        )
        stocking = 'ODFW stocks channel catfish in some valley waters.'
        gear = @(
            'Medium-heavy rod, 12 to 20 lb line',
            'Slip-sinker bottom rig with bait-holder hooks',
            'Headlamp — you''ll be fishing in the dark'
        )
    },
    @{
        slug = 'brown-bullhead'; name = 'Brown Bullhead'; group = 'Catfish, Carp & Minnows'
        tags = @('catfish', 'night', 'kids')
        art = 'bullhead'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Ameiurus_nebulosus.jpg/500px-Ameiurus_nebulosus.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Ameiurus_nebulosus.jpg'
        alt = 'Brown bullhead, a small whiskered catfish'
        blurb = 'The smaller, everywhere cousin of the catfish. Not glamorous, but always willing to bite — and a reliable fish for kids on a summer evening.'
        idMarks = @(
            'Square (rounded) tail — channel catfish have a forked tail',
            'Barbels around the mouth, shorter than a channel cat''s',
            'Small, chunky body, usually under 2 pounds'
        )
        waters = @(
            @('Expo Pond', 'bullheads bite all summer'),
            @('Emigrant Reservoir', 'around shallow muddy bottoms'),
            @('Ponds and sloughs everywhere', 'if there''s warm still water, there are bullheads')
        )
        mapPins = @(
            @{ name = 'Expo Pond'; lat = 42.335; lng = -122.873 },
            @{ name = 'Emigrant Reservoir'; lat = 42.180; lng = -122.660 }
        )
        prey = @(
            @('Anything smelly on the bottom', 'Dusk and night', 'Worms, stinkbait, dough bait, cut fish'),
            @('Insects and larvae', 'Warm months', 'Worms under a bobber')
        )
        activity = @(
            @('Spring and summer', 'Dusk and night', 'Bottom feeding peaks in the dark'),
            @('Winter', 'Slow, midday', 'Deep muddy holes')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'No daily limit in most waters')
        )
        stocking = 'Self-sustaining.'
        gear = @(
            'Any rod will do',
            'Simple bottom rig: hook, split shot, worm'
        )
    },
    @{
        slug = 'common-carp'; name = 'Common Carp'; group = 'Catfish, Carp & Minnows'
        tags = @('carp', 'fly-fishing', 'big-fish')
        art = 'carp'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Cyprinus_carpio_2008_G1_%28cropped%29.jpg/500px-Cyprinus_carpio_2008_G1_%28cropped%29.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Cyprinus_carpio_2008_G1_(cropped).jpg'
        alt = 'Common carp, a large golden-scaled fish'
        blurb = 'Big, smart, and absurdly powerful — carp are fly fishing''s freshwater bonefish. Sight-fishing tailing carp on a shallow flat is one of the most technical games in fishing.'
        idMarks = @(
            'Large golden-bronze scales with a dark edge to each one',
            'Two pairs of barbels at the corners of the mouth',
            'One long dorsal fin and a deeply forked tail'
        )
        waters = @(
            @('Emigrant Reservoir', 'carp on the shallow flats in spring'),
            @('Agate Lake', 'good numbers'),
            @('Rogue River sloughs', 'carp in slow backwaters')
        )
        mapPins = @(
            @{ name = 'Emigrant Reservoir'; lat = 42.180; lng = -122.660 },
            @{ name = 'Agate Lake'; lat = 42.440; lng = -122.830 },
            @{ name = 'Rogue River sloughs'; lat = 42.440; lng = -123.320 }
        )
        prey = @(
            @('Bottom food: insects, seeds, crayfish', 'Warm months', 'Corn, dough baits, bread — and carp flies for the fly rod'),
            @('Surface food', 'Summer mornings', 'Floating bread and mulberry-style flies'),
            @('Seeds and berries', 'Under overhanging trees', 'Floating bread balls')
        )
        activity = @(
            @('Spring', 'Morning on warm flats', 'Fish sun themselves and feed in shallow water — sight-fishing season'),
            @('Summer', 'Early morning', 'Feeding windows on the flats before boat traffic'),
            @('Fall', 'Midday', 'Heavy feeding before winter')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Harvest', 'No limit — carp are encouraged harvest in most waters'),
            @('Never transport live fish', 'Moving live carp between waters is illegal')
        )
        stocking = 'Self-sustaining — an introduced species now naturalized in Oregon.'
        gear = @(
            'Medium-heavy rod, 10 to 15 lb line',
            'Hair-rigged corn or dough bait on a small hook',
            'Fly rod, 6 to 8 weight, with carp flies'
        )
    },
    @{
        slug = 'northern-pikeminnow'; name = 'Northern Pikeminnow'; group = 'Catfish, Carp & Minnows'
        tags = @('native', 'river', 'summer')
        art = 'pikeminnow'
        img = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Northern_pikeminnow.jpg/500px-Northern_pikeminnow.jpg'
        imgPage = 'https://commons.wikimedia.org/wiki/File:Northern_pikeminnow.jpg'
        alt = 'Northern pikeminnow, a long silvery native minnow'
        blurb = 'A big native minnow with a bad reputation and a soft mouth. On light tackle, a two-pound pikeminnow fights like a fish twice its size — and they bite all day in warm water.'
        idMarks = @(
            'Long, cylindrical, silvery-green body with a large mouth',
            'No barbels, no spines, no adipose fin',
            'Deeply forked tail; fins lack spots or bright colors'
        )
        waters = @(
            @('Rogue River (mainstem)', 'common throughout; often caught while trout fishing'),
            @('Applegate Reservoir', 'pikeminnow in the shallows')
        )
        mapPins = @(
            @{ name = 'Rogue River (mainstem)'; lat = 42.440; lng = -123.320 },
            @{ name = 'Applegate Reservoir'; lat = 42.100; lng = -123.350 }
        )
        prey = @(
            @('Small fish', 'All day in warm water', 'Small spinners, flies, and minnow imitations'),
            @('Insects and worms', 'All year', 'Worms, dough bait, small jigs'),
            @('Eggs (when salmon spawn)', 'Fall', 'Egg patterns and roe beads')
        )
        activity = @(
            @('Summer', 'All day', 'Unlike trout, pikeminnow don''t care about the midday sun'),
            @('Spring', 'Afternoon', 'Fish move shallow as water warms'),
            @('Fall', 'Midday', 'Feeding slows as water cools')
        )
        regs = @(
            @('License', 'Required for anglers 12 and older'),
            @('Limits', 'No daily limit in most waters'),
            @('Never transport live fish', 'It is illegal to move live fish between waters')
        )
        stocking = 'Wild native fish — not stocked.'
        gear = @(
            'Light spinning rod',
            'Worms and small spinners',
            'A soft touch — their mouths tear free easily'
        )
    }
)
