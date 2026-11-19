// EventWale — if a remote photo fails to load, show the local neon placeholder instead of a blank box.
(function () {
  var FALLBACK = "eventwale-image-fallback.svg";

  function fixImg(img) {
    if (img.dataset.fallbackDone) return;
    img.dataset.fallbackDone = "1";
    img.removeAttribute("srcset");
    img.src = FALLBACK;
  }
  function watchImg(img) {
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fixImg(img);
    img.addEventListener("error", function () { fixImg(img); }, { once: true });
  }
  function urlOf(el) {
    var m = /url\(["']?(https?:[^"')]+)["']?\)/.exec(getComputedStyle(el).backgroundImage || "");
    return m ? m[1] : null;
  }
  function watchBg(el) {
    var u = urlOf(el);
    if (!u) return;
    var probe = new Image();
    probe.onerror = function () { el.classList.add("img-fallback"); };
    probe.src = u;
  }
  function run() {
    document.querySelectorAll("img").forEach(function (img) {
      if (/logo|icon/i.test(img.getAttribute("src") || "")) return;
      watchImg(img);
    });
    document.querySelectorAll(
      ".venue-image, .event-card-image, .category-image, .service-image, .why-choose-image"
    ).forEach(watchBg);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
  window.addEventListener("load", run);
})();
