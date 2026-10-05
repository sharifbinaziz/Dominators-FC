document.addEventListener("DOMContentLoaded", function () {
  var btn = document.querySelector(".menu");
  var nav = document.querySelector("header nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Close" : "Menu";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.textContent = "Menu"; });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "Menu";
      }
    });
  }
  var box = document.querySelector(".lightbox");
  if (!box) return;
  var img = box.querySelector("img");
  document.addEventListener("click", function (e) {
    var shot = e.target.closest("[data-full]");
    if (shot) {
      img.src = shot.getAttribute("data-full");
      img.alt = (shot.querySelector("img") && shot.querySelector("img").alt) || "Club photo";
      box.classList.add("open");
      return;
    }
    if (e.target === box || (e.target.closest && e.target.closest(".lightbox button"))) box.classList.remove("open");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") box.classList.remove("open");
  });
});
