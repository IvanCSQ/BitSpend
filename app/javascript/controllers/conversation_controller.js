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

  upload(e) {
    e.preventDefault()
    const fileInput = e.target;
    const image = fileInput.files[0];
    const formData = new FormData()
    formData.append("image", image)

    fetch('/conversation_responses/upload', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': this.csrfToken,
      },
      body: formData,
    })
    .then(response => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error.message)
  })
}

  saveExpense(event) {
    event.preventDefault()
    this.#createExpense()
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
