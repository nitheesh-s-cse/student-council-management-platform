// Runs before hydration to avoid a flash of the wrong theme.
// The site is light / off-white by default. Dark is only ever applied when
// the user has explicitly chosen "Dark" in the theme menu (ppgc-theme=dark).
// System preference and OS colour scheme no longer force a dark canvas.
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('ppgc-theme');
    var isDark = stored === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
