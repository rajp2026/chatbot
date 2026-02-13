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
async function sendMessage(){
    const message = inputMessage.value.trim();
    if(!message) return;
    appendMessage(message,'user');
    inputMessage.value = '';
    sendBtn.disabled = true;
    inputMessage.disabled = true;


   try {
    const Response = await fetch("http://localhost:8000/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })

    if (!Response.ok) throw new Error("network problem")

    const data = await Response.json()
    if(data){
        appendMessage(data.reply, 'bot')
    }

    } catch (err) {
        console.log(err)
        appendMessage('error occurred bot', 'bot')
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
