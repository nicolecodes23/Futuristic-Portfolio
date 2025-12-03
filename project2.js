import { projects } from "./projects.js";
import { lerp } from "./utils.js";

// Select various DOM elements for manipulation
const content = document.querySelector(".content");
const contentImage = document.querySelector(".content-img");
const contentHeader = document.querySelector(".info-header");
const contentText = document.querySelector(".info-text");
const returnBtn = document.querySelector(".close");
const projectContainer = document.querySelector(".project-container");
const columns = [...document.querySelectorAll(".column")];
const contentShowcase = document.querySelector(".info-showcase");

//1 Javascript to dynamically add item to the column, as well as handling closing of each info-container
// Array to store project objects
let projectsArray = [];
let isAnimating = true; // Flag to control animations

// Class representing a Project
class Project {
    constructor(image, index, title, content, color) {
        this.image = image;
        this.index = index;
        this.title = title;
        this.content = content;
        this.color = color;
        this.active = false; // State to track whether the project is active or not
        this.createItem(); // Create the grid item for this project
    }

    // Function to create each project grid item dynamically
    createItem() {
        this.gridItem = document.createElement("div");
        this.gridItem.classList.add("item");

        // Add image to the grid item
        this.img = document.createElement("img");
        this.img.src = this.image;
        this.gridItem.appendChild(this.img);

        // Append the grid item to the appropriate column (based on index)
        let i = this.index % columns.length;
        columns[i].appendChild(this.gridItem);

        // Add event listener to activate the project when clicked
        this.gridItem.addEventListener("click", this.activate.bind(this));
    }

    // Function to activate and show the project in full view
    activate() {
        contentImage.scrollTop = 0;
        this.active = true;
        isAnimating = false; // Stop background animation

        // Hide all other projects
        for (let i = 0; i < projectsArray.length; i++) {
            if (projectsArray[i].index !== this.index) {
                projectsArray[i].gridItem.style.opacity = 0;
            }
        }

        // Get the grid item's position and calculate its transformation
        let { left, top, width, height } = this.gridItem.getBoundingClientRect();
        let x = (window.innerWidth / 2) - (left + (width / 2));
        let y = (window.innerHeight / 2) - (top + (height / 2)) - (window.innerHeight * 0.1);

        // If the project is active, enlarge it and hide the image in the grid
        if (this.active) {
            this.gridItem.style.transform = `translate3d(${x}px, ${y}px,0) scale(4)`;
            this.gridItem.querySelector('img').style.opacity = 0; // Hide the grid image

            // Set content for the detailed view
            contentHeader.innerHTML = "";
            contentText.innerHTML = "";
            contentImage.src = this.image;
            let header = document.createElement("h1");
            header.textContent = this.title;
            contentHeader.appendChild(header);

            // Apply the specific color to the content
            contentHeader.style.color = this.color;
            contentText.style.color = this.color;
            returnBtn.style.backgroundColor = this.color;
            contentShowcase.style.backgroundColor = this.color;

            // Populate content text
            for (let i = 0; i < this.content.length; i++) {
                let text = document.createElement("p");
                text.textContent = this.content[i];
                contentText.appendChild(text);
            }

            // Show the content section after a delay
            setTimeout(() => {
                content.classList.add("active");
            }, 500);
        }
    }

    // Function to deactivate the project and return to the grid view
    deactivate() {
        this.active = false;
        this.gridItem.style.transform = `translate3d(0,0,0) scale(1)`; // Reset position and scale
        this.gridItem.style.opacity = 1;
        this.gridItem.querySelector('img').style.opacity = 1; // Show the grid image again
    }
}

// Initialize all projects and create them dynamically in the grid
projects.forEach((project, index) => {
    let newProject = new Project(project.image, index, project.title, project.content, project.color);
    projectsArray.push(newProject);
});

// Event listener to handle closing the detailed project view
returnBtn.addEventListener("click", () => {
    content.classList.remove("active"); // Hide the content section
    projectContainer.scrollTop = 0; // Reset scroll position

    setTimeout(() => {
        isAnimating = true; // Resume background animation after closing
    }, 500);

    // Deactivate all projects and reset their states
    for (let i = 0; i < projectsArray.length; i++) {
        projectsArray[i].deactivate();
    }
});


//2 Javascript to move the project map around 
// Mousemove event to track mouse movement and apply the movement to the grid
// Coordinates for mouse and touch movements
let mouseCoordinates = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
};

// Variables to track touch start positions
let isDragging = false;
let touchStartX = 0;
let touchStartY = 0;

// Update target coordinates based on mouse position (Desktop)
window.addEventListener("mousemove", (e) => {
    if (!isDragging) { // Only move with the mouse if not dragging with touch
        mouseCoordinates.targetX = (e.clientX - window.innerWidth / 2) * 0.5; // Scale movement horizontally
        mouseCoordinates.targetY = (e.clientY - window.innerHeight / 2) * 0.7; // Scale movement vertically
    }
});

// Handle touch events for mobile devices
window.addEventListener("touchstart", (e) => {
    isDragging = true; // User has started dragging
    const touch = e.touches[0];
    touchStartX = touch.clientX - mouseCoordinates.x;
    touchStartY = touch.clientY - mouseCoordinates.y;
});

window.addEventListener("touchmove", (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        mouseCoordinates.targetX = touch.clientX - touchStartX;
        mouseCoordinates.targetY = touch.clientY - touchStartY;
    }
});

window.addEventListener("touchend", () => {
    isDragging = false; // Stop dragging
});

// Animation loop to smoothly move the project grid based on both mouse and touch coordinates
function animation() {
    if (isAnimating) {
        // Interpolate current position towards target position for smooth motion
        mouseCoordinates.x = lerp(mouseCoordinates.x, mouseCoordinates.targetX, 0.03);
        mouseCoordinates.y = lerp(mouseCoordinates.y, mouseCoordinates.targetY, 0.03);

        let { x, y } = mouseCoordinates;

        // Apply translation to the project container based on the updated coordinates
        projectContainer.style.transform = `translate3d(${-x}px, ${-y}px,0)`;
    }

    // Recursively call the animation function
    window.requestAnimationFrame(animation);
}
animation(); // Start the animation loop



// 3 Intersection Observer for the title animation
let title = document.querySelector(".title-container h1");

let options = {
    rootMargin: "-25%",
    threshold: 0.0
};

// Create an observer to trigger the title animation when in view
let observer = new IntersectionObserver(showTitle, options);

// Function to handle title visibility and the transition between title and main content
function showTitle(entries) {
    let entry = entries[0];
    let letters = [...entry.target.querySelectorAll('span')];
    const mainItems = document.querySelectorAll('main .item'); // Select all items in main

    if (entry.isIntersecting) {
        // When the title is in view, animate the letters
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.classList.add("active");
            }, index * 10); // Sequentially animate each letter
        });
        entry.target.children[0].classList.add("active");

        // Hide the main content while the title is visible
        mainItems.forEach((item) => {
            item.classList.remove('show'); // Hide items before setting display none
        });
        setTimeout(() => {
            document.querySelector('main').style.display = 'none';
        }, 500); // Wait for the fade-out effect to complete

    } else {
        // When the title is out of view, reset the letters and show the main content
        letters.reverse().forEach((letter, index) => {
            setTimeout(() => {
                letter.classList.remove("active");
            }, index * 50); // Reverse the animation
            entry.target.classList.remove("active");
        });

        // Gradually show the main content
        document.querySelector('main').style.display = 'block';
        mainItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show'); // Show each item with a delay
            }, index * 300); // Stagger the reveal of each item
        });
    }
}

observer.observe(title); // Start observing the title for visibility changes
