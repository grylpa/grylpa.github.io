(function () {
	var KEY = 'grylpa-theme';
	var saved = null;
	try { saved = localStorage.getItem(KEY); } catch (e) {}
	var theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
	document.documentElement.setAttribute('data-theme', theme);

	function apply(t) {
		document.documentElement.setAttribute('data-theme', t);
		try { localStorage.setItem(KEY, t); } catch (e) {}
	}

	document.addEventListener('DOMContentLoaded', function () {
		var btn = document.createElement('button');
		btn.id = 'theme-toggle';
		btn.type = 'button';

		function relabel() {
			var cur = document.documentElement.getAttribute('data-theme');
			btn.textContent = cur === 'dark' ? '☀' : '☾';
			btn.setAttribute('aria-label', 'switch to ' + (cur === 'dark' ? 'light' : 'dark') + ' theme');
		}

		relabel();
		btn.addEventListener('click', function () {
			var cur = document.documentElement.getAttribute('data-theme');
			apply(cur === 'dark' ? 'light' : 'dark');
			relabel();
		});

		var heading = document.querySelector('.page-heading');
		if (heading) {
			var nav = heading.querySelector('.quicklinks');
			heading.insertBefore(btn, nav || null);
		} else {
			document.body.appendChild(btn);
		}

		// Cyclic (endless, both-directions) scrolling for the right thumbnail strip.
		// We triple the image list and rest in the MIDDLE copy, so there is always
		// a full copy of headroom above and below. Whenever the scroll position
		// drifts out of the middle band we silently jump back by one copy's height —
		// the copies are identical, so the jump is invisible.
		var strip = document.querySelector('.thumb-right');
		var inner = strip && strip.querySelector('.thumb-scroll');
		if (inner && inner.children.length) {
			var base = inner.children.length;
			var frag = document.createDocumentFragment();
			for (var c = 0; c < 2; c++) {
				for (var i = 0; i < base; i++) {
					frag.appendChild(inner.children[i].cloneNode(true));
				}
			}
			inner.appendChild(frag); // now 3 identical copies

			var cycle = 0;
			function recenter() {
				cycle = inner.children[base].offsetTop - inner.children[0].offsetTop;
				if (cycle > 0) strip.scrollTop = cycle; // rest in the middle copy
			}
			recenter();
			window.addEventListener('resize', recenter);
			strip.addEventListener('scroll', function () {
				if (cycle <= 0) return;
				if (strip.scrollTop >= 2 * cycle) {
					strip.scrollTop -= cycle;
				} else if (strip.scrollTop < cycle) {
					strip.scrollTop += cycle;
				}
			}, { passive: true });
		}
	});
}());
