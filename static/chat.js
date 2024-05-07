async function postRequest(formData) {
  return await fetch("/gpt", {
    method: "POST",
    body: formData
  });
}

async function loadFiles(formData){
  return fetch("/process_files",{
    method: "POST",
    body: formData
  });
}


async function handleResponse(response, messageText) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let assistantMessage = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      messages.push({
        role: "assistant",
        content: assistantMessage,
      });
      break;
    }

    const text = decoder.decode(value);
    assistantMessage += text;
    messageText.innerHTML = window.renderMarkdown(assistantMessage).trim();
    highlightCode(messageText);
    autoScroll();
  }
}

window.onload = function () {
  document.getElementById("chat-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let userInput = userInputElem.value.trim();
    messages.push({ role: "user", content: userInput });
    userInputElem.value = "";

    addMessageToDiv("user", userInput);
  
    let messageText = addMessageToDiv("assistant");


    for (let i = 0; i < file.length; i++) {
      if(file_transcription[i] === null && file[i]!== null){
        let fileData = new FormData();
        fileData.append("file",file[i]);
        const Response = await loadFiles(fileData);
        const ResponseData = await Response.json();

        status_code = ResponseData.status_code;
        
        if(status_code !== 200){
          alert(ResponseData.transcription);
          removeByIndex(i);

        }
        else{
          file_transcription[i] = file[i].name + ":" + ResponseData.transcription;
        }
      }
    }

    
    let promptData = new FormData();
    promptData.append("user_input", userInput);
    promptData.append("messages", JSON.stringify(messages));
    promptData.append("file_transcription", file_transcription);

    const AssistantResponse = await postRequest(promptData);
    handleResponse(AssistantResponse, messageText);
    document.getElementById("real-file").value = "";
    


  });
};
