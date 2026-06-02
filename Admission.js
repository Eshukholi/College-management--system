const eventImages = [
  "images/event1.jpg",
  "images/event2.jpg",
  "images/event3.jpg",
  "images/event4.jpg"
];
let currentImage = 0;
const eventPhoto = document.getElementById("eventPhoto");
function changeEventPhoto() {
  currentImage = (currentImage + 1) % eventImages.length;
  eventPhoto.style.opacity = 0;
  setTimeout(() => {
    eventPhoto.src = eventImages[currentImage];
    eventPhoto.style.opacity = 1;
  }, 500);
}
setInterval(changeEventPhoto, 4000);
