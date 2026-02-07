const THEME_KEY = "theme";

export function applyTheme() {
	let savedTheme = localStorage.getItem(THEME_KEY);
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
	function setTheme(event?: MediaQueryListEvent) {
		if (!savedTheme) {
			if (event) savedTheme = event.matches ? "dark" : "light";
			if (!event) savedTheme = prefersDark.matches ? "dark" : "light";
		}
		const isDark = savedTheme === "dark";
		document.documentElement.classList.toggle("dark", isDark);
		document.documentElement.setAttribute(
			"data-theme",
			isDark ? "dark" : "light",
		);
	}
	setTheme();
	prefersDark.addEventListener("change", setTheme);
}

export function toggleTheme() {
	const isDarkMode = document.documentElement.classList.contains("dark");
	if (isDarkMode) {
		document.documentElement.classList.remove("dark");
		document.documentElement.setAttribute("data-theme", "light");
		localStorage.setItem(THEME_KEY, "light");
	} else {
		document.documentElement.classList.add("dark");
		document.documentElement.setAttribute("data-theme", "dark");
		localStorage.setItem(THEME_KEY, "dark");
	}
}
