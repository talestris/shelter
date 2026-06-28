import "normalize.css";
import "./main.scss";
import petsData from "../../assets/data/pets.json";

const imagesContext = require.context(
  "../../assets/images/",
  false,
  /\.(png|jpe?g|svg|webp)$/,
);

/*console.log(imagesContext.keys());*/

const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const overlay = document.querySelector(".header__overlay");
const body = document.body;
const menuLinks = document.querySelectorAll(".menu__link");
const btnLeft = document.querySelector(".arrow-left");
const btnRight = document.querySelector(".arrow-right");
const track = document.querySelector("#slider-track");

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
let isAnimationRunning = false;

function shuffleCards(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getCardsCount() {
  const width = window.innerWidth;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function createCardHtml(pet) {
  const imgName = pet.img.split("/").pop();

  let imgSrc = "";

  try {
    const contextResult = imagesContext(`./${imgName}`);
    imgSrc = contextResult.default || contextResult;
  } catch (err) {
    console.error(`Failed to load image for ${pet.name}:`, err);
  }

  return `
    <article class="card" data-pet-name="${pet.name}">
      <img src="${imgSrc}" alt="${pet.name}" class="card__img">
      <h3 class="card__title">${pet.name}</h3>
      <button class="button button__second card__button" type="button" tabindex="1">Learn
      more</button>
    </article>
  `;
}

function renderCards(cardsArray, position = "append") {
  const htmlContent = cardsArray.map((pet) => createCardHtml(pet)).join("");
  if (position === "append") {
    track.insertAdjacentHTML("beforeend", htmlContent);
  } else {
    track.insertAdjacentHTML("afterbegin", htmlContent);
  }
}

function getNextCards() {
  const count = getCardsCount();
  const availablePets = petsData.filter((pet) => {
    return !currentCards.some((currentPet) => currentPet.name === pet.name);
  });
  const shuffledAvailablePets = shuffleCards(availablePets);
  nextCards = shuffledAvailablePets.slice(0, count);
}

function moveSlider(direction) {
  if (isAnimationRunning) return;
  isAnimationRunning = true;

  getNextCards();

  if (direction === "next") {
    renderCards(nextCards, "append");
    track.style.transform = `translateX(-50%)`;
  } else {
    renderCards(nextCards, "afterbegin");
    track.style.transition = "none";
    track.style.transform = `translateX(-50%)`;

    setTimeout(() => {
      track.style.transition = "transform 0.3s ease-in-out";
      track.style.transform = `translateX(0)`;
    }, 50);
  }

  track.addEventListener("transitionend", function endAnimation() {
    track.removeEventListener("transitionend", endAnimation);
    track.style.transition = "none";

    track.innerHTML = "";
    renderCards(nextCards, "append");
    track.style.transform = `translateX(0)`;

    setTimeout(() => {
      track.style.transition = "transform 0.3s ease-in-out";
      currentCards = nextCards;
      isAnimationRunning = false;
    }, 50);
  });
}

btnRight.addEventListener("click", () => moveSlider("next"));
btnLeft.addEventListener("click", () => moveSlider("prev"));

function initSlider() {
  currentCards = shuffleCards(petsData).slice(0, getCardsCount());
  renderCards(currentCards, "append");
}

document.addEventListener("DOMContentLoaded", () => initSlider());

const modalOverlay = document.querySelector("#modal-overlay");
const modalContent = document.querySelector("#modal-content");
const modalCloseBtn = document.querySelector("#modal-close-btn");

function fillModalData(petName) {
  const pet = petsData.find((p) => p.name === petName);
  if (!pet) return;

  const imgName = pet.img.split("/").pop();
  let imgSrc = "";
  try {
    const contextResult = imagesContext(`./${imgName}`);
    imgSrc = contextResult.default || contextResult;
  } catch (err) {
    console.error(err);
  }

  modalContent.innerHTML = `
    <img src="${imgSrc}" alt="${pet.name}" class="modal__img">
    <div class="modal__info">
      <h3 class="modal__title">${pet.name}</h3>
      <h4 class="modal__subtitle">${pet.type} - ${pet.breed}</h4>
      <p class="modal__description">${pet.description}</p>
      <ul class="modal__list">
        <li><strong>Age:</strong>${pet.age}</li>
        <li><strong>Inoculations:</strong>${pet.inoculations.join(", ")}</li>
        <li><strong>Diseases:</strong>${pet.diseases.join(", ")}</li>
        <li><strong>Parasites:</strong>${pet.parasites.join(", ")}</li>
      </ul>
    </div>
  `;
}

function openModal(petName) {
  fillModalData(petName);
  modalOverlay.classList.add("open");
  body.classList.add("noscroll");
}

function closeModal() {
  modalOverlay.classList.remove("open");
  if (!nav.classList.contains("open")) {
    body.classList.remove("noscroll");
  }
}

track.addEventListener("click", (event) => {
  const cardElement = event.target.closest(".card");

  if (cardElement) {
    const petName = cardElement.getAttribute("data-pet-name");
    openModal(petName);
  }
});

modalCloseBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});
