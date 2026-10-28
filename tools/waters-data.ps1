# Waters data for the Southern Oregon Angler Guide.
# Sourced by tools\build-site.ps1. Edit data here, then re-run the builder.
# Fish entries that match a species slug get a link; plain names render as text badges.

$script:waters = @(
    @{
        slug = 'rogue-river'; name = 'Rogue River'; region = 'Southern Oregon'
        blurb = 'The Rogue is Southern Oregon''s flagship river - a 215-mile system with spring and fall chinook, coho, summer and winter steelhead, trout, and a world-class smallmouth bass fishery below Grants Pass. If you learn one river well, make it this one.'
        fish = @('chinook-salmon','coho-salmon','steelhead','rainbow-trout','cutthroat-trout','smallmouth-bass','mountain-whitefish','northern-pikeminnow')
        tributaries = @(
            @('Applegate River', 'joins at Grants Pass; winter steelhead and fall chinook spawning'),
            @('Illinois River', 'joins at Agness; wild winter steelhead and fall chinook'),
            @('Bear Creek', 'flows through Medford and Ashland; urban stream, cutthroat and steelhead'),
            @('Evans Creek', 'joins near Wimer; steelhead and cutthroat'),
            @('Little Butte Creek', 'joins near Eagle Point; steelhead and cutthroat'),
            @('Big Butte Creek', 'joins near Trail; wild trout and steelhead'),
            @('Elk Creek', 'joins near Trail; steelhead and cutthroat (not the coastal Elk River)'),
            @('Trail Creek', 'joins near Trail; small wild trout stream'),
            @('Mill Creek (upper)', 'joins above Union Creek; headwater trout'),
            @('Union Creek', 'joins near Union Creek Resort; headwater trout')
        )
        pins = @(
            @{ name = 'Grants Pass (Griffins Park)'; lat = 42.44; lng = -123.33 },
            @{ name = 'Galice'; lat = 42.60; lng = -123.63 },
            @{ name = 'Agness'; lat = 42.60; lng = -123.90 },
            @{ name = 'Gold Beach'; lat = 42.43; lng = -124.42 },
            @{ name = 'Shady Cove'; lat = 42.72; lng = -122.80 },
            @{ name = 'Lost Creek Dam / TouVelle'; lat = 42.73; lng = -122.53 }
        )
        regs = @(
            @('Zones', 'The Rogue is managed in upper, middle, and lower zones with different seasons and limits - always check the zone you fish'),
            @('Salmon and steelhead', 'Combined Angling Tag required; hatchery fish have a clipped adipose fin, wild fish are usually released'),
            @('Trout', 'Upper Rogue trout water opens late May; check size and catch limits per section'),
            @('Smallmouth', 'Some Rogue sections encourage smallmouth harvest to protect salmon and steelhead'),
            @('In-season updates', 'Run size can trigger mid-season changes - check ODFW before every trip')
        )
        details = @(
            @('Best water', 'Upper: Shady Cove to Lost Creek (trout, summer steelhead). Middle: Galice to Agness (chinook, steelhead). Lower: Agness to Gold Beach (fall chinook, jet boat water)'),
            @('Access', 'Griffins and Riverside parks in Grants Pass, Galice Resort, Rainie Falls trail, Agness, Lobster Creek, Gold Beach'),
            @('Hazards', 'Drift boats and jet boats share the water; summer swimmers; cold water year-round'),
            @('Seasons', 'Spring chinook May-July, fall chinook Sept-Nov, summer steelhead June-Oct, winter steelhead Dec-April, smallmouth June-Oct'),
            @('Gear note', 'Drift boats dominate the middle river; bank anglers do well at Rainie Falls, Lobster Creek, and the Grants Pass parks')
        )
    },
    @{
        slug = 'applegate-river'; name = 'Applegate River'; region = 'Southern Oregon'
        blurb = 'The Rogue''s largest tributary, rising in the Siskiyou Mountains and joining the Rogue at Grants Pass. Winter steelhead, fall chinook spawning, and a reservoir with trout and kokanee.'
        fish = @('steelhead','chinook-salmon','coho-salmon','cutthroat-trout','rainbow-trout','kokanee')
        tributaries = @(
            @('Little Applegate River', 'joins near Ruch; steelhead and cutthroat'),
            @('Yale Creek', 'joins near Applegate; small wild trout stream'),
            @('Elliott Creek', 'joins above Applegate Lake; headwater trout'),
            @('Copper Creek', 'joins Applegate Lake; trout'),
            @('Carberry Creek', 'joins near Applegate; small stream'),
            @('Kanaka Creek', 'joins near Murphy; small stream')
        )
        pins = @(
            @{ name = 'Applegate Lake (Hart-tish)'; lat = 42.10; lng = -123.35 },
            @{ name = 'McKee Bridge'; lat = 42.15; lng = -123.45 },
            @{ name = 'Cantrall Buckley Park (Ruch)'; lat = 42.22; lng = -123.32 },
            @{ name = 'Applegate mouth (Grants Pass)'; lat = 42.44; lng = -123.33 }
        )
        regs = @(
            @('Steelhead', 'Winter season, typically December through March; hatchery fish only in most sections'),
            @('Chinook spawning', 'Sections close in fall to protect spawning chinook - check dates'),
            @('Trout', 'Open late May through October in most sections'),
            @('Reservoir', 'Applegate Lake has its own trout and kokanee rules')
        )
        details = @(
            @('Best water', 'Cantrall Buckley Park to McKee Bridge for steelhead; Applegate Lake for trout and kokanee'),
            @('Access', 'Cantrall Buckley Park, McKee Bridge, Applegate Lake ramps (Hart-tish, Copper), Applegate Park'),
            @('Hazards', 'Cold, clear water; slippery rocks; the river drops fast after storms'),
            @('Seasons', 'Winter steelhead Dec-March, trout late May-Oct, kokanee year-round in the lake'),
            @('Gear note', 'Light spinning gear or a 5-weight fly rod covers most of it')
        )
    },
    @{
        slug = 'illinois-river'; name = 'Illinois River'; region = 'Southern Oregon'
        blurb = 'A wild and scenic river draining the Kalmiopsis wilderness, joining the Rogue at Agness. Wild winter steelhead, fall chinook, and cutthroat in a rugged canyon - this is Oregon''s wild-fish water.'
        fish = @('steelhead','chinook-salmon','coho-salmon','cutthroat-trout')
        tributaries = @(
            @('East Fork Illinois River', 'joins near Cave Junction; steelhead and cutthroat'),
            @('West Fork Illinois River', 'joins near Kerby; wild trout'),
            @('Sucker Creek', 'joins near Holland; steelhead and cutthroat'),
            @('Lawson Creek', 'joins near Selma; small stream'),
            @('Deer Creek', 'joins near Selma; small stream')
        )
        pins = @(
            @{ name = 'Illinois River Forks State Park'; lat = 42.17; lng = -123.68 },
            @{ name = 'Holland Loop'; lat = 42.15; lng = -123.75 },
            @{ name = 'Agness confluence'; lat = 42.60; lng = -123.90 }
        )
        regs = @(
            @('Wild fish', 'Most sections require releasing wild steelhead - look for the clipped adipose fin'),
            @('Seasons', 'Winter steelhead season varies by section; check ODFW'),
            @('Trout', 'Open late May through October in most sections'),
            @('Wilderness water', 'The Illinois River Trail section is hike-in only')
        )
        details = @(
            @('Best water', 'Illinois River Forks State Park for easy access; the wilderness trail for solitude'),
            @('Access', 'Illinois River Forks State Park (Cave Junction), Holland Loop, Illinois River Trail (hike-in), Agness'),
            @('Hazards', 'Rugged canyon, limited cell service, long hikes; the river rises fast in storms'),
            @('Seasons', 'Winter steelhead Dec-March, trout late May-Oct'),
            @('Gear note', 'Wild fish are wary - light line and natural presentations')
        )
    },
    @{
        slug = 'chetco-river'; name = 'Chetco River'; region = 'South Coast'
        blurb = 'A short, steep river near Brookings with a strong fall chinook run and hatchery coho. The Chetco fishes best after the first big rains of fall.'
        fish = @('chinook-salmon','coho-salmon','steelhead','cutthroat-trout','rainbow-trout')
        tributaries = @(
            @('North Fork Chetco', 'joins near Brookings; steelhead and cutthroat'),
            @('South Fork Chetco', 'joins in the upper river; wild trout'),
            @('Jack Creek', 'joins in the upper river; small stream'),
            @('Wheeler Creek', 'joins near the mouth; small stream')
        )
        pins = @(
            @{ name = 'Loeb State Park'; lat = 42.05; lng = -124.30 },
            @{ name = 'Brookings'; lat = 42.03; lng = -124.28 },
            @{ name = 'Chetco River Road (upper)'; lat = 42.10; lng = -124.10 }
        )
        regs = @(
            @('Fall chinook', 'Season typically opens in fall; check dates and limits'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released'),
            @('Steelhead', 'Winter season; check ODFW'),
            @('Trout', 'Open late May through October in most sections')
        )
        details = @(
            @('Best water', 'Loeb State Park and the lower river for chinook; the upper road for trout'),
            @('Access', 'Loeb State Park, Chetco River Road, Brookings waterfront'),
            @('Hazards', 'The river rises fast after rain; logjams in the lower river'),
            @('Seasons', 'Fall chinook Sept-Nov, coho Oct-Dec, winter steelhead Dec-March'),
            @('Gear note', 'Cured roe and bobber-dogging are the local standard for chinook')
        )
    },
    @{
        slug = 'elk-river'; name = 'Elk River'; region = 'South Coast'
        blurb = 'A small, wild river near Cape Blanco with a hatchery-supported fall chinook run and sea-run cutthroat. Not the Rogue tributary Elk Creek - this one flows straight to the ocean.'
        fish = @('chinook-salmon','coho-salmon','steelhead','cutthroat-trout')
        tributaries = @(
            @('North Fork Elk River', 'joins in the upper river; wild trout'),
            @('South Fork Elk River', 'joins in the upper river; wild trout')
        )
        pins = @(
            @{ name = 'Elk River Hatchery'; lat = 42.75; lng = -124.45 },
            @{ name = 'Cape Blanco (mouth)'; lat = 42.83; lng = -124.56 }
        )
        regs = @(
            @('Fall chinook', 'Hatchery-supported season; check dates'),
            @('Wild fish', 'Release wild steelhead and coho'),
            @('Trout', 'Open late May through October')
        )
        details = @(
            @('Best water', 'The lower river near the hatchery; the upper road for trout'),
            @('Access', 'Elk River Hatchery, Elk River Road, Cape Blanco State Park'),
            @('Hazards', 'Small river - fish are concentrated and easily spooked'),
            @('Seasons', 'Fall chinook Sept-Nov, sea-run cutthroat Aug-Oct'),
            @('Gear note', 'Light gear; the river is small and clear')
        )
    },
    @{
        slug = 'sixes-river'; name = 'Sixes River'; region = 'South Coast'
        blurb = 'A small coastal river flowing out of the Coast Range near Cape Blanco, with fall chinook, coho, and winter steelhead in a compact, fishable system.'
        fish = @('chinook-salmon','coho-salmon','steelhead','cutthroat-trout')
        tributaries = @(
            @('North Fork Sixes River', 'joins in the upper river; wild trout'),
            @('Edson Creek', 'joins in the upper river; small stream')
        )
        pins = @(
            @{ name = 'Cape Blanco State Park'; lat = 42.83; lng = -124.56 },
            @{ name = 'Sixes River Road'; lat = 42.85; lng = -124.45 }
        )
        regs = @(
            @('Fall chinook', 'Season typically opens in fall; check dates'),
            @('Wild fish', 'Release wild steelhead and coho'),
            @('Trout', 'Open late May through October')
        )
        details = @(
            @('Best water', 'The lower river near Cape Blanco; the upper road for trout'),
            @('Access', 'Cape Blanco State Park, Sixes River Road, Edson Creek'),
            @('Hazards', 'Small river; fish move fast after rain'),
            @('Seasons', 'Fall chinook Sept-Nov, winter steelhead Dec-March'),
            @('Gear note', 'Light spinning gear or a 6-weight fly rod')
        )
    },
    @{
        slug = 'pistol-river'; name = 'Pistol River'; region = 'South Coast'
        blurb = 'A small south coast stream with fall chinook, coho, and winter steelhead. Short and steep - fish it after rain.'
        fish = @('chinook-salmon','coho-salmon','steelhead','cutthroat-trout')
        tributaries = @(
            @('North Fork Pistol River', 'joins in the upper river; wild trout')
        )
        pins = @(
            @{ name = 'Pistol River State Park'; lat = 42.20; lng = -124.40 }
        )
        regs = @(
            @('Fall chinook', 'Check dates and limits'),
            @('Wild fish', 'Release wild steelhead and coho'),
            @('Trout', 'Open late May through October')
        )
        details = @(
            @('Best water', 'The lower river near the state park'),
            @('Access', 'Pistol River State Park, Pistol River Loop Road'),
            @('Hazards', 'Small river; fish move fast after rain'),
            @('Seasons', 'Fall chinook Sept-Nov, winter steelhead Dec-March')
        )
    },
    @{
        slug = 'winchuck-river'; name = 'Winchuck River'; region = 'South Coast'
        blurb = 'The southernmost Oregon coastal river, right at the California line. Small, clear, and home to fall chinook, coho, and winter steelhead.'
        fish = @('chinook-salmon','coho-salmon','steelhead','cutthroat-trout')
        tributaries = @(
            @('North Fork Winchuck River', 'joins in the upper river; wild trout')
        )
        pins = @(
            @{ name = 'Winchuck River mouth'; lat = 42.00; lng = -124.30 }
        )
        regs = @(
            @('Fall chinook', 'Check dates and limits'),
            @('Wild fish', 'Release wild steelhead and coho'),
            @('Trout', 'Open late May through October')
        )
        details = @(
            @('Best water', 'The lower river near the mouth'),
            @('Access', 'Winchuck River Road, the mouth near the California border'),
            @('Hazards', 'Small river; fish move fast after rain'),
            @('Seasons', 'Fall chinook Sept-Nov, winter steelhead Dec-March')
        )
    },
    @{
        slug = 'coquille-river'; name = 'Coquille River'; region = 'South Coast'
        blurb = 'A large south coast system draining the Coast Range, with fall chinook, coho, winter steelhead, and smallmouth bass in the upper river. The South Fork near Powers is a classic chinook water.'
        fish = @('chinook-salmon','coho-salmon','steelhead','smallmouth-bass','cutthroat-trout')
        tributaries = @(
            @('South Fork Coquille', 'joins near Myrtle Point; fall chinook and steelhead'),
            @('North Fork Coquille', 'joins near Myrtle Point; steelhead and cutthroat'),
            @('Middle Fork Coquille', 'joins in the upper river; wild trout'),
            @('East Fork Coquille', 'joins in the upper river; wild trout'),
            @('Myrtle Creek', 'joins near Myrtle Point; small stream')
        )
        pins = @(
            @{ name = 'Bandon'; lat = 43.12; lng = -124.41 },
            @{ name = 'Myrtle Point'; lat = 43.17; lng = -124.14 },
            @{ name = 'Powers (South Fork)'; lat = 42.88; lng = -124.04 }
        )
        regs = @(
            @('Fall chinook', 'Season typically opens in fall; check dates'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released'),
            @('Steelhead', 'Winter season; check ODFW'),
            @('Smallmouth', 'Upper river smallmouth fishery; check limits')
        )
        details = @(
            @('Best water', 'Bandon for the lower river; Powers for the South Fork; Myrtle Point for the mainstem'),
            @('Access', 'Bandon waterfront, Myrtle Point, Powers, Coquille city'),
            @('Hazards', 'Tidal influence in the lower river; logjams'),
            @('Seasons', 'Fall chinook Sept-Nov, coho Oct-Dec, winter steelhead Dec-March, smallmouth June-Oct'),
            @('Gear note', 'Bait and bobber for chinook; light gear for smallmouth')
        )
    },
    @{
        slug = 'coos-river'; name = 'Coos River'; region = 'South Coast'
        blurb = 'The Coos system, including the Millicoma River, has one of Oregon''s strongest hatchery coho runs. Fall chinook and winter steelhead round it out.'
        fish = @('coho-salmon','chinook-salmon','steelhead','cutthroat-trout')
        tributaries = @(
            @('Millicoma River', 'the main fork; hatchery coho and steelhead'),
            @('South Fork Coos River', 'joins near Coos Bay; steelhead and cutthroat'),
            @('Marlow Creek', 'joins the Millicoma; small stream')
        )
        pins = @(
            @{ name = 'Coos Bay'; lat = 43.37; lng = -124.22 },
            @{ name = 'Millicoma'; lat = 43.45; lng = -124.10 }
        )
        regs = @(
            @('Coho', 'Hatchery coho fishery; wild fish must be released'),
            @('Fall chinook', 'Check dates and limits'),
            @('Steelhead', 'Winter season; check ODFW')
        )
        details = @(
            @('Best water', 'The Millicoma for coho; the South Fork for steelhead'),
            @('Access', 'Coos Bay, Millicoma, Eel Lake'),
            @('Hazards', 'Tidal influence in the lower river'),
            @('Seasons', 'Coho Oct-Dec, fall chinook Sept-Nov, winter steelhead Dec-March'),
            @('Gear note', 'Spinners and spoons for coho; bait for chinook')
        )
    },
    @{
        slug = 'umpqua-river'; name = 'Umpqua River'; region = 'Southwest Oregon'
        blurb = 'A huge system with two famous forks: the North Umpqua for summer steelhead and the South Umpqua for smallmouth and fall chinook. The mainstem below Reedsport also holds striped bass and shad.'
        fish = @('smallmouth-bass','steelhead','chinook-salmon','coho-salmon','cutthroat-trout','mountain-whitefish','striped bass','shad')
        tributaries = @(
            @('North Umpqua River', 'joins at Glide; famous summer steelhead water'),
            @('South Umpqua River', 'joins at Roseburg; smallmouth and fall chinook'),
            @('Cow Creek', 'joins the South Umpqua; smallmouth and steelhead'),
            @('Calapooya Creek', 'joins the Umpqua near Umpqua; smallmouth'),
            @('Elk Creek (Umpqua)', 'joins near Elkton; steelhead and cutthroat'),
            @('Lookingglass Creek', 'joins the North Umpqua; steelhead'),
            @('Olalla Creek', 'joins the South Umpqua; small stream')
        )
        pins = @(
            @{ name = 'Reedsport'; lat = 43.70; lng = -124.10 },
            @{ name = 'Scottsburg'; lat = 43.55; lng = -123.85 },
            @{ name = 'Glide (North Umpqua)'; lat = 43.30; lng = -123.08 },
            @{ name = 'Roseburg (South Umpqua)'; lat = 43.22; lng = -123.34 }
        )
        regs = @(
            @('Zones', 'The Umpqua is managed in sections with different rules - check the zone you fish'),
            @('Steelhead', 'North Umpqua summer run June-Oct; winter run Dec-April'),
            @('Smallmouth', 'Generous limits in most sections'),
            @('Striped bass', 'Lower river fishery; check current rules'),
            @('In-season updates', 'Check ODFW before every trip')
        )
        details = @(
            @('Best water', 'Glide to Steamboat for summer steelhead; Roseburg to Tiller for smallmouth; Reedsport for striped bass'),
            @('Access', 'Reedsport, Scottsburg, Glide, Winchester Dam area, Roseburg, Tiller'),
            @('Hazards', 'Drift boats on the North Umpqua; summer heat on the South Umpqua'),
            @('Seasons', 'Summer steelhead June-Oct, winter steelhead Dec-April, smallmouth June-Oct, fall chinook Sept-Nov'),
            @('Gear note', 'Fly water on the North Umpqua; bait and light gear on the South Umpqua')
        )
    },
    @{
        slug = 'siuslaw-river'; name = 'Siuslaw River'; region = 'Central Coast'
        blurb = 'A central coast river with a strong fall chinook run and hatchery coho. Florence and Mapleton are the main access points.'
        fish = @('chinook-salmon','coho-salmon','steelhead','cutthroat-trout')
        tributaries = @(
            @('North Fork Siuslaw', 'joins near Mapleton; steelhead and cutthroat'),
            @('Lake Creek', 'joins near Triangle Lake; steelhead and cutthroat'),
            @('Knowles Creek', 'joins near Mapleton; small stream'),
            @('Wildcat Creek', 'joins near Mapleton; small stream')
        )
        pins = @(
            @{ name = 'Florence'; lat = 43.97; lng = -124.10 },
            @{ name = 'Mapleton'; lat = 43.95; lng = -123.90 },
            @{ name = 'Cushman'; lat = 43.95; lng = -123.95 }
        )
        regs = @(
            @('Fall chinook', 'Season typically opens in fall; check dates'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released'),
            @('Steelhead', 'Winter season; check ODFW')
        )
        details = @(
            @('Best water', 'Florence and Mapleton for chinook; the forks for steelhead'),
            @('Access', 'Florence, Mapleton, Cushman, Lake Creek'),
            @('Hazards', 'Tidal influence in the lower river'),
            @('Seasons', 'Fall chinook Sept-Nov, coho Oct-Dec, winter steelhead Dec-March'),
            @('Gear note', 'Bait and bobber for chinook; spinners for coho')
        )
    },
    @{
        slug = 'willamette-river'; name = 'Willamette River'; region = 'Willamette Valley'
        blurb = 'Oregon''s biggest river system, draining the Willamette Valley. Spring chinook, winter steelhead, coho, shad, and sturgeon - plus smallmouth in the upper river and warmwater fish in the sloughs.'
        fish = @('chinook-salmon','coho-salmon','steelhead','smallmouth-bass','largemouth-bass','mountain-whitefish','white sturgeon','shad')
        tributaries = @(
            @('McKenzie River', 'joins at Eugene; spring chinook and trout'),
            @('Santiam River', 'joins at Albany; spring chinook and steelhead'),
            @('Clackamas River', 'joins at Gladstone; winter steelhead and spring chinook'),
            @('Molalla River', 'joins near Canby; steelhead and spring chinook'),
            @('Tualatin River', 'joins near West Linn; warmwater fish'),
            @('Long Tom River', 'joins near Monroe; warmwater fish'),
            @('Luckiamute River', 'joins near Independence; small stream'),
            @('Calapooia River', 'joins near Albany; small stream'),
            @('Coast Fork Willamette', 'joins near Eugene; headwater trout'),
            @('Middle Fork Willamette', 'joins near Springfield; trout and spring chinook')
        )
        pins = @(
            @{ name = 'Portland'; lat = 45.50; lng = -122.67 },
            @{ name = 'Oregon City'; lat = 45.36; lng = -122.61 },
            @{ name = 'Corvallis'; lat = 44.65; lng = -123.10 },
            @{ name = 'Eugene'; lat = 44.05; lng = -123.09 }
        )
        regs = @(
            @('Zones', 'The Willamette is managed in sections with different rules - check the zone you fish'),
            @('Spring chinook', 'Season typically April through August; check dates'),
            @('Sturgeon', 'Catch and release in most sections; check current rules'),
            @('Shad', 'Generous limits in summer'),
            @('In-season updates', 'Check ODFW before every trip')
        )
        details = @(
            @('Best water', 'Oregon City falls for spring chinook; Corvallis and Albany for shad; the upper river for smallmouth'),
            @('Access', 'Portland, Oregon City, Corvallis, Albany, Eugene, Salem'),
            @('Hazards', 'Big water, boat traffic, strong current'),
            @('Seasons', 'Spring chinook April-Aug, shad May-July, winter steelhead Dec-April, smallmouth June-Oct'),
            @('Gear note', 'Bait and bobber for chinook; light gear for shad and smallmouth')
        )
    },
    @{
        slug = 'mckenzie-river'; name = 'McKenzie River'; region = 'Willamette Valley'
        blurb = 'A classic Oregon trout river with spring chinook and winter steelhead in the lower river. Some sections are fly-fishing only - check the regulations.'
        fish = @('rainbow-trout','cutthroat-trout','chinook-salmon','steelhead','mountain-whitefish')
        tributaries = @(
            @('South Fork McKenzie', 'joins near Rainbow; wild trout'),
            @('Blue River', 'joins near Blue River; wild trout'),
            @('Horse Creek', 'joins near Belknap Springs; wild trout'),
            @('Deer Creek', 'joins near McKenzie Bridge; wild trout')
        )
        pins = @(
            @{ name = 'Leaburg'; lat = 44.10; lng = -122.62 },
            @{ name = 'Vida'; lat = 44.12; lng = -122.55 },
            @{ name = 'Blue River'; lat = 44.14; lng = -122.30 }
        )
        regs = @(
            @('Fly water', 'Some sections are artificial flies only - check the regulations'),
            @('Trout', 'Open late May through October in most sections'),
            @('Spring chinook', 'Lower river; check dates'),
            @('Steelhead', 'Winter season in the lower river')
        )
        details = @(
            @('Best water', 'Leaburg to Vida for trout; the lower river for spring chinook'),
            @('Access', 'Leaburg, Vida, Blue River, Finn Rock, McKenzie Bridge'),
            @('Hazards', 'Cold, clear water; slippery rocks'),
            @('Seasons', 'Trout late May-Oct, spring chinook May-July, winter steelhead Dec-April'),
            @('Gear note', 'Fly rod for the fly water; light spinning gear elsewhere')
        )
    },
    @{
        slug = 'santiam-river'; name = 'Santiam River'; region = 'Willamette Valley'
        blurb = 'Two forks with strong spring chinook and winter steelhead runs. The North Santiam below Detroit Dam and the South Santiam below Foster Dam are the main fisheries.'
        fish = @('chinook-salmon','steelhead','coho-salmon','rainbow-trout','cutthroat-trout')
        tributaries = @(
            @('Breitenbush River', 'joins the North Santiam; wild trout'),
            @('Little North Santiam', 'joins near Mehama; wild trout'),
            @('Thomas Creek', 'joins the South Santiam; small stream'),
            @('Crabtree Creek', 'joins the South Santiam; small stream')
        )
        pins = @(
            @{ name = 'Mill City'; lat = 44.75; lng = -122.47 },
            @{ name = 'Detroit'; lat = 44.62; lng = -122.15 },
            @{ name = 'Waterloo (South Santiam)'; lat = 44.45; lng = -122.85 }
        )
        regs = @(
            @('Spring chinook', 'Season typically May through July; check dates'),
            @('Steelhead', 'Winter season Dec-April'),
            @('Trout', 'Open late May through October in most sections')
        )
        details = @(
            @('Best water', 'Mill City for spring chinook; Waterloo for the South Santiam'),
            @('Access', 'Mill City, Detroit, Foster Park, Waterloo'),
            @('Hazards', 'Cold water from the dams; slippery rocks'),
            @('Seasons', 'Spring chinook May-July, winter steelhead Dec-April, trout late May-Oct'),
            @('Gear note', 'Bait and bobber for chinook; light gear for trout')
        )
    },
    @{
        slug = 'clackamas-river'; name = 'Clackamas River'; region = 'Willamette Valley'
        blurb = 'A Portland-area river with winter steelhead, spring chinook, and coho. Milo McIver State Park and the lower river are the main access points.'
        fish = @('steelhead','chinook-salmon','coho-salmon','rainbow-trout','cutthroat-trout')
        tributaries = @(
            @('Oak Grove Fork', 'joins near Ripplebrook; wild trout'),
            @('Collawash River', 'joins near Ripplebrook; wild trout'),
            @('Hot Springs Fork', 'joins the Collawash; wild trout'),
            @('Roaring River', 'joins near Estacada; wild trout')
        )
        pins = @(
            @{ name = 'Estacada'; lat = 45.30; lng = -122.33 },
            @{ name = 'Milo McIver State Park'; lat = 45.28; lng = -122.35 },
            @{ name = 'Carver'; lat = 45.38; lng = -122.42 }
        )
        regs = @(
            @('Steelhead', 'Winter season Dec-April; check ODFW'),
            @('Spring chinook', 'Season typically May through July'),
            @('Trout', 'Open late May through October in most sections')
        )
        details = @(
            @('Best water', 'Milo McIver and the lower river for steelhead and chinook'),
            @('Access', 'Estacada, Milo McIver State Park, Carver, Barton Park'),
            @('Hazards', 'Cold water; boat traffic in the lower river'),
            @('Seasons', 'Winter steelhead Dec-April, spring chinook May-July, trout late May-Oct'),
            @('Gear note', 'Bait and bobber for steelhead; light gear for trout')
        )
    },
    @{
        slug = 'sandy-river'; name = 'Sandy River'; region = 'Portland Area'
        blurb = 'A Mt. Hood river with winter steelhead, spring chinook, and a summer steelhead run. Oxbow Park and Glenn Otto are the main access points.'
        fish = @('steelhead','chinook-salmon','coho-salmon','rainbow-trout','cutthroat-trout')
        tributaries = @(
            @('Salmon River (Mt. Hood)', 'joins near Brightwood; wild trout'),
            @('Zigzag River', 'joins near Zigzag; wild trout'),
            @('Still Creek', 'joins near Rhododendron; wild trout'),
            @('Bull Run River', 'joins near Troutdale; closed to fishing in the watershed')
        )
        pins = @(
            @{ name = 'Oxbow Park'; lat = 45.48; lng = -122.20 },
            @{ name = 'Glenn Otto Park'; lat = 45.42; lng = -122.25 },
            @{ name = 'Dodge Park'; lat = 45.42; lng = -122.30 }
        )
        regs = @(
            @('Steelhead', 'Winter season Dec-April; summer run June-Oct'),
            @('Spring chinook', 'Season typically May through July'),
            @('Trout', 'Open late May through October in most sections')
        )
        details = @(
            @('Best water', 'Oxbow Park and Glenn Otto for steelhead and chinook'),
            @('Access', 'Oxbow Park, Glenn Otto Park, Dodge Park, Marmot'),
            @('Hazards', 'Cold water; the river rises fast after rain'),
            @('Seasons', 'Winter steelhead Dec-April, summer steelhead June-Oct, spring chinook May-July'),
            @('Gear note', 'Bait and bobber for steelhead; light gear for trout')
        )
    },
    @{
        slug = 'deschutes-river'; name = 'Deschutes River'; region = 'Central Oregon'
        blurb = 'One of Oregon''s most famous rivers - summer steelhead, redband trout, and a fall chinook run in the lower river. Maupin is the hub.'
        fish = @('steelhead','rainbow-trout','mountain-whitefish','chinook-salmon')
        tributaries = @(
            @('Metolius River', 'joins at Lake Billy Chinook; trout and bull trout'),
            @('Crooked River', 'joins at Lake Billy Chinook; redband trout'),
            @('Whychus Creek', 'joins near Sisters; wild trout'),
            @('Warm Springs River', 'joins on the reservation; closed to non-tribal fishing'),
            @('Fall River', 'joins near La Pine; trout'),
            @('Little Deschutes River', 'joins near Sunriver; trout')
        )
        pins = @(
            @{ name = 'Maupin'; lat = 45.17; lng = -120.82 },
            @{ name = 'Warm Springs'; lat = 44.98; lng = -121.13 },
            @{ name = 'Heritage Landing (mouth)'; lat = 45.63; lng = -121.00 }
        )
        regs = @(
            @('Steelhead', 'Summer run June-Oct; check ODFW'),
            @('Trout', 'Open year-round in most sections; check size and catch limits'),
            @('Fall chinook', 'Lower river; check dates'),
            @('In-season updates', 'Check ODFW before every trip')
        )
        details = @(
            @('Best water', 'Maupin to Warm Springs for steelhead and trout; the lower river for fall chinook'),
            @('Access', 'Maupin, Warm Springs, Trout Creek, Mecca, Heritage Landing'),
            @('Hazards', 'Hot summers, cold winters, strong current, rattlesnakes in the canyon'),
            @('Seasons', 'Summer steelhead June-Oct, trout year-round, fall chinook Sept-Nov'),
            @('Gear note', 'Fly rod for trout; bait and bobber for steelhead')
        )
    },
    @{
        slug = 'metolius-river'; name = 'Metolius River'; region = 'Central Oregon'
        blurb = 'A spring-fed river famous for clear water, big trout, and a protected bull trout population. Some sections are fly-fishing only; bull trout are catch and release only.'
        fish = @('rainbow-trout','bull-trout','mountain-whitefish','kokanee')
        tributaries = @(
            @('Lake Creek', 'joins near Camp Sherman; wild trout'),
            @('Canyon Creek', 'joins near the headwaters; wild trout'),
            @('Jack Creek', 'joins near the headwaters; wild trout')
        )
        pins = @(
            @{ name = 'Camp Sherman'; lat = 44.49; lng = -121.63 },
            @{ name = 'Wizard Falls'; lat = 44.48; lng = -121.68 },
            @{ name = 'Bridge 99'; lat = 44.45; lng = -121.72 }
        )
        regs = @(
            @('Fly water', 'Some sections are artificial flies only - check the regulations'),
            @('Bull trout', 'Catch and release only - it is illegal to harvest bull trout'),
            @('Trout', 'Open year-round in most sections')
        )
        details = @(
            @('Best water', 'Camp Sherman to Bridge 99 for trout; the lower river for bull trout'),
            @('Access', 'Camp Sherman, Allingham, Bridge 99, Wizard Falls'),
            @('Hazards', 'Cold, clear water; slippery rocks'),
            @('Seasons', 'Trout year-round; bull trout best in spring and fall'),
            @('Gear note', 'Fly rod for the fly water; know bull trout identification')
        )
    },
    @{
        slug = 'crooked-river'; name = 'Crooked River'; region = 'Central Oregon'
        blurb = 'A redband trout river below Prineville Reservoir, with some brown trout. The water below Bowman Dam is the classic stretch.'
        fish = @('rainbow-trout','mountain-whitefish','brown trout')
        tributaries = @(
            @('Ochoco Creek', 'joins near Prineville; small stream'),
            @('Beaver Creek', 'joins near Prineville; small stream'),
            @('South Fork Crooked River', 'joins in the upper river; wild trout')
        )
        pins = @(
            @{ name = 'Prineville'; lat = 44.30; lng = -120.85 },
            @{ name = 'Bowman Dam'; lat = 43.80; lng = -120.75 },
            @{ name = 'Lone Pine'; lat = 44.20; lng = -120.80 }
        )
        regs = @(
            @('Trout', 'Open year-round in most sections; check size and catch limits'),
            @('Reservoir', 'Prineville Reservoir has its own rules')
        )
        details = @(
            @('Best water', 'Bowman Dam to Lone Pine for redband trout'),
            @('Access', 'Prineville, Bowman Dam, Lone Pine, Big Bend'),
            @('Hazards', 'Hot summers; the river can be murky after storms'),
            @('Seasons', 'Trout year-round; best in spring and fall'),
            @('Gear note', 'Light spinning gear or a 4-weight fly rod')
        )
    },
    @{
        slug = 'fall-river'; name = 'Fall River'; region = 'Central Oregon'
        blurb = 'A spring-fed stream near La Pine with rainbow, brook, and brown trout. Small, clear, and easy to fish.'
        fish = @('rainbow-trout','brook-trout','brown trout')
        tributaries = @(
            @('Springs and seeps', 'the river is fed by springs; no major tributaries')
        )
        pins = @(
            @{ name = 'Fall River Hatchery'; lat = 43.55; lng = -121.50 },
            @{ name = 'Fall River Falls'; lat = 43.55; lng = -121.52 }
        )
        regs = @(
            @('Trout', 'Open year-round in most sections; check size and catch limits')
        )
        details = @(
            @('Best water', 'The whole river is fishable; the falls area is a classic spot'),
            @('Access', 'Fall River Hatchery, Fall River Falls, forest roads'),
            @('Hazards', 'Cold, clear water; small stream - fish are easily spooked'),
            @('Seasons', 'Trout year-round; best in spring and fall'),
            @('Gear note', 'Light spinning gear or a 3-weight fly rod')
        )
    },
    @{
        slug = 'williamson-river'; name = 'Williamson River'; region = 'Klamath Basin'
        blurb = 'A Klamath basin river with redband trout and a protected bull trout population in the upper river. The Sprague River is its main tributary.'
        fish = @('rainbow-trout','bull-trout','brook-trout')
        tributaries = @(
            @('Sprague River', 'joins near Chiloquin; redband trout'),
            @('Upper Williamson tributaries', 'headwater streams above Klamath Marsh; bull trout')
        )
        pins = @(
            @{ name = 'Chiloquin'; lat = 42.57; lng = -121.87 },
            @{ name = 'Collier Memorial State Park'; lat = 42.60; lng = -121.85 },
            @{ name = 'Modoc Point'; lat = 42.50; lng = -121.90 }
        )
        regs = @(
            @('Bull trout', 'Catch and release only - it is illegal to harvest bull trout'),
            @('Trout', 'Open year-round in most sections; check size and catch limits')
        )
        details = @(
            @('Best water', 'Chiloquin to Modoc Point for redband trout; the upper river for bull trout'),
            @('Access', 'Chiloquin, Collier Memorial State Park, Modoc Point'),
            @('Hazards', 'Cold, clear water; the river can be murky after storms'),
            @('Seasons', 'Trout year-round; best in spring and fall'),
            @('Gear note', 'Light spinning gear or a 4-weight fly rod; know bull trout identification')
        )
    },
    @{
        slug = 'wood-river'; name = 'Wood River'; region = 'Klamath Basin'
        blurb = 'A spring-fed river near Fort Klamath with redband trout, some brown trout, and brook trout in the headwaters. Clear, cold, and technical.'
        fish = @('rainbow-trout','brown trout','brook-trout')
        tributaries = @(
            @('Fort Creek', 'joins near Fort Klamath; small stream'),
            @('Crooked Creek', 'joins near Fort Klamath; small stream'),
            @('Sevenmile Creek', 'joins near the lower river; small stream'),
            @('Annie Creek', 'joins near Fort Klamath; small stream')
        )
        pins = @(
            @{ name = 'Fort Klamath'; lat = 42.88; lng = -121.99 },
            @{ name = 'Kimball State Park'; lat = 42.95; lng = -122.05 },
            @{ name = 'Wood River Wetland'; lat = 42.85; lng = -121.95 }
        )
        regs = @(
            @('Trout', 'Open year-round in most sections; check size and catch limits')
        )
        details = @(
            @('Best water', 'Fort Klamath to the wetland for redband trout; the headwaters for brook trout'),
            @('Access', 'Fort Klamath, Kimball State Park, Wood River Wetland'),
            @('Hazards', 'Cold, clear water; small stream - fish are easily spooked'),
            @('Seasons', 'Trout year-round; best in spring and fall'),
            @('Gear note', 'Light spinning gear or a 3-weight fly rod')
        )
    },
    @{
        slug = 'john-day-river'; name = 'John Day River'; region = 'Eastern Oregon'
        blurb = 'Oregon''s longest free-flowing river, famous for smallmouth bass and summer steelhead in the upper river. Cottonwood Canyon and Service Creek are the main access points.'
        fish = @('smallmouth-bass','steelhead','rainbow-trout','channel-catfish','common-carp')
        tributaries = @(
            @('North Fork John Day', 'joins near Kimberly; steelhead and trout'),
            @('Middle Fork John Day', 'joins near Kimberly; steelhead and trout'),
            @('South Fork John Day', 'joins near Dayville; smallmouth and trout'),
            @('Cottonwood Creek', 'joins near Cottonwood Canyon; smallmouth'),
            @('Rock Creek', 'joins near Service Creek; small stream')
        )
        pins = @(
            @{ name = 'Cottonwood Canyon'; lat = 44.75; lng = -120.60 },
            @{ name = 'Service Creek'; lat = 44.72; lng = -120.40 },
            @{ name = 'Kimberly'; lat = 44.80; lng = -120.20 },
            @{ name = 'Picture Gorge'; lat = 44.55; lng = -119.90 }
        )
        regs = @(
            @('Smallmouth', 'Generous limits in most sections'),
            @('Steelhead', 'Summer run in the upper river; check ODFW'),
            @('Trout', 'Open year-round in most sections')
        )
        details = @(
            @('Best water', 'Cottonwood Canyon to Service Creek for smallmouth; the upper river for steelhead'),
            @('Access', 'Cottonwood Canyon, Service Creek, Twickenham, Kimberly, Picture Gorge'),
            @('Hazards', 'Hot summers, remote water, limited cell service'),
            @('Seasons', 'Smallmouth June-Oct, summer steelhead June-Oct, trout year-round'),
            @('Gear note', 'Light spinning gear or a 6-weight fly rod for smallmouth')
        )
    },
    @{
        slug = 'grande-ronde-river'; name = 'Grande Ronde River'; region = 'Eastern Oregon'
        blurb = 'A northeastern Oregon river with summer steelhead, rainbow trout, and a protected bull trout population. The lower river near Troy is the classic steelhead water.'
        fish = @('steelhead','rainbow-trout','bull-trout','mountain-whitefish','smallmouth-bass')
        tributaries = @(
            @('Wallowa River', 'joins near Rondowa; steelhead and trout'),
            @('Catherine Creek', 'joins near Union; trout'),
            @('Lookingglass Creek', 'joins near La Grande; steelhead'),
            @('Joseph Creek', 'joins in the lower canyon; steelhead')
        )
        pins = @(
            @{ name = 'La Grande'; lat = 45.32; lng = -118.09 },
            @{ name = 'Elgin'; lat = 45.56; lng = -117.92 },
            @{ name = 'Troy'; lat = 46.10; lng = -117.00 },
            @{ name = 'Boggan''s Oasis'; lat = 46.05; lng = -117.05 }
        )
        regs = @(
            @('Steelhead', 'Summer run June-Oct; check ODFW'),
            @('Bull trout', 'Catch and release only - it is illegal to harvest bull trout'),
            @('Trout', 'Open year-round in most sections')
        )
        details = @(
            @('Best water', 'Troy to Boggan''s Oasis for steelhead; the upper river for trout'),
            @('Access', 'La Grande, Elgin, Troy, Boggan''s Oasis'),
            @('Hazards', 'Remote canyon; limited cell service; cold water'),
            @('Seasons', 'Summer steelhead June-Oct, trout year-round'),
            @('Gear note', 'Bait and bobber for steelhead; light gear for trout; know bull trout identification')
        )
    },
    @{
        slug = 'wallowa-river'; name = 'Wallowa River'; region = 'Eastern Oregon'
        blurb = 'A short river draining the Wallowa Mountains, with summer steelhead, rainbow trout, and a protected bull trout population. Wallowa Lake is the famous kokanee and lake trout water.'
        fish = @('steelhead','rainbow-trout','bull-trout','kokanee','lake-trout')
        tributaries = @(
            @('Minam River', 'joins near Minam; steelhead and trout'),
            @('Lostine River', 'joins near Wallowa; trout'),
            @('Bear Creek', 'joins near Wallowa; small stream')
        )
        pins = @(
            @{ name = 'Minam'; lat = 45.60; lng = -117.70 },
            @{ name = 'Wallowa'; lat = 45.57; lng = -117.53 },
            @{ name = 'Joseph (Wallowa Lake)'; lat = 45.25; lng = -117.23 }
        )
        regs = @(
            @('Steelhead', 'Summer run June-Oct; check ODFW'),
            @('Bull trout', 'Catch and release only - it is illegal to harvest bull trout'),
            @('Wallowa Lake', 'Kokanee and lake trout rules; check ODFW')
        )
        details = @(
            @('Best water', 'Minam to Wallowa for steelhead; Wallowa Lake for kokanee and lake trout'),
            @('Access', 'Minam, Wallowa, Joseph, Wallowa Lake'),
            @('Hazards', 'Remote water; cold, clear streams'),
            @('Seasons', 'Summer steelhead June-Oct, kokanee year-round in the lake'),
            @('Gear note', 'Bait and bobber for steelhead; downriggers for the lake')
        )
    },
    @{
        slug = 'imnaha-river'; name = 'Imnaha River'; region = 'Eastern Oregon'
        blurb = 'A remote canyon river in the Wallowa Mountains with summer steelhead, rainbow trout, and a protected bull trout population. Big Sheep Creek is the main tributary.'
        fish = @('steelhead','rainbow-trout','bull-trout','mountain-whitefish')
        tributaries = @(
            @('Big Sheep Creek', 'joins near Imnaha; steelhead and trout'),
            @('Little Sheep Creek', 'joins near Imnaha; trout'),
            @('McCarty Creek', 'joins in the upper river; small stream')
        )
        pins = @(
            @{ name = 'Imnaha'; lat = 45.55; lng = -116.85 },
            @{ name = 'Cow Creek Bridge'; lat = 45.60; lng = -116.90 }
        )
        regs = @(
            @('Steelhead', 'Summer run June-Oct; check ODFW'),
            @('Bull trout', 'Catch and release only - it is illegal to harvest bull trout'),
            @('Trout', 'Open year-round in most sections')
        )
        details = @(
            @('Best water', 'Imnaha to the Snake for steelhead; the upper river for trout'),
            @('Access', 'Imnaha, Cow Creek Bridge, forest roads'),
            @('Hazards', 'Remote canyon; limited cell service; long drives'),
            @('Seasons', 'Summer steelhead June-Oct, trout year-round'),
            @('Gear note', 'Bait and bobber for steelhead; light gear for trout; know bull trout identification')
        )
    },
    @{
        slug = 'owyhee-river'; name = 'Owyhee River'; region = 'Eastern Oregon'
        blurb = 'A desert river with a famous trophy brown trout fishery below Owyhee Dam, plus smallmouth and catfish in the lower canyon. Remote and rugged.'
        fish = @('brown trout','rainbow-trout','smallmouth-bass','channel-catfish')
        tributaries = @(
            @('South Fork Owyhee', 'joins in the lower canyon; smallmouth and catfish'),
            @('Jordan Creek', 'joins in the lower canyon; smallmouth')
        )
        pins = @(
            @{ name = 'Snively Hot Springs'; lat = 42.10; lng = -117.05 },
            @{ name = 'Rome'; lat = 42.20; lng = -117.20 },
            @{ name = 'Owyhee Dam'; lat = 43.55; lng = -117.25 }
        )
        regs = @(
            @('Brown trout', 'Trophy water below Owyhee Dam; check size and catch limits'),
            @('Smallmouth', 'Generous limits in the lower river'),
            @('Trout', 'Open year-round in most sections')
        )
        details = @(
            @('Best water', 'Below Owyhee Dam for brown trout; the lower canyon for smallmouth'),
            @('Access', 'Snively Hot Springs, Rome, Owyhee Dam'),
            @('Hazards', 'Remote desert; limited cell service; hot summers'),
            @('Seasons', 'Brown trout year-round; smallmouth June-Oct'),
            @('Gear note', 'Fly rod for brown trout; light gear for smallmouth')
        )
    },
    @{
        slug = 'malheur-river'; name = 'Malheur River'; region = 'Eastern Oregon'
        blurb = 'A high desert river with rainbow trout, some brown trout, and warmwater fish in the lower river. Vale and Ontario are the main access points.'
        fish = @('rainbow-trout','brown trout','channel-catfish','common-carp')
        tributaries = @(
            @('North Fork Malheur', 'joins near Vale; trout'),
            @('Middle Fork Malheur', 'joins near Riverside; trout'),
            @('South Fork Malheur', 'joins near Riverside; trout'),
            @('Bully Creek', 'joins near Vale; small stream')
        )
        pins = @(
            @{ name = 'Vale'; lat = 44.00; lng = -117.23 },
            @{ name = 'Ontario'; lat = 44.02; lng = -116.98 },
            @{ name = 'Riverside'; lat = 44.05; lng = -117.50 }
        )
        regs = @(
            @('Trout', 'Open year-round in most sections; check size and catch limits'),
            @('Warmwater', 'Generous limits on catfish and carp')
        )
        details = @(
            @('Best water', 'Vale to Riverside for trout; the lower river for catfish and carp'),
            @('Access', 'Vale, Ontario, Riverside'),
            @('Hazards', 'Remote desert; hot summers; the river can be murky'),
            @('Seasons', 'Trout year-round; catfish and carp in summer'),
            @('Gear note', 'Light spinning gear for trout; bait for catfish')
        )
    },
    @{
        slug = 'powder-river'; name = 'Powder River'; region = 'Eastern Oregon'
        blurb = 'A northeastern Oregon river with rainbow trout, some brown trout, and brook trout in the headwaters. Baker City and Richland are the main access points.'
        fish = @('rainbow-trout','brown trout','brook-trout')
        tributaries = @(
            @('North Powder River', 'joins near North Powder; trout'),
            @('Eagle Creek', 'joins near Richland; trout'),
            @('Pine Creek', 'joins near Halfway; trout')
        )
        pins = @(
            @{ name = 'Baker City'; lat = 44.78; lng = -117.83 },
            @{ name = 'Richland'; lat = 44.85; lng = -117.60 },
            @{ name = 'Halfway'; lat = 44.88; lng = -117.45 }
        )
        regs = @(
            @('Trout', 'Open year-round in most sections; check size and catch limits')
        )
        details = @(
            @('Best water', 'Baker City to Richland for trout; the headwaters for brook trout'),
            @('Access', 'Baker City, Richland, Halfway'),
            @('Hazards', 'Remote water; the river can be murky after storms'),
            @('Seasons', 'Trout year-round; best in spring and fall'),
            @('Gear note', 'Light spinning gear or a 4-weight fly rod')
        )
    },
    @{
        slug = 'snake-river'; name = 'Snake River'; region = 'Eastern Oregon'
        blurb = 'The border river in Hells Canyon, with smallmouth bass, channel catfish, white sturgeon (catch and release), and some steelhead. Remote and dramatic.'
        fish = @('smallmouth-bass','channel-catfish','white sturgeon','rainbow-trout','steelhead')
        tributaries = @(
            @('Imnaha River', 'joins in Hells Canyon; steelhead and trout'),
            @('Powder River', 'joins near Huntington; warmwater fish'),
            @('Owyhee River', 'joins near the Idaho line; smallmouth and catfish')
        )
        pins = @(
            @{ name = 'Hells Canyon Dam'; lat = 45.00; lng = -116.80 },
            @{ name = 'Oxbow'; lat = 44.95; lng = -116.85 },
            @{ name = 'Copperfield'; lat = 44.93; lng = -116.88 }
        )
        regs = @(
            @('Sturgeon', 'Catch and release only - check current rules'),
            @('Smallmouth', 'Generous limits in most sections'),
            @('Steelhead', 'Check ODFW for seasons')
        )
        details = @(
            @('Best water', 'Hells Canyon Dam to Oxbow for smallmouth and sturgeon'),
            @('Access', 'Hells Canyon Dam, Oxbow, Copperfield'),
            @('Hazards', 'Remote canyon; limited cell service; big water'),
            @('Seasons', 'Smallmouth June-Oct, sturgeon year-round'),
            @('Gear note', 'Heavy gear for sturgeon; light gear for smallmouth')
        )
    },
    @{
        slug = 'nehalem-river'; name = 'Nehalem River'; region = 'North Coast'
        blurb = 'A large north coast river with winter steelhead, fall chinook, coho, and sea-run cutthroat. The North Fork and Salmonberry are the main tributaries.'
        fish = @('steelhead','chinook-salmon','coho-salmon','cutthroat-trout')
        tributaries = @(
            @('North Fork Nehalem', 'joins near the coast; steelhead and cutthroat'),
            @('Salmonberry River', 'joins in the upper river; wild trout'),
            @('Rock Creek', 'joins in the upper river; small stream')
        )
        pins = @(
            @{ name = 'Nehalem'; lat = 45.70; lng = -123.95 },
            @{ name = 'Foss Road'; lat = 45.72; lng = -123.85 },
            @{ name = 'Highway 26 bridge'; lat = 45.75; lng = -123.70 }
        )
        regs = @(
            @('Steelhead', 'Winter season Dec-April; check ODFW'),
            @('Fall chinook', 'Season typically opens in fall'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released')
        )
        details = @(
            @('Best water', 'The lower river for chinook and steelhead; the forks for trout'),
            @('Access', 'Nehalem, Foss Road, Highway 26 bridges'),
            @('Hazards', 'Tidal influence in the lower river; logjams'),
            @('Seasons', 'Winter steelhead Dec-April, fall chinook Sept-Nov, coho Oct-Dec'),
            @('Gear note', 'Bait and bobber for steelhead; spinners for coho')
        )
    },
    @{
        slug = 'trask-river'; name = 'Trask River'; region = 'North Coast'
        blurb = 'A Tillamook-area river with fall chinook, coho, and winter steelhead. The North, South, and East forks are the main tributaries.'
        fish = @('chinook-salmon','coho-salmon','steelhead','cutthroat-trout')
        tributaries = @(
            @('North Fork Trask', 'joins near Tillamook; steelhead and cutthroat'),
            @('South Fork Trask', 'joins near Trask; steelhead and cutthroat'),
            @('East Fork Trask', 'joins near Trask; small stream'),
            @('Cedar Creek', 'joins near Tillamook; small stream')
        )
        pins = @(
            @{ name = 'Tillamook'; lat = 45.47; lng = -123.85 },
            @{ name = 'Trask'; lat = 45.45; lng = -123.75 },
            @{ name = 'Highway 6'; lat = 45.50; lng = -123.65 }
        )
        regs = @(
            @('Fall chinook', 'Season typically opens in fall; check dates'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released'),
            @('Steelhead', 'Winter season Dec-April')
        )
        details = @(
            @('Best water', 'The lower river for chinook; the forks for steelhead and trout'),
            @('Access', 'Tillamook, Trask, Highway 6 pullouts'),
            @('Hazards', 'Tidal influence in the lower river'),
            @('Seasons', 'Fall chinook Sept-Nov, coho Oct-Dec, winter steelhead Dec-April'),
            @('Gear note', 'Bait and bobber for chinook; spinners for coho')
        )
    },
    @{
        slug = 'wilson-river'; name = 'Wilson River'; region = 'North Coast'
        blurb = 'A Tillamook-area river with winter steelhead, fall chinook, and coho. Highway 6 follows the river and offers easy access.'
        fish = @('steelhead','chinook-salmon','coho-salmon','cutthroat-trout')
        tributaries = @(
            @('North Fork Wilson', 'joins near Tillamook; steelhead and cutthroat'),
            @('South Fork Wilson', 'joins near Tillamook; steelhead and cutthroat'),
            @('Devils Lake Fork', 'joins near Tillamook; small stream'),
            @('Jordan Creek', 'joins in the upper river; small stream')
        )
        pins = @(
            @{ name = 'Tillamook'; lat = 45.47; lng = -123.85 },
            @{ name = 'Lee''s Camp'; lat = 45.45; lng = -123.60 },
            @{ name = 'Highway 6 pullouts'; lat = 45.50; lng = -123.55 }
        )
        regs = @(
            @('Steelhead', 'Winter season Dec-April; check ODFW'),
            @('Fall chinook', 'Season typically opens in fall'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released')
        )
        details = @(
            @('Best water', 'The lower river for chinook and steelhead; Highway 6 pullouts for easy access'),
            @('Access', 'Tillamook, Lee''s Camp, Highway 6 pullouts'),
            @('Hazards', 'Tidal influence in the lower river'),
            @('Seasons', 'Winter steelhead Dec-April, fall chinook Sept-Nov, coho Oct-Dec'),
            @('Gear note', 'Bait and bobber for steelhead; spinners for coho')
        )
    },
    @{
        slug = 'nestucca-river'; name = 'Nestucca River'; region = 'North Coast'
        blurb = 'A Pacific City-area river with winter steelhead, fall chinook, and coho. The Little Nestucca is the main tributary.'
        fish = @('steelhead','chinook-salmon','coho-salmon','cutthroat-trout')
        tributaries = @(
            @('Little Nestucca River', 'joins near Pacific City; steelhead and cutthroat'),
            @('Farmer Creek', 'joins in the upper river; small stream')
        )
        pins = @(
            @{ name = 'Pacific City'; lat = 45.20; lng = -123.97 },
            @{ name = 'Blaine'; lat = 45.25; lng = -123.85 },
            @{ name = 'Hebo'; lat = 45.22; lng = -123.90 }
        )
        regs = @(
            @('Steelhead', 'Winter season Dec-April; check ODFW'),
            @('Fall chinook', 'Season typically opens in fall'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released')
        )
        details = @(
            @('Best water', 'The lower river for chinook and steelhead; the Little Nestucca for trout'),
            @('Access', 'Pacific City, Blaine, Hebo'),
            @('Hazards', 'Tidal influence in the lower river'),
            @('Seasons', 'Winter steelhead Dec-April, fall chinook Sept-Nov, coho Oct-Dec'),
            @('Gear note', 'Bait and bobber for steelhead; spinners for coho')
        )
    },
    @{
        slug = 'siletz-river'; name = 'Siletz River'; region = 'Central Coast'
        blurb = 'A central coast river with winter steelhead, fall chinook, coho, and sea-run cutthroat. The North, South, and Middle forks are the main tributaries.'
        fish = @('steelhead','chinook-salmon','coho-salmon','cutthroat-trout')
        tributaries = @(
            @('North Fork Siletz', 'joins near Siletz; steelhead and cutthroat'),
            @('South Fork Siletz', 'joins near Siletz; steelhead and cutthroat'),
            @('Middle Fork Siletz', 'joins in the upper river; wild trout'),
            @('Sams Creek', 'joins in the upper river; small stream')
        )
        pins = @(
            @{ name = 'Siletz'; lat = 44.72; lng = -124.00 },
            @{ name = 'Logsden'; lat = 44.75; lng = -123.90 },
            @{ name = 'Ojalla'; lat = 44.78; lng = -123.85 }
        )
        regs = @(
            @('Steelhead', 'Winter season Dec-April; check ODFW'),
            @('Fall chinook', 'Season typically opens in fall'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released')
        )
        details = @(
            @('Best water', 'The lower river for chinook and steelhead; the forks for trout'),
            @('Access', 'Siletz, Logsden, Ojalla'),
            @('Hazards', 'Tidal influence in the lower river'),
            @('Seasons', 'Winter steelhead Dec-April, fall chinook Sept-Nov, coho Oct-Dec'),
            @('Gear note', 'Bait and bobber for steelhead; spinners for coho')
        )
    },
    @{
        slug = 'alsea-river'; name = 'Alsea River'; region = 'Central Coast'
        blurb = 'A central coast river with winter steelhead, fall chinook, and coho. The North and South forks and Drift Creek are the main tributaries.'
        fish = @('steelhead','chinook-salmon','coho-salmon','cutthroat-trout')
        tributaries = @(
            @('North Fork Alsea', 'joins near Alsea; steelhead and cutthroat'),
            @('South Fork Alsea', 'joins near Alsea; steelhead and cutthroat'),
            @('Drift Creek', 'joins near Tidewater; steelhead and cutthroat'),
            @('Five Rivers', 'joins in the upper river; wild trout')
        )
        pins = @(
            @{ name = 'Tidewater'; lat = 44.40; lng = -124.00 },
            @{ name = 'Alsea'; lat = 44.42; lng = -123.85 },
            @{ name = 'Black Rock'; lat = 44.45; lng = -123.75 }
        )
        regs = @(
            @('Steelhead', 'Winter season Dec-April; check ODFW'),
            @('Fall chinook', 'Season typically opens in fall'),
            @('Coho', 'Hatchery coho fishery; wild fish must be released')
        )
        details = @(
            @('Best water', 'The lower river for chinook and steelhead; the forks for trout'),
            @('Access', 'Tidewater, Alsea, Black Rock'),
            @('Hazards', 'Tidal influence in the lower river'),
            @('Seasons', 'Winter steelhead Dec-April, fall chinook Sept-Nov, coho Oct-Dec'),
            @('Gear note', 'Bait and bobber for steelhead; spinners for coho')
        )
    }
)
