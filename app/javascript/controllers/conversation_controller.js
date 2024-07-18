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

  generateResponse(event) {
    event.preventDefault()
    this.#createLabel('you')
    this.#createMessage(this.promptTarget.value)
    this.#createLabel('assistant')
    this.currentContent = this.#createMessage("")
    this.#setupEventSource()
    this.promptTarget.value = ""
  }

  #createLabel(text) {
    const label = document.createElement('strong')
    label.innerText = `${text}`
    this.responseTarget.appendChild(label)
  }

  #createMessage(text) {
    const contentElement = document.createElement('p') // pre element preserves spaces and line breaks
    contentElement.innerHTML = `${text}`
    this.responseTarget.appendChild(contentElement)
    this.responseTarget.scrollTop = this.responseTarget.scrollHeight
    return contentElement
  }

  #setupEventSource() {
    this.eventSource = new EventSource(`/conversation_responses?prompt=${this.promptTarget.value}`)
    this.eventSource.addEventListener("message", this.#handleMessage.bind(this))
    this.eventSource.addEventListener("error", this.#handleError.bind(this))
  }

  #handleMessage(event) {
    const parsedData = JSON.parse(event.data)
    // this.currentContent.innerHTML += marked.parse(parsedData.message)
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