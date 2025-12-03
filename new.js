// 1 Javascript to change background color based on scroll position
window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY; // Get the current scroll position
    const totalScrollHeight = document.body.scrollHeight - window.innerHeight; // Calculate the total scrollable height

    const scrollFraction = scrollPosition / totalScrollHeight; // Get the fraction of how much has been scrolled

    // Define a series of colors to transition through as you scroll
    const colors = [
        [239, 222, 205], // Light Beige (RGB: 239, 222, 205)
        [244, 194, 194], // Light Pink (RGB: 244, 194, 194)
        [244, 194, 194], // Light Pink (RGB: 244, 194, 194)
        [19, 18, 57],    // Dark Navy Blue (RGB: 19, 18, 57)
        [19, 18, 57],    // Dark Navy Blue (RGB: 19, 18, 57)
        [19, 18, 57],    // Dark Navy Blue (RGB: 19, 18, 57)
        [19, 18, 57],    // Dark Navy Blue (RGB: 19, 18, 57)
        [19, 18, 57],    // Dark Navy Blue (RGB: 19, 18, 57)
        [97, 96, 154],   // Lavender Blue (RGB: 97, 96, 154)
        [97, 96, 154],   // Lavender Blue (RGB: 97, 96, 154)
        [239, 222, 205]  // Light Beige (RGB: 239, 222, 205)
    ];

    // Determine which color segment we are in based on scroll fraction
    const colorSegment = Math.min(Math.floor(scrollFraction * (colors.length - 1)), colors.length - 2);
    const segmentFraction = (scrollFraction - (colorSegment / (colors.length - 1))) * (colors.length - 1);

    // Interpolate between the start and end colors of the current segment
    const startColor = colors[colorSegment];
    const endColor = colors[colorSegment + 1];
    const newColor = startColor.map((start, index) => {
        return Math.round(start + (endColor[index] - start) * segmentFraction);
    });

    // Apply the new background color to the body
    document.body.style.backgroundColor = `rgb(${newColor.join(',')})`;
});



//2 Javascript for title transition 
// Text transition effect when list items come into view
let listItems = [...document.querySelectorAll("li")]; // Select all 'li' elements

// Set up IntersectionObserver options
let options = {
    rootMargin: "-10%", // Trigger the observer slightly before the element enters the viewport
    threshold: 0.0 // Trigger the observer as soon as any part of the element is visible
}

// Create an IntersectionObserver to observe visibility of elements
let observer = new IntersectionObserver(showItem, options);

// Function to handle animation when an item becomes visible or hidden
function showItem(entries) {
    entries.forEach(entry => {
        let letters = [...entry.target.querySelectorAll('span')]; // Get all 'span' elements inside the 'li'

        if (entry.isIntersecting) {
            // If the element is visible, animate the letters into view
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.classList.add("active");
                }, index * 15); // Stagger animation for each letter
            });
            entry.target.children[0].classList.add('active'); // Add active class to the first child
        } else {
            // If the element is out of view, animate the letters out
            letters.reverse().forEach((letter, index) => {
                setTimeout(() => {
                    letter.classList.remove("active");
                }, index * 7); // Stagger removal for each letter
            });
            entry.target.children[0].classList.remove('active'); // Remove active class
        }
    });
}

// Prepare each list item by wrapping each character in a 'span' element
listItems.forEach(item => {
    let newString = "";
    let itemText = item.children[0].innerText.split(''); // Split text into individual characters
    itemText.map(letter => (newString += letter === " " ? `<span class="gap"></span>` : `<span>${letter}</span>`));
    item.innerHTML = newString; // Replace inner HTML with the new string
    observer.observe(item); // Observe each list item
});


//3 Javascript for secret text reveal based on scroll position
let paragraphs = [...document.querySelectorAll(".secret-text-container p")];
let spans = [];

// Process each paragraph, wrapping text characters in spans while leaving other elements like <img> intact
paragraphs.forEach(paragraph => {
    let htmlString = "";
    let paraArray = paragraph.childNodes; // Get child nodes, including text and img nodes

    paraArray.forEach(node => {
        if (node.nodeType === 3) { // If the node is a text node
            let text = node.textContent.split(""); // Split text into characters
            text.forEach(char => {
                htmlString += `<span>${char}</span>`; // Wrap each character in a 'span'
            });
        } else {
            htmlString += node.outerHTML; // Leave <img> and other elements as they are
        }
    });

    paragraph.innerHTML = htmlString; // Update the paragraph with the new HTML
});

spans = [...document.querySelectorAll(".secret-text-container span")]; // Collect all the spans created for the text

// Function to reveal spans as they scroll into view
function revealSpans() {
    spans.forEach(span => {
        if (span.parentElement.getBoundingClientRect().top < window.innerHeight / 2) {
            let { left, top } = span.getBoundingClientRect(); // Get the span's position
            top = top - (window.innerHeight * 0.45);
            let opacityValue = 1 - ((top * 0.01) + left * 0.001);
            opacityValue = opacityValue < 0.1 ? 0.1 : opacityValue > 1 ? 1 : opacityValue.toFixed(3);
            span.style.opacity = opacityValue; // Update the opacity of the span based on scroll position
        }
    });
}

window.addEventListener("scroll", () => {
    revealSpans(); // Trigger reveal function on scroll
});

// 4 Javacsript for smooth scrolling and media (images and videos) transformation
function lerp(start, end, t) {
    return start * (1 - t) + (end * t); // Linear interpolation function
}

class SmoothScroll {
    constructor(el, media) {
        this.el = el;
        this.media = media;  // Initialize scrollable media
        this.currentY = 0;
        this.targetY = 0;
        this.setup();
        this.onWindowResize();
        this.animate();
    }

    setup() {
        document.body.style.height = `${this.el.offsetHeight}px`; // Set body height based on the scrollable element
        window.addEventListener("scroll", () => {
            this.targetY = window.scrollY; // Update target scroll position on scroll
        });
    }

    onWindowResize() {
        window.addEventListener("resize", () => {
            document.body.style.height = `${this.el.offsetHeight}px`; // Adjust body height on window resize
        });
    }

    animate() {
        this.media.forEach(mediaItem => {  
            let { top, height } = mediaItem.parentElement.getBoundingClientRect();
            let adjustedTop = (top - ((window.innerHeight * 0.5) - (height * 0.5))) * 0.15;

            // Limit clip-path and translate values to create a smooth visual effect
            adjustedTop = Math.max(0, Math.min(adjustedTop, 50)); // Ensure values are within bounds
            mediaItem.style.clipPath = `polygon(${0 + adjustedTop}% 0%, ${100 - adjustedTop}% 0%,${100 - adjustedTop}% 100%,${0 + adjustedTop}% 100%)`;
            mediaItem.style.transform = `translate3d(0,${adjustedTop}px,0)`; // Move and clip the media elements
        });

        requestAnimationFrame(this.animate.bind(this)); // Continue the animation
    }
}

const scrollable = document.querySelector(".scrollable"); // Select the scrollable element
let media = [...document.querySelectorAll(".scroll-container img, .scroll-container video")]; // Select media elements for transformation

new SmoothScroll(scrollable, media); // Initialize smooth scrolling with media transformations



// 5 Javascript for changing the fixed title when scrolling
document.addEventListener("DOMContentLoaded", function () {
    const fixedTitle = document.querySelector('.fixed-title'); // Select the fixed title
    const scrollContainers = document.querySelectorAll('.scroll-container'); // Select all scroll containers
    const secondScrollContainer = document.querySelector('.scroll-container.second'); // Select the second scroll container
    const originalTitle = fixedTitle.innerHTML; // Save the original title text

    // Check scroll position and update title visibility and content accordingly
    function checkScroll() {
        let triggerChange = false;
        let secondContainerVisible = false;
        let passedSecondContainer = false;

        scrollContainers.forEach((container, index) => {
            const rect = container.getBoundingClientRect();

            // Check if the container is in view
            if (rect.top < window.innerHeight && rect.bottom > 0 && index === 1) {
                triggerChange = true;
                secondContainerVisible = true;
            }
        });

        const secondContainerRect = secondScrollContainer.getBoundingClientRect();

        // Check if the second scroll-container is completely passed
        if (secondContainerRect.bottom <= 0) {
            passedSecondContainer = true;
        }

        // Update title based on the scroll position
        if (secondContainerVisible) {
            fixedTitle.innerHTML = 'An exclusive drop when you least expect it'; // Change title
            fixedTitle.style.visibility = 'visible';
            fixedTitle.style.opacity = '1'; // Make it visible
        } else if (!passedSecondContainer) {
            fixedTitle.innerHTML = originalTitle; // Revert to the original title
            fixedTitle.style.visibility = 'visible';
            fixedTitle.style.opacity = '1'; // Show original title
        } else {
            fixedTitle.style.visibility = 'hidden';
            fixedTitle.style.opacity = '0'; // Hide the title after passing the second container
        }
    }

    window.addEventListener('scroll', checkScroll); // Check scroll event
});



// 6 Javascript for sweeping images effect (polaroids moving away from the mouse or finger)
const hintContainer = document.querySelector('.hint-container'); // Select the hint container
const polaroids = document.querySelectorAll('.polaroid'); // Select all polaroid elements
const FLY_RADIUS = 15; // Set the radius for collision detection
const FLY_FORCE = 200; // Set the amount of force to apply when polaroids "fly" away
const BOUNDARY_PADDING = 10; // Padding to prevent polaroids from sticking to the edges

// Add initial directions for each polaroid
let directions = Array.from(polaroids).map(() => ({ forceX: FLY_FORCE, forceY: FLY_FORCE }));

// Function to handle movement (mouse or touch)
function handleMove(event) {
    const containerRect = hintContainer.getBoundingClientRect(); // Get container dimensions

    // Get the coordinates for mouse or touch
    const mouseX = event.clientX || event.touches[0].clientX; // For mouse or first finger touch
    const mouseY = event.clientY || event.touches[0].clientY; // For mouse or first finger touch

    // Check if the mouse or touch is inside the hint-container
    if (
        mouseX >= containerRect.left && 
        mouseX <= containerRect.right && 
        mouseY >= containerRect.top && 
        mouseY <= containerRect.bottom
    ) {
        const screenWidth = window.innerWidth; // Get the screen width
        const screenHeight = window.innerHeight; // Get the screen height

        // Loop through each polaroid to apply the flying effect
        polaroids.forEach((polaroid, index) => {
            const rect = polaroid.getBoundingClientRect(); // Get the polaroid's position
            let { forceX, forceY } = directions[index]; // Current movement direction

            // Calculate distances from the touch/mouse to the polaroid's edges
            const distLeft = Math.abs(mouseX - rect.left);
            const distRight = Math.abs(mouseX - rect.right);
            const distTop = Math.abs(mouseY - rect.top);
            const distBottom = Math.abs(mouseY - rect.bottom);

            // Determine if the touch/mouse is near the polaroid
            const nearLeft = distLeft < FLY_RADIUS;
            const nearRight = distRight < FLY_RADIUS;
            const nearTop = distTop < FLY_RADIUS;
            const nearBottom = distBottom < FLY_RADIUS;

            // If the touch/mouse is near, apply force to move the polaroid away
            if (nearLeft || nearRight || nearTop || nearBottom) {
                if (nearLeft) forceX = FLY_FORCE; // Apply force to the right
                if (nearRight) forceX = -FLY_FORCE; // Apply force to the left
                if (nearTop) forceY = FLY_FORCE; // Apply force downwards
                if (nearBottom) forceY = -FLY_FORCE; // Apply force upwards

                // Calculate the new position of the polaroid
                let newLeft = rect.left + forceX;
                let newTop = rect.top + forceY;

                // Boundary detection: reverse direction if hitting the edge
                if (newLeft < BOUNDARY_PADDING) {
                    newLeft = BOUNDARY_PADDING;
                    forceX = -forceX;
                }
                if (newLeft + rect.width > screenWidth - BOUNDARY_PADDING) {
                    newLeft = screenWidth - rect.width - BOUNDARY_PADDING;
                    forceX = -forceX;
                }
                if (newTop < BOUNDARY_PADDING) {
                    newTop = BOUNDARY_PADDING;
                    forceY = -forceY;
                }
                if (newTop + rect.height > screenHeight - BOUNDARY_PADDING) {
                    newTop = screenHeight - rect.height - BOUNDARY_PADDING;
                    forceY = -forceY;
                }

                // Apply the translation and random rotation
                polaroid.style.transform = `translate(${newLeft - rect.left}px, ${newTop - rect.top}px) rotate(${Math.random() * 360}deg)`;

                // Save the direction for the next movement
                directions[index] = { forceX, forceY };
            }
        });
    }
}

// Mousemove event to handle polaroid flying effect with the mouse
document.addEventListener('mousemove', handleMove);

// Touchmove event to handle polaroid flying effect with touch on mobile devices
document.addEventListener('touchmove', handleMove);

// Set initial positions and rotations for the polaroids
window.addEventListener('DOMContentLoaded', () => {
    const containerWidth = hintContainer.offsetWidth;
    const containerHeight = hintContainer.offsetHeight;

    polaroids.forEach((polaroid) => {
        // Generate random positions and rotations
        const randomTop = Math.random() * (containerHeight - 100); // Adjust for polaroid height
        const randomLeft = Math.random() * (containerWidth - 100); // Adjust for polaroid width
        const randomRotation = Math.random() * 360 - 180; // Random rotation between -180 and 180 degrees

        // Apply random styles to each polaroid
        polaroid.style.top = `${randomTop}px`;
        polaroid.style.left = `${randomLeft}px`;
        polaroid.style.transform = `rotate(${randomRotation}deg)`;
    });
});
