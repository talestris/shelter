import "normalize.css";
import "./pets.scss";
import petsData from "../../assets/data/pets.json";

const imagesContext = require.context(
  "../../assets/images/",
  false,
  /\.(png|jpe?g|svg|webp)$/,
);

const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const overlay = document.querySelector(".header__overlay");
const body = document.body;
const menuLinks = document.querySelectorAll(".menu__link");

const cards = document.querySelector(".pets__cards");
const pagLeft = document.querySelector(".arrow-left");
const pagRight = document.querySelector(".arrow-right");
const jumpLeft = document.querySelector(".double-arrow-left");
const jumpRight = document.querySelector(".double-arrow-right");
const pageNumber = document.querySelector(".pagination__active");

let allCards = [];
let currentPage = 1;

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
  if (window.innerWidth >= 768) closeMenu();
  adjustPaginationOnResize();
});

function shuffleCards(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generate48Cards() {
  let masterArray = [];
  for (let i = 0; i < 6; i++) {
    const shuffledGroup = shuffleCards(petsData);
    masterArray.push(...shuffledGroup);
  }
  return masterArray;
}

function getCardsPerPage() {
  const width = window.innerWidth;
  if (width >= 1220) return 8;
  if (width >= 768) return 6;
  return 3;
}

function getTotalPages() {
  return 48 / getCardsPerPage();
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
    <article class="card" data-pet-name="${pet.name}>
      <img src="${imgSrc}" alt="${pet.name}" class="card__img">
      <h3 class="card__title">${pet.name}</h3>
      <button class="button button__second card__button" type="button" tabindex="1">Learn
      more</button>
    </article>
  `;
}

function renderCurrentPage() {
  const cardsPerPage = getCardsPerPage();
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const pageCards = allCards.slice(startIndex, endIndex);

  cards.style.opacity = "0";

  setTimeout(() => {
    cards.innerHTML = pageCards.map((pet) => createCardHtml(pet)).join("");
    cards.style.opacity = "1";
  }, 150);
  updatePaginationControls();
}

function updatePaginationControls() {
  const totalPages = getTotalPages();

  pageNumber.innerHTML = `<span>${currentPage}</span>`;

  if (currentPage === 1) {
    pagLeft.disabled = true;
    jumpLeft.disabled = true;
    pagLeft.classList.add("disabled");
    jumpLeft.classList.add("disabled");
  } else {
    pagLeft.disabled = false;
    jumpLeft.disabled = false;
    pagLeft.classList.remove("disabled");
    jumpLeft.classList.remove("disabled");
  }

  if (currentPage === totalPages) {
    pagRight.disabled = true;
    jumpRight.disabled = true;
    pagRight.classList.add("disabled");
    jumpRight.classList.add("disabled");
  } else {
    pagRight.disabled = false;
    jumpRight.disabled = false;
    pagRight.classList.remove("disabled");
    jumpRight.classList.remove("disabled");
  }
}

function adjustPaginationOnResize() {
  const totalPages = getTotalPages();
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  renderCurrentPage();
}

pagRight.addEventListener("click", () => {
  if (currentPage < getTotalPages()) {
    currentPage++;
    renderCurrentPage();
  }
});

pagLeft.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderCurrentPage();
  }
});

jumpLeft.addEventListener("click", () => {
  if (currentPage !== 1) {
    currentPage = 1;
    renderCurrentPage();
  }
});

jumpRight.addEventListener("click", () => {
  const totalPages = getTotalPages();
  if (currentPage !== totalPages) {
    currentPage = totalPages;
    renderCurrentPage();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  allCards = generate48Cards();
  renderCurrentPage();
});

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
      <div class="modal__header">
        <h3 class="modal__title">${pet.name}</h3>
        <h4 class="modal__subtitle">${pet.type} - ${pet.breed}</h4>
      </div>
      <p class="modal__description">${pet.description}</p>
      <ul class="modal__list">
        <li class="modal__list-item"><strong>Age:</strong> ${pet.age}</li>
        <li class="modal__list-item"><strong>Inoculations:</strong> ${pet.inoculations.join(", ")}</li>
        <li class="modal__list-item"><strong>Diseases:</strong> ${pet.diseases.join(", ")}</li>
        <li class="modal__list-item"><strong>Parasites:</strong> ${pet.parasites.join(", ")}</li>
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

cards.addEventListener("click", (event) => {
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
