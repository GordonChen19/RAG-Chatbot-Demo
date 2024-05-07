const chatMessagesDiv = document.getElementById("chat-messages");
const userInputElem = document.getElementById("user-input");

// State variables
let messages = [];

let autoScrollState = true;
let file = [];
let file_transcription = [];

// Event listener functions
function handleInputKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    document.getElementById("submitBtn").click();
  }
}

function autoScroll() {
  if (autoScrollState) {
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  }
}

// Event listeners for functions above
document.getElementById("user-input").addEventListener("keydown", handleInputKeydown);

document;
chatMessagesDiv.addEventListener("scroll", function () {
  const isAtBottom =
    chatMessagesDiv.scrollHeight - chatMessagesDiv.clientHeight <=
    chatMessagesDiv.scrollTop + 1;

  autoScrollState = isAtBottom;
});

window.renderMarkdown = function (content) {
  const md = new markdownit();
  return md.render(content);
};

function highlightCode(element) {
  const codeElements = element.querySelectorAll("pre code");
  codeElements.forEach((codeElement) => {
    hljs.highlightElement(codeElement);
  });
}

function addMessageToDiv(role, content = "") {
  let messageDiv = document.createElement("div");
  messageDiv.className =
    role === "user" ? "message user-message" : "message assistant-message";

  let messageText = document.createElement("p");
  messageDiv.appendChild(messageText);

  if (content) {
    let renderedContent = window.renderMarkdown(content).trim();
    messageText.innerHTML = renderedContent;
    highlightCode(messageDiv);
  }

  chatMessagesDiv.appendChild(messageDiv);
  autoScroll();

  return messageText;
}


// Input File

const tags = document.getElementById('tags'); 

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");


customBtn.addEventListener("click", function() {
  realFileBtn.click();
});

realFileBtn.addEventListener("change",uploadFile);


// Document Tags

function uploadFile(event) {
  event.preventDefault();

  for (let i = 0; i < realFileBtn.files.length; i++){
    file.push(realFileBtn.files[i]);
    file_transcription.push(null);
    const tag = document.createElement('li');
    tag.dataset.index = file.length - 1;
    tag.innerText = realFileBtn.files[i].name
    tag.innerHTML += '<button class="delete-button">X</button>'; 
    tags.appendChild(tag); 
  }
  document.getElementById("real-file").value = "";
}

tags.addEventListener('click', function (event) { 
    if (event.target.classList.contains('delete-button')) { 
        let fileName = event.target.parentNode.innerText;
        if (confirm(`Are you sure you want to remove ${fileName.slice(0,-1)}?`) == true){
          const index = parseInt(event.target.parentNode.dataset.index);
          event.target.parentNode.remove(); 
          file[index] = null;
          file_transcription[index] = null;
        }   
    } 
}); 

function removeByIndex(index){

  file[index] = null;
  file_transcription[index] = null;

  const parentNode = document.getElementById('tags');
  const children = parentNode.children;
  for (let i=0;i<children.length;i++){
    const child = children[i];
    if (parseInt(child.dataset.index) === index) {
        child.remove();
        
        break;
    }
  }
}

// Clear Context

function ConfirmClear(){
  if (confirm("Are you sure you want to clear context?") == true){
    messages = [];
    file = [];
    file_transcription = [];
    document.getElementById("real-file").value = "";
    tags.innerHTML = "";
    alert("Context Cleared");
  }
}



//Dynamic Background


function animateBackground() {
  const body = document.body;
  const steps = 100; // Total steps for the transition
  const duration = 5000; // Duration of the transition in milliseconds
  const interval = duration / steps;

  let currentStep = 0;
  let startColor = { h: 220, s: 5, l: 75 };
  let endColor = { h: 220, s: 75, l: 55 };

  let startDegree = 0
  let endDegree = 360


  // Function to update background linear gradient
  function updateBackground() {
    const leftColor = {
      h: startColor.h + (endColor.h - startColor.h) * (currentStep / steps),
      s: startColor.s + (endColor.s - startColor.s) * (currentStep / steps),
      l: startColor.l + (endColor.l - startColor.l) * (currentStep / steps)
    };

    const rightColor =  {
      h: endColor.h - (endColor.h - startColor.h) * (currentStep / steps),
      s: endColor.s - (endColor.s - startColor.s) * (currentStep / steps),
      l: endColor.l - (endColor.l - startColor.l) * (currentStep / steps)
    };

    const currentDegree = startDegree + (endDegree - startDegree) * (currentStep/steps);

    const linearGradient = `linear-gradient(${currentDegree}deg, hsl(${leftColor.h}, ${leftColor.s}%, ${leftColor.l}%), hsl(${rightColor.h}, ${rightColor.s}%, ${rightColor.l}%))`;

    body.style.backgroundImage = `radial-gradient(
        circle at center center,
        transparent 50%,
        rgb(0, 0, 0) 200%
      ),
      ${linearGradient}`;

    currentStep++;

    if (currentStep <= steps) {
      setTimeout(updateBackground, interval);
    } else {
      currentStep = 0; // Reset the step counter for the next animation loop
      let tmp = startColor
      startColor = endColor
      endColor = tmp

      setTimeout(updateBackground, interval);
    }
  }
  updateBackground(); // Start the animation loop
}

animateBackground(); 
