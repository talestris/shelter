import "normalize.css";
import "./main.scss";

const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const overlay = document.querySelector(".header__overlay");
const body = document.body;
const menuLinks = document.querySelectorAll(".menu__link");

function openMenu() {
  burger.classList.toggle("open");
  nav.classList.toggle("open");
  overlay.classList.toggle("open");
  body.classList.toggle("noscroll");
}

function closeMenu() {
  burger.classList.remove("open");
  nav.classList.remove("open");
  overlay.classList.remove("open");
  body.classList.remove("noscroll");
}

burger.addEventListener("click", openMenu);

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

overlay.addEventListener("click", closeMenu);
