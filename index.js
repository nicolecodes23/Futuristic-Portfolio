
//javascript for playing and pausing music
//wait until DOM content fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
    //selects music container
    const musicBox = document.querySelector(".music-container");
    //selects icon inside music container
    const musicIcon = document.querySelector(".bxs-volume-mute");
    //selects background music by ID
    const bgMusic = document.getElementById("bgMusic");
    //boolean to check if music is playing
    let musicPlaying = false;

    //function to toggle music to play or pause
    function toggleMusic() {
        if (musicPlaying) {
            //pauses background music
            bgMusic.pause();
            musicIcon.classList.add('bxs-volume-mute'); //change icon to muted speaker
            musicIcon.classList.remove('bxs-volume-full'); // remove icon that is blasted speaker
        } else {
            //plays background music 
            bgMusic.play();
            musicIcon.classList.remove('bxs-volume-mute'); //remove icon that is muted speaker
            musicIcon.classList.add('bxs-volume-full'); //change icon to blasted speaker
        }

        //toggle music playing state 
        musicPlaying = !musicPlaying;
    }

    //clicking on the music container will toggle function above
    musicBox.addEventListener("click", toggleMusic);
});


//javascript for poster interaction including poster switching and spotlight
const posterContainer = document.querySelector('.poster-container'); //selects poster container
const posters = document.querySelectorAll(".poster"); // select all the 3 poster elements

let currentPosterIndex = 0;//keeps track of which poster we are at

// Wait until the DOM content is fully loaded before running this function
document.addEventListener('DOMContentLoaded', function () {

    //function to let user know poster is changed
   function switchPoster() {
       console.log('Poster clicked');
   }


   posterContainer.addEventListener("click", switchPoster);
});

// Function to create spotlight effect on mouse movement
function spotlight(e) {
    const rect = posterContainer.getBoundingClientRect(); // Get poster container position and size
    const x = e.clientX - rect.left; // Calculate X position of the mouse relative to the container
    const y = e.clientY - rect.top; // Calculate Y position of the mouse relative to the container
 
    // Determine the next poster to display based on the current active poster
    const nextPosterIndex = (currentPosterIndex + 1) % posters.length; // Loop through posters
    const nextPoster = posters[nextPosterIndex]; // Get the next poster to activate
 
    // Loop through all posters and apply the appropriate styles
    posters.forEach(poster => {
        posters[currentPosterIndex].classList.remove('active'); // Remove active class from current poster
        posters[nextPosterIndex].classList.add('active'); // Add active class to the next poster
        if (poster.classList.contains("active")) {
            // If the poster is active, apply the clip-path style to reveal it in a circular shape based on mouse position
            nextPoster.style.clipPath = `circle(100px at ${x}px ${y}px)`;
        }
    });
 }
 
 // Function to update the colors of the quick links based on the active poster
 function updateQuickLinksColor() {
     const quickLinkContainer = document.querySelector('.quick-link-container'); // Select quick link container
     const linkContainer = document.querySelector('.link-container'); // Select link container
     const links = document.querySelectorAll('.link'); // Select all link elements
     const h3 = document.querySelector('.link-container h3'); // Select the h3 heading
     const body = document.querySelector("body");
 
     // Get the active poster and its background color
     const activePoster = document.querySelector('.poster.active');
     const posterBackgroundColor = window.getComputedStyle(activePoster).backgroundColor; // Get the background color of the active poster
     const h1Color = window.getComputedStyle(activePoster.querySelector('h1')).color; // Get the color of the h1 inside the active poster
 
     // Update the background color of the quick-link container and link container
     quickLinkContainer.style.backgroundColor = posterBackgroundColor;
     linkContainer.style.backgroundColor = posterBackgroundColor;
     body.style.backgroundColor = posterBackgroundColor;
 
     // Update the color and border of all links
     links.forEach(link => {
         link.style.color = h1Color;
         link.style.borderColor = h1Color;
     });
 
     // Update the color of the h3 heading
     h3.style.color = h1Color;
 }
 
 // Function to switch between posters
 function switchPoster() {
    let nextPosterIndex = (currentPosterIndex + 1) % posters.length; // Determine the next poster index
 
    // Get current and next poster elements
    let currentPoster = posters[currentPosterIndex];
    let nextPoster = posters[nextPosterIndex];
 
    // Reveal the next poster by setting clip-path to fully visible
    nextPoster.style.clipPath = 'circle(100% at 50% 50%)';
 
    // Hide the current poster by setting clip-path to 0%
    currentPoster.style.clipPath = 'circle(0% at 50% 50%)';
 
    // Update the current poster index
    currentPosterIndex = nextPosterIndex;
 
    updateQuickLinksColor(); // Update the colors of quick links to match the active poster
 
    // Update the music icon color based on the next poster's h1 color
    const nextPosterH1 = nextPoster.querySelector('h1');
    if (nextPosterH1) {
        const h1Color = window.getComputedStyle(nextPosterH1).color;
        musicIcon.style.color = h1Color;
    }
 }
 
 // Event listeners for poster switching and mouse interaction
 posterContainer.addEventListener("click", switchPoster); // Click event to switch poster
 posterContainer.addEventListener('mousemove', spotlight); // Mousemove event to trigger spotlight effect
 posterContainer.addEventListener('mouseleave', () => {
    const nextPosterIndex = (currentPosterIndex + 1) % posters.length;
    posters[nextPosterIndex].style.clipPath = 'circle(0% at 50% 50%)'; // Reset the clip-path when mouse leaves
 });
 
 // Hover effect for quick links
 document.querySelectorAll('.link').forEach(link => {
     // Populate link content with heading, subheading, image, and icon
     link.innerHTML = `
         <div class="text-container">
             <div class="link-heading">${link.getAttribute('data-heading')}</div>
             <div class="link-subheading">${link.getAttribute('data-subheading')}</div>
         </div>
         <img src="${link.getAttribute('data-imgsrc')}" alt="Image for ${link.getAttribute('data-heading')}">
         <div class="icon">&rarr;</div>
     `;
 
     const img = link.querySelector('img'); // Select image inside the link
     const heading = link.querySelector('.link-heading'); // Select the heading inside the link
 
     // Mousemove event to adjust the position of the image within the link
     link.addEventListener('mousemove', (e) => {
         const linkRect = link.getBoundingClientRect(); // Get link position and size
         const imgX = linkRect.width * 0.6; // Position the image at 60% of the link's width
         const headingRect = heading.getBoundingClientRect();
 
         img.style.left = `${imgX}px`; // Update the image's X position
         img.style.transform = `translateY(-50%) rotate(12.5deg)`; // Apply a slight rotation and translation to the image
     });
 });
 
 // Functionality to show quick links as the user scrolls
 document.addEventListener('DOMContentLoaded', function () {
     const quickLinkContainer = document.querySelector('.quick-link-container'); // Select quick link container
     const mainContainer = document.querySelector('.main-container'); // Select main container
     const maxScrollHeight = mainContainer.offsetHeight; // Get the total height of the main container
 
     // Scroll event to reveal quick-link container as the user scrolls
     window.addEventListener('scroll', function () {
         const scrollPosition = window.scrollY; // Get current scroll position
         const windowHeight = window.innerHeight; // Get the height of the visible window
 
         // Calculate the scroll factor relative to the main container's height
         const scrollFactor = scrollPosition / (maxScrollHeight - windowHeight);
 
         // If the scroll factor is between 0 and 1, move the quick-link container upwards
         if (scrollFactor >= 0 && scrollFactor <= 1) {
             const translateY = Math.min(100, scrollFactor * 100); // Calculate how much to move the quick-link container upwards
             quickLinkContainer.style.transform = `translateY(${translateY}vh)`; // Apply the transformation
         }
     });
 });