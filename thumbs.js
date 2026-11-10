// The thumbnail frame, alive (see thumbs.css). Runs BEFORE theme.js, whose endless strip clones the
// tiles: the tiles are wrapped first, so the clones carry the wrappers.
(function () {
	var NAMES = {
		aliens: "Aliens", sortingrobots: "Sorting Robots", bucketmadness: "Pockets", monkeyc: "Apprentice",
		change: "Change", gorilla: "Gorilla", pickpocket: "Pickpocket", wolves: "Wolves", didi: "Pinpoint",
		ddooo: "Witness", pop: "Glimpse", ooo: "Lineup", dino: "Dino", dinoback: "Dino N-Back",
		movingcards: "Moving Cards", mosaic: "Mosaic", lighthouse: "Lighthouse", taxi: "Taxi", storm: "Storm",
		guidem: "Valet", pneumo: "Pneumo", parkem: "Detour", ants: "Ants", whack: "Whack", ptbits: "Nudge",
		typit: "Typit", breathe: "Breathe", udbr: "Buoy", crack: "Crack the Safe", mother: "Mother Snake",
		couples: "Couples", friends: "Friends", weris: "Weris", polkadots: "Polka Dots", mmm: "Mind Palace",
		lightsout: "Lights Out", deliverem: "Dispatch", delemfp: "Headlights"
	};
	var GAMES = Object.keys(NAMES);

	function rnd(a, b) { return a + Math.random() * (b - a); }
	function shuffle(a) {
		for (var i = a.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
		}
		return a;
	}
	function show(tile, g) {
		tile.dataset.game = g;
		tile.href = "/games/nomizo/descriptions/#" + g;
		tile.querySelector("img").src = "/thumbnails/" + g + ".png";
		tile.querySelector(".nm").textContent = NAMES[g];
	}

	function pace(el) {  // each tile its own swing, pace and starting point
		// the turning axis: any direction in the picture's plane, through its center
		var th = rnd(0, 2 * Math.PI);
		el.style.setProperty("--ax", Math.cos(th).toFixed(3));
		el.style.setProperty("--ay", Math.sin(th).toFixed(3));
		var sw = rnd(24, 34), lean = rnd(-5, 5), dur = rnd(6, 10);
		el.style.setProperty("--a0", (lean - sw).toFixed(1) + "deg");
		el.style.setProperty("--a1", (lean + sw).toFixed(1) + "deg");
		el.style.setProperty("--dur", dur.toFixed(1) + "s");
		el.style.setProperty("--delay", (-rnd(0, 2 * dur)).toFixed(1) + "s");
	}

	document.addEventListener("DOMContentLoaded", function () {
		document.querySelectorAll(".shelf img, .phone img").forEach(pace);
		var imgs = document.querySelectorAll(".thumb-col img");
		if (!imgs.length) return;
		imgs.forEach(function (img) {
			var tile = document.createElement("a");
			tile.className = "tile";
			tile.tabIndex = -1;
			tile.style.setProperty("--dx", rnd(-9, 9).toFixed(1) + "%");
			tile.style.setProperty("--rz", rnd(-5, 5).toFixed(1) + "deg");
			tile.style.setProperty("--s", rnd(0.84, 1.04).toFixed(3));
			pace(tile);
			var sway = document.createElement("span"); sway.className = "sway";
			var face = document.createElement("span"); face.className = "face";
			var nm = document.createElement("span"); nm.className = "nm";
			img.parentNode.insertBefore(tile, img);
			face.appendChild(img); sway.appendChild(face); tile.appendChild(sway); tile.appendChild(nm);
			show(tile, img.getAttribute("src").replace(/^.*\/|\.png$/g, ""));
		});
		// after theme.js has built the endless strip
		setTimeout(start, 0);
	});

	function visibleTiles() {
		var out = [];
		document.querySelectorAll(".thumb-col").forEach(function (col) {
			if (getComputedStyle(col).display === "none") return;
			var cr = col.getBoundingClientRect();
			var top = Math.max(0, cr.top), bot = Math.min(window.innerHeight, cr.bottom);
			col.querySelectorAll(".tile").forEach(function (t) {
				var r = t.getBoundingClientRect();
				if (r.bottom > top + 4 && r.top < bot - 4) out.push(t);
			});
		});
		return out;
	}

	function start() {
		// a fresh random selection on every visit
		var vis = visibleTiles(), pool = shuffle(GAMES.slice());
		vis.forEach(function (t, i) { show(t, pool[i % pool.length]); });
		var last = null;
		setInterval(function () {
			if (document.hidden) return;
			var tiles = visibleTiles().filter(function (t) { return t !== last && !t.matches(":hover"); });
			if (!tiles.length) return;
			var shown = {}, dup = null;
			visibleTiles().forEach(function (t) {
				if (shown[t.dataset.game] && tiles.indexOf(t) >= 0) dup = t;  // a game twice in view
				shown[t.dataset.game] = true;
			});
			var hidden = GAMES.filter(function (g) { return !shown[g]; });
			if (!hidden.length) return;
			var tile = dup || tiles[Math.floor(Math.random() * tiles.length)];
			last = tile;
			flip(tile, hidden[Math.floor(Math.random() * hidden.length)]);
		}, 2400);
	}

	function flip(tile, g) {
		var face = tile.querySelector(".face");
		var pre = new Image();
		pre.onload = function () {
			// each flip turns about its own random axis in the picture's plane
			var th = Math.random() * 2 * Math.PI;
			var ax = Math.cos(th).toFixed(3) + ", " + Math.sin(th).toFixed(3) + ", 0, ";
			face.animate([
				{ transform: "perspective(400px) rotate3d(" + ax + "0deg)", filter: "brightness(1)" },
				{ transform: "perspective(400px) rotate3d(" + ax + "90deg)", filter: "brightness(.55)" }
			], { duration: 330, easing: "ease-in" }).onfinish = function () {
				show(tile, g);
				face.animate([
					{ transform: "perspective(400px) rotate3d(" + ax + "-90deg)", filter: "brightness(.55)" },
					{ transform: "perspective(400px) rotate3d(" + ax + "0deg)", filter: "brightness(1)" }
				], { duration: 380, easing: "ease-out" });
			};
		};
		pre.src = "/thumbnails/" + g + ".png";
	}
}());
