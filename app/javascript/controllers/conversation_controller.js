import { Controller } from "@hotwired/stimulus"
import { marked } from 'marked';
import Typed from 'typed.js'

// Connects to data-controller="conversation"
export default class extends Controller {
  static targets = ["prompt", "response"]

  connect() {
    this.csrfToken = document.head.querySelector("[name~=csrf-token][content]").content;
    console.log("connected");
  }

  saveExpense(event) {
    event.preventDefault()
    this.#createExpense()
  }

  resetChat(event) {
    event.preventDefault()
    this.#resetChat()
  }

  generateResponse(event) {
    event.preventDefault()
    this.#createLabel('you')
    this.#createMessage(this.promptTarget.value)
    this.#createLabel('assistant')
    this.currentContent = this.#createMessage("")
    this.#setupEventSource()
    this.promptTarget.value = ""
  }

  async #createExpense() {
    try {
      const response = await fetch('/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.csrfToken
        },
      })
      const data = await response.json()
      if (response.ok) {
        this.#createLabel('assistant')
        this.#createMessage("Ok saved!")
      } else {
        alert('Error: ' + data.errors.join(', '))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while creating the expense.')
    }
  }

  async #resetChat() {
    try {
      const response = await fetch('/conversations/clearconvo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.csrfToken
        },
      })
      const data = await response.json()
      if (response.ok) {
        this.#createLabel('assistant')
        this.#createMessage("Ok I've cleared our chat history!")
      } else {
        alert('Error: ' + data.errors.join(', '))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while resetting the chat.')
    }
  }
// ORIGINAL CODE
  // #createLabel(text) {
  //   const label = document.createElement('strong')
  //   label.innerText = `${text}`
  //   this.responseTarget.appendChild(label)
  // }
  // #createMessage(text) {
  //   const contentElement = document.createElement('p')
  //   contentElement.innerHTML = `${text}`
  //   this.responseTarget.appendChild(contentElement)
  //   this.responseTarget.scrollTop = this.responseTarget.scrollHeight
  //   return contentElement
  // }

  #createLabel(text) {
    // Create the outer div with class 'chat-bubble-top'
    const bubbleTop = document.createElement('div');
    bubbleTop.className = 'chat-bubble-top';

    // Create the inner div with class 'chat-name-user' and set its text content
    const nameUser = document.createElement('div');
    nameUser.className = 'chat-name-user';
    nameUser.innerText = text;

    // Append the inner div to the outer div
    bubbleTop.appendChild(nameUser);

    // Create the mid bubble div with class 'chat-bubble-mid'
    const bubbleMid = document.createElement('div');
    bubbleMid.className = 'chat-bubble-mid';

    // Append both bubbleTop and bubbleMid to the responseTarget
    this.responseTarget.appendChild(bubbleTop);
    this.responseTarget.appendChild(bubbleMid);
  }

#createMessage(text) {
  // Create the chat-content container
  const chatContent = document.createElement('div');
  chatContent.className = 'chat-content';

  // Create the paragraph element and set its content
  const contentElement = document.createElement('p');
  contentElement.innerHTML = text;

  // Append the paragraph to the chat-content container
  chatContent.appendChild(contentElement);

  // Create the chat-bubble-mid container
  const bubbleMid = document.createElement('div');
  bubbleMid.className = 'chat-bubble-mid';

  // Create the chat-bubble-top container
  const bubbleTop = document.createElement('div');
  bubbleTop.className = 'chat-bubble-top';

  // Append chat-content, chat-bubble-mid, and chat-bubble-top to the responseTarget
  this.responseTarget.appendChild(chatContent);
  this.responseTarget.appendChild(bubbleMid);
  this.responseTarget.appendChild(bubbleTop);

  // Scroll to the bottom of the responseTarget
  this.responseTarget.scrollTop = this.responseTarget.scrollHeight;

  return chatContent;
}

  #setupEventSource() {
    this.eventSource = new EventSource(`/conversation_responses?prompt=${this.promptTarget.value}`)
    this.eventSource.addEventListener("message", this.#handleMessage.bind(this))
    this.eventSource.addEventListener("error", this.#handleError.bind(this))
  }

  #handleMessage(event) {
    const parsedData = JSON.parse(event.data)
    new Typed(this.currentContent, {
      strings: [marked.parse(parsedData.message)],
      showCursor: false,
      onComplete: () => {
        this.responseTarget.scrollTop = this.responseTarget.scrollHeight
      }
    });
  }

  #handleError(event) {
    if (event.eventPhase === EventSource.CLOSED) { // check that the server really did close the connection
      this.eventSource.close() // then close the eventsource on the client
    }
  }

  disconnect() {
    if (this.eventSource) { // if event source somehow still open, close it!!
      this.eventSource.close()
    }
    this.element.removeEventListener('triggerMethod', this.handleTrigger.bind(this))
  }
}
