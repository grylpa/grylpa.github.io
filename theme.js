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
	});
}());
