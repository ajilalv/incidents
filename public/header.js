window.addEventListener("DOMContentLoaded", event => {
  var bar = document.querySelector(".navBar");
  var loc = window.location.href;
  var items = bar.children[0].children;
  if (loc.indexOf("new") > 1) items[0].classList.add("active");
  else if (loc.indexOf("mypage") > 1) items[2].classList.add("active");
  else items[1].classList.add("active");
});
