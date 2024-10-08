let city = "";
let differentCity = false;
const icon = document.getElementsByClassName("chat-header-icon-right")[0];
const cross = document.getElementsByClassName("cross")[0];
const container = document.getElementsByClassName("chat-container")[0];
const bottomDiv = document.getElementsByClassName("bottom-div")[0];
const crossRight = document.getElementsByClassName("cross-right")[0];
const hoverDiv = document.getElementsByClassName("hover-div")[0];

crossRight.addEventListener("click", () => {
  hoverDiv.style.display = "none";
  crossRight.style.display = "none";
});

cross.addEventListener("click", () => {
  container.style.display = "none";
  icon.style.display = "block";
  bottomDiv.style.display = "block";
  hoverDiv.style.display = "block";
  crossRight.style.display = "block";
});
const getData = (response) => {
  console.log("response",response);
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=66994ba9a9d0ad6d2d9d878fc92faf52`
  ).then((responseJson) => {
      if (!responseJson.ok) {
        throw new Error("Invalid city");
      }
      return responseJson.json();
    })
    .then((data) => {
      const conversation = document.getElementById("conversation");

      if (response === "🌡️ Temperature") {
        conversation.innerHTML += `<div class="chatbot-message">Temperature: ${data.main.temp} °C</div>`;
        askForMoreInfo();
      } else if (response === "🕛 Time") {
        fetch(`https://api.api-ninjas.com/v1/timezone?city=${city}`, {
          headers: { "X-Api-Key": "Yru7ISH3Xk3w3IRT9uTInA==jIeiYB0f79vIAJwq" },
          contentType: "application/json",
        })
          .then((response) => response.json())
          .then((data) => {
            let time = new Date().toLocaleString("en-US", {
              timeZone: data.timezone,
              timeStyle: "medium",
              hourCycle: "h12",
            });
            conversation.innerHTML += `<div class="chatbot-message">Time: ${time}</div>`;
            askForMoreInfo();
          });
      } else if (response === "🎐 Wind Speed") {
        conversation.innerHTML += `<div class="chatbot-message">Wind Speed: ${data.wind.speed} meter/sec</div>`;
        askForMoreInfo();
      } else if (response === "⛅ Weather Status") {
        const status = data.weather[0].description;
        conversation.innerHTML += `<div class="chatbot-message">Weather Status: ${
          status.charAt(0).toUpperCase() + status.slice(1)
        }</div>`;
        askForMoreInfo();
      }
      conversation.scrollTop = conversation.scrollHeight;
    })
    .catch((error) => {
      console.log(error);
      const conversation = document.getElementById("conversation");
      city="";
      conversation.innerHTML += `<div class="chatbot-message">Please enter a valid city name! 🤕</div>`;
      conversation.scrollTop = conversation.scrollHeight;
      enableInput(response);
    });
};

const askForMoreInfo = () => {
  const conversation = document.getElementById("conversation");

  conversation.innerHTML += `
        <div class="chatbot-message">Do you want more information?</div>
        <div class="quick-replies">
            <button class="botquestion__replies--text">Yes</button>
            <button class="botquestion__replies--text">No</button>
        </div>
    `;

  const quickreplies = document.querySelectorAll(
    ".quick-replies .botquestion__replies--text"
  );
  conversation.scrollTop = conversation.scrollHeight;

  quickreplies.forEach((reply) => {
    reply.addEventListener("click", () => {
      if (reply.textContent === "Yes") {
        askSameOrDifferentCity();
      } else {
        const conversation = document.getElementById("conversation");
        conversation.innerHTML += `<div class="chatbot-message">Thank you for using our service! 😊</div>`;
        conversation.scrollTop = conversation.scrollHeight;
      }
    });
  });
};

const askSameOrDifferentCity = () => {
  const conversation = document.getElementById("conversation");

  conversation.innerHTML += `
        <div class="chatbot-message">Same city or different city?</div>
        <div class="quick-replies">
            <button class="botquestion__replies--text">Same City</button>
            <button class="botquestion__replies--text">Different City</button>
        </div>
    `;
    conversation.scrollTop = conversation.scrollHeight;
  const quickreplies = document.querySelectorAll(
    ".quick-replies .botquestion__replies--text"
  );
  quickreplies.forEach((reply) => {
    reply.addEventListener("click", () => {
      if (reply.textContent === "Same City") {
        showOptionsForCity();
      } else if (reply.textContent === "Different City") {
        city = "";
        const conversation = document.getElementById("conversation");
        conversation.innerHTML += `<div class="chatbot-message">Please enter the city name.</div>`;
        conversation.scrollTop = conversation.scrollHeight;
        enableInput("",true);
      }
    });
  });
};

const showOptionsForCity = () => {
  const conversation = document.getElementById("conversation");

  conversation.innerHTML += `<div class="user-container"><span class="user-input">${city}</span></div>
        <div class="chatbot-message">Choose an option for ${city}</div>
        <div class="quick-replies">
            <button class="botquestion__replies--text">🌡️ Temperature</button>
            <button class="botquestion__replies--text">🕛 Time</button>
            <button class="botquestion__replies--text">🎐 Wind Speed</button>
            <button class="botquestion__replies--text">⛅ Weather Status</button>
        </div>
    `;
    conversation.scrollTop = conversation.scrollHeight;
    const quickreplies = document.querySelectorAll(".botquestion__replies--text");
  quickReplyEvent(quickreplies);
};

const enableInput = (response = "", differentCity= false) => {
  const input = document.getElementById("input-box");
  input.disabled = false;
  input.focus();

  input.addEventListener("keydown", function handleEnter(e) {
    city = input.value.trim();
    if (e.key === "Enter") {
      input.value = "";
        input.disabled = true;
      if(differentCity === false){
        conversation.innerHTML += `<div class="user-container"><span class="user-input">${city}</span></div>`;
        conversation.scrollTop = conversation.scrollHeight;
        getData(response);
      } else{
        showOptionsForCity();
        differentCity = false;
      }
      input.removeEventListener("keydown", handleEnter);
    }
  });
};

const quickReplyEvent = (quickreplies) => {
  container.style.display = "block";
  icon.style.display = "none";
  bottomDiv.style.display = "none";
  console.log(container);
  quickreplies.forEach((reply) => {
    reply.addEventListener("click", () => {
      const response = reply.textContent;
      conversation.innerHTML += `<div class="user-container"><span class="user-input">${response}</span></div>`;
      conversation.scrollTop = conversation.scrollHeight;
      console.log("in event");
      if (city === "") {
        enableInput(response);
        const conversation = document.getElementById("conversation");
        conversation.innerHTML += `<div class="chatbot-message">Please enter the city name.</div>`;
        conversation.scrollTop = conversation.scrollHeight;
      } else {
        console.log("after else")
        getData( response);
      }
    });
  });
};

icon.addEventListener("click", () => {
  console.log("ritika");
  const quickreplies = document.querySelectorAll(".botquestion__replies--text");
  quickReplyEvent(quickreplies);
});
