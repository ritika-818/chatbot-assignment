
let city = "";

// Function to fetch weather data and handle different responses
const getData = (city, response) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=66994ba9a9d0ad6d2d9d878fc92faf52`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Invalid city");
        }
        return response.json();
    })
    .then((data) => {
        const conversation = document.getElementById('conversation');

        if (response === '🌡️ Temperature') {
            conversation.innerHTML += `<div class="chatbot-message">Temperature: ${data.main.temp} °C</div>`;askForMoreInfo();
        } else if (response === '🕛 Time') {
            fetch(`https://api.api-ninjas.com/v1/timezone?city=${city}`, {
                headers: { "X-Api-Key": "Yru7ISH3Xk3w3IRT9uTInA==jIeiYB0f79vIAJwq" },
                contentType: "application/json",
            }).then(response => response.json())
                .then(data => {
                    let time = new Date().toLocaleString("en-US", {
                        timeZone: data.timezone,
                        timeStyle: "medium",
                        hourCycle: "h24",
                    });
                    conversation.innerHTML += `<div class="chatbot-message">Time: ${data.timezone} ${time}</div>`;askForMoreInfo();
                });
        } else if (response === '🎐 Wind Speed') {
            conversation.innerHTML += `<div class="chatbot-message">Wind Speed: ${data.wind.speed} meter/sec</div>`;askForMoreInfo();
        } else if (response === '⛅ Weather Status') {
            const status = data.weather[0].description;
            conversation.innerHTML += `<div class="chatbot-message">Weather Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</div>`;askForMoreInfo();
        }
    })
    .catch(error => {
        const conversation = document.getElementById('conversation');
        conversation.innerHTML += `<div class="chatbot-message">Please enter a valid city name! 🤕</div>`;
        enableInput();
    });
};

// Function to ask the user if they want more information
const askForMoreInfo = () => {
    const conversation = document.getElementById('conversation');

    conversation.innerHTML += `
        <div class="chatbot-message">Do you want more information?</div>
        <div class="chatbot-quick-replies">
            <button class="botquestion__replies--text">Yes</button>
            <button class="botquestion__replies--text">No</button>
        </div>
    `;

    const quickreplies = document.querySelectorAll('.chatbot-quick-replies .botquestion__replies--text');
    quickreplies.forEach(reply => {
        reply.addEventListener('click', () => {
            if (reply.textContent === 'Yes') {
                askSameOrDifferentCity();
            } else {
                const conversation = document.getElementById('conversation');
                conversation.innerHTML += `<div class="chatbot-message">Thank you for using our service! 😊</div>`;
            }
        });
    });
};

// Function to ask if the user wants to provide the same or different city
const askSameOrDifferentCity = () => {
    const conversation = document.getElementById('conversation');

    conversation.innerHTML += `
        <div class="chatbot-message">Same city or different city?</div>
        <div class="chatbot-quick-replies">
            <button class="botquestion__replies--text">Same City</button>
            <button class="botquestion__replies--text">Different City</button>
        </div>
    `;

    const quickreplies = document.querySelectorAll('.chatbot-quick-replies .botquestion__replies--text');
    quickreplies.forEach(reply => {
        reply.addEventListener('click', () => {
            if (reply.textContent === 'Same City') {
                showOptionsForCity();
            } else if (reply.textContent === 'Different City') {
                city = "";
                enableInput();
                const conversation = document.getElementById('conversation');
                conversation.innerHTML += `<div class="chatbot-message">Please enter the city name.</div>`;
            }
        });
    });
};

// Function to show options for the current city
const showOptionsForCity = () => {
    const conversation = document.getElementById('conversation');

    conversation.innerHTML += `
        <div class="chatbot-message">Choose an option for ${city}</div>
        <div class="chatbot-quick-replies">
            <button class="botquestion__replies--text">🌡️ Temperature</button>
            <button class="botquestion__replies--text">🕛 Time</button>
            <button class="botquestion__replies--text">🎐 Wind Speed</button>
            <button class="botquestion__replies--text">⛅ Weather Status</button>
        </div>
    `;

    const quickreplies = document.querySelectorAll('.chatbot-quick-replies .botquestion__replies--text');
    quickReplyEvent(quickreplies);
};

// Function to handle quick reply button clicks
const quickReplyEvent = (quickreplies) => {
    quickreplies.forEach(reply => {
        reply.addEventListener('click', () => {
            const response = reply.textContent;
            if (city === "") {
                enableInput(response);
                const conversation = document.getElementById('conversation');
                conversation.innerHTML += `<div class="chatbot-message">Please enter the city name.</div>`;
            } else {
                getData(city, response);
            }
        });
    });
};

// Function to enable the input field and set up event listeners
const enableInput = (response = "") => {
    const input = document.getElementById('input-box');
    input.disabled = false;
    input.focus();

    input.addEventListener('keydown', function handleEnter(e) {
        city = input.value.trim();
        if (e.key === 'Enter') {
            if (city) {
                input.value = "";
                input.disabled = true;
                getData(city, response);
            } else {
                const conversation = document.getElementById('conversation');
                conversation.innerHTML += `<div class="chatbot-message">Please enter a valid city name! 🤕</div>`;
                input.focus();
            }
            input.removeEventListener('keydown', handleEnter); // Ensure the event listener is removed after use
        }
    });
};

// Initialize quick replies on DOM content load
document.addEventListener("DOMContentLoaded", () => {
    const quickreplies = document.querySelectorAll('.botquestion__replies--text');
    quickReplyEvent(quickreplies);
});
