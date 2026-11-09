
const images = [
  { src: "assets/Inspo_1.jpeg", label: "Jasleen Kaur, 'He walked like he owned himself', 2018" },
  { src: "assets/Inspo_2.jpg", label: "" },
  { src: "assets/Inspo_3.png", label: "" },
  { src: "assets/Inspo_5.jpeg", label: "M.I.A.'s 'XXXO' Niqab, 2010" },
  { src: "assets/Inspo_4.png", label: "" },
  { src: "assets/Inspo_6.png", label: "" },
  { src: "assets/Inspo_7.png", label: "" },
  { src: "assets/Inspo_8.png", label: "" }
];

// ELEMENTS

const track = document.getElementById("carouselTrack");
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("largeImage");
const closeButton = document.getElementById("closeLightbox");
const zoomButton = document.getElementById("zoomButton");

let currentIndex = images.length;
let isMoving = false;


// CREATE CAROUSEL IMAGE WITH LABEL

function createImage(image) {

  const wrapper = document.createElement("div");
  wrapper.className = "carousel-item";

  const img = document.createElement("img");

  img.src = image.src;
  img.alt = image.label || "Jacket inspiration";
  img.className = "carousel-image";

  // CLICK IMAGE TO ENLARGE
  img.addEventListener("click", () => {

    largeImage.src = image.src;
    largeImage.classList.remove("zoomed");

    zoomButton.setAttribute("aria-label", "Zoom in");

    lightbox.classList.add("active");
  });

  // IMAGE LABEL
  const caption = document.createElement("p");
  caption.className = "image-label";
  caption.textContent = image.label;

  wrapper.appendChild(img);
  wrapper.appendChild(caption);

  return wrapper;
}


// BUILD INFINITE CAROUSEL

function buildCarousel() {

  // Make three copies of all images
  // so we can loop in both directions

  for (let repeat = 0; repeat < 3; repeat++) {

    images.forEach(image => {
      track.appendChild(createImage(image));
    });

  }

  currentIndex = images.length;

  // Wait until the images have loaded
  // before calculating their positions

  const allImages = track.querySelectorAll("img");

  Promise.all(
    [...allImages].map(img => {

      if (img.complete) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });

    })
  ).then(() => {
    moveToCurrent(false);
  });

}


// GET CURRENT IMAGE POSITION

function getImagePosition(index) {

  const items = track.querySelectorAll(".carousel-item");

  return items[index].offsetLeft - items[0].offsetLeft;
}


// MOVE CAROUSEL

function moveToCurrent(animate = true) {

  track.style.transition = animate
    ? "transform 0.45s ease"
    : "none";

  const position = getImagePosition(currentIndex);

  track.style.transform = `translateX(-${position}px)`;
}


// NEXT IMAGE

nextButton.addEventListener("click", () => {

  if (isMoving) return;

  isMoving = true;

  currentIndex++;

  moveToCurrent();

});


// PREVIOUS IMAGE

prevButton.addEventListener("click", () => {

  if (isMoving) return;

  isMoving = true;

  currentIndex--;

  moveToCurrent();

});


// RESET TO MIDDLE COPY FOR INFINITE LOOP

track.addEventListener("transitionend", event => {

  if (event.propertyName !== "transform") return;

  if (currentIndex >= images.length * 2) {

    currentIndex -= images.length;

    moveToCurrent(false);

  }

  if (currentIndex < images.length) {

    currentIndex += images.length;

    moveToCurrent(false);

  }

  isMoving = false;

});


// CLOSE ENLARGED IMAGE

function closeLightbox() {

  lightbox.classList.remove("active");

  largeImage.classList.remove("zoomed");

  largeImage.removeAttribute("src");

  zoomButton.setAttribute("aria-label", "Zoom in");

}

closeButton.addEventListener("click", closeLightbox);


// CLICK OUTSIDE IMAGE TO CLOSE

lightbox.addEventListener("click", event => {

  if (event.target === lightbox ||
      event.target.classList.contains("lightbox-image-container")) {

    closeLightbox();

  }

});


// ZOOM BUTTON

zoomButton.addEventListener("click", () => {

  largeImage.classList.toggle("zoomed");

  const isZoomed = largeImage.classList.contains("zoomed");

  zoomButton.setAttribute(
    "aria-label",
    isZoomed ? "Zoom out" : "Zoom in"
  );

});


// KEYBOARD CONTROLS

document.addEventListener("keydown", event => {

  // ESCAPE CLOSES ENLARGED IMAGE

  if (event.key === "Escape") {

    closeLightbox();
    return;

  }

  // DON'T MOVE CAROUSEL WHILE IMAGE IS OPEN

  if (lightbox.classList.contains("active")) return;

  if (event.key === "ArrowRight") {
    nextButton.click();
  }

  if (event.key === "ArrowLeft") {
    prevButton.click();
  }

});


// KEEP CAROUSEL POSITION ON WINDOW RESIZE

window.addEventListener("resize", () => {

  moveToCurrent(false);

});


// START CAROUSEL

buildCarousel();


// CLICK IMAGE TREATMENTS TO ENLARGE

const treatmentImages = document.querySelectorAll(
  ".treatment-item img"
);

treatmentImages.forEach(img => {

  img.addEventListener("click", () => {

    // Use the same lightbox as the carousel
    largeImage.src = img.src;
    largeImage.alt = img.alt;

    // Reset zoom when opening a new image
    largeImage.classList.remove("zoomed");

    zoomButton.setAttribute("aria-label", "Zoom in");

    // Open enlarged image
    lightbox.classList.add("active");

  });

});


