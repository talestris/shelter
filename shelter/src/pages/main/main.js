import "normalize.css";
import "./main.scss";
import petsData from "../../assets/data/pets.json";

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

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
});

let currentCards = [];
let nextCards = [];

function shuffleCards(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], (newArray[j] = newArray[j]), newArray[i]];
  }
  return newArray;
}

function getCardsCount() {
  const width = window.innerWidth;
  if (width >= 1280) return 3;
  if (width >= 1024) return 2;
  if (width >= 767) return 1;
}

function getNextCards() {
  const count = getCardsCount();
  const availablePets = petsData.filter((pet) => {
    return !currentCards.some((currentPet) => currentPet.name === pet.name);
  });
  const shuffledAvailablePets = shuffle(availablePets);
  nextCards = shuffledAvailablePets.slice(0, count);
}

function initSlider() {
  const count = getCardsCount();
  currentCards = shuffle(petsData).slice(0, count);
}
