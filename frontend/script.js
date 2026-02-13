const chatBox = document.getElementById("chatbox")
const inputMessage = document.getElementById("inputeMessage")
const sendBtn = document.getElementById("sendBtn")


function appendMessage(msg,sender){
    const msgDiv = document.createElement('div')
    msgDiv.classList.add('message',sender)
    const textBubble = document.createElement('span')
    textBubble.classList.add("text-bubble")   
    textBubble.textContent = msg;
    msgDiv.appendChild(textBubble)
    chatBox.appendChild(msgDiv)
    chatBox.scrollTop = chatBox.scrollHeight
}
function appendImageMessage(url, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    const img = document.createElement("img");
    img.src = url;
    img.classList.add("chat-image");
    msgDiv.appendChild(img);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(){
    if (sendBtn.disabled) return;

    const message = inputMessage.value.trim();
    if(!message) return;

    appendMessage(message,'user');
    inputMessage.value = '';

    sendBtn.disabled = true;
    inputMessage.disabled = true;

    try {

        // 🔍 Detect if user is asking for an image
        const isImageRequest = message.toLowerCase().includes("image");

        const endpoint = isImageRequest
            ? "http://localhost:8000/generate-image"
            : "http://localhost:8000/chat";

        const bodyData = isImageRequest
            ? { prompt: message }
            : { message: message };
        debugger;
        const Response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        if (!Response.ok) throw new Error("network problem");

        const data = await Response.json();

        if (isImageRequest) {
            appendImageMessage(data.image_url, 'bot');
        } else {
            appendMessage(data.reply, 'bot');
        }

    } catch (err) {
        console.log(err);
        appendMessage('Error occurred', 'bot');
    } finally {
        sendBtn.disabled = false;
        inputMessage.disabled = false;
        inputMessage.focus();
    }
}


sendBtn.addEventListener("click", sendMessage)
inputMessage.addEventListener("keypress", function(e){
    if (e.key === 'Enter') sendMessage()
})
