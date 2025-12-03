// 1 JavaScript to change background color on scroll
const aboutContainer = document.querySelector('.about-us-container'); // Select the about-us section
const historyContainer = document.querySelector('.history-container'); // Select the history section
const stickyContainer = document.querySelector(".sticky-parent-container"); // Select the sticky section

window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY; // Get the current vertical scroll position
    const aboutHeight = aboutContainer.offsetHeight; // Get the height of the about-us section
    const historyHeight = historyContainer.offsetHeight; // Get the height of the history section
    const stickyHeight = stickyContainer.offsetHeight; // Get the height of the sticky-parent section
    const totalScrollHeight = aboutHeight + historyHeight + stickyHeight; // Total height for scrolling

    const scrollFraction = scrollPosition / totalScrollHeight; // Fraction of the scroll distance (between 0 and 1)

    // Define the colors to transition through during scrolling
    const colors = [
        [239, 222, 205], // brown-light
        [244, 194, 194], // red-light
        [244, 194, 194], // red-light
        [169, 182, 199], // blue-dark
        [19, 18, 57],    // dark-blue
        [19, 18, 57],    // dark-blue
        [181, 201, 149], // green
        [244, 194, 194], // red-light
        [244, 194, 194]  // red-light
    ];

    // Calculate which color segment we're currently in based on scrollFraction
    const colorSegment = Math.min(Math.floor(scrollFraction * (colors.length - 1)), colors.length - 2);
    const segmentFraction = (scrollFraction - (colorSegment / (colors.length - 1))) * (colors.length - 1);

    // Interpolate between the start and end colors of the current segment
    const startColor = colors[colorSegment];
    const endColor = colors[colorSegment + 1];
    const newColor = startColor.map((start, index) => {
        return Math.round(start + (endColor[index] - start) * segmentFraction);
    });

    // Set the new interpolated background color based on scroll position
    document.body.style.backgroundColor = `rgb(${newColor.join(',')})`;
});


// 2 Title transition effect on scroll
window.addEventListener("scroll", function () {
    const title = document.querySelector('.scroll-title'); // Select the scroll title
    const titleContainer = document.querySelector(".title-container"); // Select the title container

    var titleRect = titleContainer.getBoundingClientRect(); // Get the position and size of the title container
    var titleTop = titleRect.top; // Get the top position of the title container relative to the viewport
    var titleHeight = titleRect.height; // Get the height of the title container
    var viewportHeight = window.innerHeight; // Get the viewport height

    // Calculate how far the title has scrolled into view
    const scrollProgress = (viewportHeight - titleTop) / (viewportHeight + titleHeight);

    // If the title is in view, apply transformations
    if (scrollProgress > 0 && scrollProgress < 1) {
        var translateY = 0 - (100 * scrollProgress); // Calculate vertical movement of the title

        if (translateY < -25) {
            // If the title has scrolled past a certain point, scale down the title size
            var scale = 2 - (2 * scrollProgress); // Scaling effect based on scroll progress
            translateY += 100 * scrollProgress;

            // Cap the translate and scale values to avoid excessive shrinking/movement
            if (translateY < -15) translateY = -15;
            if (scale < 0.41) scale = 0.41;

            // Apply translate and scale to the title
            title.style.transform = `translateY(${translateY}vh) scale(${scale})`;
        } else {
            // If the title is still in the upper part, apply only translate effect
            title.style.transform = `translateY(${translateY}vh)`;
            if (translateY < -15) translateY = -15;
        }
    }
});

// 3 Text transition for list items
let listItems = [...document.querySelectorAll("li")]; // Select all list items

let options = {
    rootMargin: "-10%", // Define a margin to trigger the intersection earlier
    threshold: 0.0 // Trigger when any part of the element is visible
};

let observer = new IntersectionObserver(showItem, options); // Create an observer for detecting when elements come into view

function showItem(entries) {
    entries.forEach(entry => {
        let letters = [...entry.target.querySelectorAll('span')]; // Get all spans inside the list item

        if (entry.isIntersecting) {
            // Add the "active" class to each letter in sequence when the element is in view
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.classList.add("active");
                }, index * 15); // Delay for each letter to create a staggered effect
            });
            entry.target.children[0].classList.add('active'); // Add active class to the first child
        } else {
            // Remove the "active" class when the element goes out of view
            letters.reverse().forEach((letter, index) => {
                setTimeout(() => {
                    letter.classList.remove("active");
                }, index * 7); // Remove in reverse order for a staggered exit
            });
            entry.target.children[0].classList.remove('active'); // Remove active class from the first child
        }
    });
}

// Convert each list item text into individual span elements for animation
listItems.forEach(item => {
    let newString = "";
    let itemText = item.children[0].innerText.split(''); // Split text into individual characters
    itemText.map(letter => (newString += letter === " " ? `<span class="gap"></span>` : `<span>${letter}</span>`)); // Wrap each letter in a span, leave spaces
    item.innerHTML = newString; // Set the inner HTML with the new string
    observer.observe(item); // Start observing each list item for scroll-based visibility
});

// Horizontal scrolling effect for sticky section
const stickySection = document.querySelector(".sticky"); // Select the sticky section

// Scroll event to handle horizontal scrolling effect
window.addEventListener('scroll', () => {
    transform(stickySection);
});

function transform(section) {
    const offsetTop = section.parentElement.offsetTop; // Get the top offset of the sticky parent section
    const scrollSection = section.querySelector(".scroll-section"); // Select the scrollable section inside sticky

    let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100; // Calculate how much has been scrolled in percentage
    percentage = percentage < 0 ? 0 : percentage > 500 ? 500 : percentage; // Constrain the percentage to avoid over-scrolling

    // Apply horizontal translation based on the scroll percentage
    scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`;
}
