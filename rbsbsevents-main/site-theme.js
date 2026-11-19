// Apply cached theme immediately, then keep it synchronized with Firebase.

const defaults = {
  primary: "#14243A", accent: "#C5A46D", background: "#FAF8F3",
  surface: "#FFFFFF", text: "#273444", muted: "#667085", border: "#E7E2D8",
  siteName: "EventWale"
};
const validHex = value => /^#[0-9a-f]{6}$/i.test(String(value || ""));
const CACHE_KEY = "rbsb_site_theme_v1";

function applyPublishedTheme(data, cache) {
  const theme = { ...defaults, ...(data || {}) };
  const root = document.documentElement;
  const variables = {
    primary: "--primary", accent: "--accent", background: "--page-bg",
    surface: "--surface", text: "--text", muted: "--muted", border: "--border"
  };
  const palette = {};
  Object.entries(variables).forEach(([key, cssName]) => {
    palette[key] = validHex(theme[key]) ? theme[key] : defaults[key];
    root.style.setProperty(cssName, palette[key]);
  });
  // The EventWale logo, page titles and favicon are fixed brand assets and are
  // intentionally NOT rewritten from the saved theme any more.
  if (cache) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(theme)); } catch (error) { console.warn("Theme cache unavailable", error); }
  }
}

// Theme customization has been removed from the admin panel; always use the
// default palette and drop any previously cached custom theme.
try { localStorage.removeItem(CACHE_KEY); } catch (_) {}
applyPublishedTheme(defaults, false);
