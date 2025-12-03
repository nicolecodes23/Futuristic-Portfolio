//1 Javascript for title transition
// Select all 'li' elements and store them in an array
let listItems = [...document.querySelectorAll("li")]; 

// Options for the IntersectionObserver
let options = {
    rootMargin: "-10%", // Trigger the observer 10% before the element is in view
    threshold: 0.0 // Observer triggers when any part of the element is visible
}

// Create an IntersectionObserver instance with the 'showTitle' function and 'options'
let observer = new IntersectionObserver(showTitle, options);

// Function to handle animation when list items come into view or leave the viewport
function showTitle(entries) {
    // Loop over each entry (observed 'li' element)
    entries.forEach(entry => {
        // Select all 'span' elements (letters) within the current 'li' element
        let letters = [...entry.target.querySelectorAll('span')];

        // Check if the element is in the viewport
        if (entry.isIntersecting) {
            // If visible, add the 'active' class to each letter with a slight delay
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.classList.add("active"); // Activate letter animation
                }, index * 15); // Stagger the animation by 15ms per letter
            });
        } else {
            // If the element is out of the viewport, remove the 'active' class in reverse order
            letters.reverse().forEach((letter, index) => {
                setTimeout(() => {
                    letter.classList.remove("active"); // Deactivate letter animation
                }, index * 7); // Stagger the deactivation by 7ms per letter
            });
        }
    });
}

// Apply the observer to each 'li' element
listItems.forEach(item => observer.observe(item));



//2 Javaccript for link hover in bento grid buttons
//link hover animation 
// Select all anchor ('a') elements inside the bento grid container
let elements = document.querySelectorAll(".bento-grid-container a");

// Loop through each link element
elements.forEach((element) => {
    // Store the original text of the link
    let innerText = element.innerText;
    
    // Clear the original text content of the link
    element.innerHTML = "";

    // Create a new div container to hold the split letters
    let linkContainer = document.createElement("div");
    linkContainer.classList.add("block"); // Add 'block' class to the container

    // Loop over each letter in the original text
    for (let letter of innerText) {
        // Create a new 'span' element for each letter
        let span = document.createElement("span");
        // If the letter is a space, use a non-breaking space ('\xa0')
        span.innerText = letter.trim() === "" ? "\xa0" : letter;
        span.classList.add("letter"); // Add 'letter' class to the span
        linkContainer.appendChild(span); // Append the span to the link container
    }

    // Append the letter container to the original link
    element.appendChild(linkContainer);
    // Clone the container to create the hover animation effect
    element.appendChild(linkContainer.cloneNode(true));
});



//3 Javascript for chatbot interaction
//chatbot 
// Select the chat input textarea, send button, and chatbox
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input .send");
const chatBox = document.querySelector(".chatbox");
let userMessage; // Store the user's message

// API key for making requests to the language model API, API key is removed for privacy purposes, please contact user for key
const API_KEY = "";

// Store the initial height of the chat input field
const inputInitHeight = chatInput.scrollHeight;

// Function to create a chat list item ('li') with the provided message and class name
function createChatLi(message, className) {
    // Create a new 'li' element
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className); // Add 'chat' and the passed class name

    // If the class is 'outgoing', create a simple paragraph
    // If it's 'incoming', include the profile picture
    let chatContent = className === "outgoing" ? `<p></p>` : `<span><img src="images/profile.jpg" alt="profile" class="profile"></span><p></p>`;
    
    // Set the chat content in the 'li' element
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message; // Add the user's message to the 'p' element
    return chatLi; // Return the created 'li' element
}

// Function to generate a chatbot response using the API
function generateResponse(incomingChatLi) {
    // API URL for the language model
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLi.querySelector("p"); // Select the paragraph for the response

    // Options for the API request
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: userMessage }] // Send the user's message
            }]
        }),
    };

    // Send the POST request to the API
    fetch(API_URL, requestOptions)
        .then(res => res.json()) // Parse the response as JSON
        .then(data => {
            // Update the message element with the chatbot's response
            messageElement.textContent = data.candidates[0].content.parts[0].text;
        })
        .catch(() => {
            // If there's an error, display an error message
            messageElement.textContent = "Oops! something went wrong, please try again."
        })
        .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight)); // Scroll to the bottom of the chatbox
}

// Function to handle sending the user's message and getting the chatbot's response
function handleChat() {
    userMessage = chatInput.value.trim(); // Get the user's message from the input
    if (!userMessage) return; // If the message is empty, return

    chatInput.value = ""; // Clear the input field
    chatInput.style.height = `${inputInitHeight}px`; // Reset the input height

    // Append the user's message to the chatbox
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight); // Scroll to the bottom of the chatbox

    // If the message contains 'Nicole', display a predefined response
    if (userMessage.toLowerCase().includes("nicole")) {
        setTimeout(() => {
            const incomingChatLi = createChatLi("Nicole is not available at the moment, I'll tell her you dropped by.", "incoming");
            chatBox.appendChild(incomingChatLi); // Append response to chatbox
            chatBox.scrollTo(0, chatBox.scrollHeight); // Scroll to the bottom
        }, 400); // Wait 400ms before responding
    } else {
        setTimeout(() => {
            // Display 'typing...' before generating the response
            const incomingChatLi = createChatLi("typing...", "incoming");
            chatBox.appendChild(incomingChatLi);
            chatBox.scrollTo(0, chatBox.scrollHeight); // Scroll to the bottom
            generateResponse(incomingChatLi); // Generate chatbot response
        }, 400); // Wait 400ms before showing typing indicator
    }
}

// Adjust the height of the chat input textarea based on its content
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`; // Reset height
    chatInput.style.height = `${chatInput.scrollHeight}px`; // Adjust height to content
});

// Handle the 'Enter' key press to send the message
chatInput.addEventListener("keydown", (e) => {
    // If 'Enter' is pressed without 'Shift', and the window is wider than 800px
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault(); // Prevent the default action (line break)
        handleChat(); // Send the chat message
    }
});

// Add click event listener to the send button to handle chat submission
sendChatBtn.addEventListener("click", handleChat);
