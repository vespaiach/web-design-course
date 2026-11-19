// Turns the nav into a menu on narrow screens (base.css decides where).
// Without this script, the Menu button stays hidden and the nav stays visible.
const button = document.querySelector(".menu-button");
const nav = button.nextElementSibling;
button.hidden = false;
button.ariaExpanded = "false";
button.addEventListener("click", () => {
  button.ariaExpanded = button.ariaExpanded === "true" ? "false" : "true";
});
// Close when focus leaves the menu, so the open menu never covers the focused element (WCAG 2.4.11)
nav.addEventListener("focusout", (event) => {
  if (event.relatedTarget !== button && !nav.contains(event.relatedTarget)) button.ariaExpanded = "false";
});
// Esc closes the menu and puts focus back on its button, as Esc closes the browser's own popovers
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && button.ariaExpanded === "true") {
    button.ariaExpanded = "false";
    button.focus();
  }
});
