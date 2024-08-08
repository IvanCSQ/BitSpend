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
    // this.#createLabel('you')
    // this.#createMessage(this.promptTarget.value)
    // this.#createLabel('assistant')
    this.#createUserMessage(this.promptTarget.value)
    this.currentContent = this.#createBotMessage();
    this.#setupEventSource();
    this.promptTarget.value = "";
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
        this.#createAutoMessage("Ok saved!")
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
        this.#createAutoMessage("Ok I've cleared our chat history!")
      } else {
        alert('Error: ' + data.errors.join(', '))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while resetting the chat.')
    }
  }

  #createUserMessage(text) {
    // Create the chat-bubble-user container
    const chatBubbleUser = document.createElement('div');
    chatBubbleUser.className = 'chat-bubble-user';

    // Create the chat-bubble-top container
    const bubbleTop = document.createElement('div');
    bubbleTop.className = 'chat-bubble-top';

    // Create the chat-name-user element
    const nameUser = document.createElement('div');
    nameUser.className = 'chat-name-user';
    nameUser.innerText = 'you';

    // Append chat-name-user to chat-bubble-top
    bubbleTop.appendChild(nameUser);

    // Create the chat-bubble-mid container
    const bubbleMid = document.createElement('div');
    bubbleMid.className = 'chat-bubble-mid';

    // Create the chat-content container
    const chatContent = document.createElement('div');
    chatContent.className = 'chat-content';

    // Create the paragraph element and set its content
    const contentElement = document.createElement('p');
    contentElement.innerHTML = text;

    // Create the chat-bubble-bottom container
    const bubbleBottom = document.createElement('div');
    bubbleBottom.className = 'chat-bubble-bottom';

    // Append the paragraph to the chat-content container
    chatContent.appendChild(contentElement);

    // Append chat-bubble-top to chat-bubble-user
    chatBubbleUser.appendChild(bubbleTop);
    chatBubbleUser.appendChild(bubbleMid);

    // Append chat-content, chat-bubble-mid and chat-bubble-top to chat-bubble-user
    chatBubbleUser.appendChild(chatContent);
    chatBubbleUser.appendChild(bubbleMid);
    chatBubbleUser.appendChild(bubbleBottom);

    // Append chat-bubble-user to the responseTarget
    this.responseTarget.appendChild(chatBubbleUser);

    // Scroll to the bottom of the responseTarget
    this.responseTarget.scrollTop = this.responseTarget.scrollHeight;
  }

  #createBotMessage(text) {
    // Create the chat-bubble-bot container
    const chatBubbleBot = document.createElement('div');
    chatBubbleBot.className = 'chat-bubble-bot';

    // Create the chat-bubble-top container
    const bubbleTop = document.createElement('div');
    bubbleTop.className = 'chat-bubble-top';

    // Create the chat-name-bot element
    const nameBot = document.createElement('div');
    nameBot.className = 'chat-name-bot';
    nameBot.innerText = 'assistant';

    // Create the chat-bubble-mid container
    const bubbleMid = document.createElement('div');
    bubbleMid.className = 'chat-bubble-mid';

    // Create the chat-content container
    const chatContent = document.createElement('div');
    chatContent.className = 'chat-content';

    // Create the loading indicator element
    const loadingElement = document.createElement('p');
    loadingElement.className = 'loading-indicator';
    loadingElement.innerText = '... ...';

    // Create the chat-bubble-bottom container
    const bubbleBottom = document.createElement('div');
    bubbleBottom.className = 'chat-bubble-bottom';

    // Append chat-name-user to chat-bubble-top
    bubbleTop.appendChild(nameBot);

    // Append chat-bubble-top to chat-bubble-user
    chatBubbleBot.appendChild(bubbleTop);
    chatBubbleBot.appendChild(bubbleMid);

    // Append chat-content, chat-bubble-mid and chat-bubble-top to chat-bubble-user
    chatBubbleBot.appendChild(chatContent);
    chatBubbleBot.appendChild(bubbleMid);
    chatBubbleBot.appendChild(bubbleBottom);

    // const contentElement = document.createElement('p')
    // contentElement.innerHTML = `${text}`

    // Append the paragraph to the chat-content container
    // chatContent.appendChild(contentElement);

    // Append the loading indicator to chatContent
    chatContent.appendChild(loadingElement);

    // Append chat-bubble-user to the responseTarget
    this.responseTarget.appendChild(chatBubbleBot);

    // Scroll to the bottom of the responseTarget
    this.responseTarget.scrollTop = this.responseTarget.scrollHeight;

    return { chatContent, loadingElement };
  }

  #createAutoMessage(text) {
    // Create the chat-bubble-bot container
    const chatBubbleBot = document.createElement('div');
    chatBubbleBot.className = 'chat-bubble-bot';

    // Create the chat-bubble-top container
    const bubbleTop = document.createElement('div');
    bubbleTop.className = 'chat-bubble-top';

    // Create the chat-name-bot element
    const nameBot = document.createElement('div');
    nameBot.className = 'chat-name-bot';
    nameBot.innerText = 'assistant';

    // Create the chat-bubble-mid container
    const bubbleMid = document.createElement('div');
    bubbleMid.className = 'chat-bubble-mid';

    // Create the chat-content container
    const chatContent = document.createElement('div');
    chatContent.className = 'chat-content';

    // Create the chat-bubble-bottom container
    const bubbleBottom = document.createElement('div');
    bubbleBottom.className = 'chat-bubble-bottom';

    // Append chat-name-user to chat-bubble-top
    bubbleTop.appendChild(nameBot);

    // Append chat-bubble-top to chat-bubble-user
    chatBubbleBot.appendChild(bubbleTop);
    chatBubbleBot.appendChild(bubbleMid);

    // Append chat-content, chat-bubble-mid and chat-bubble-top to chat-bubble-user
    chatBubbleBot.appendChild(chatContent);
    chatBubbleBot.appendChild(bubbleMid);
    chatBubbleBot.appendChild(bubbleBottom);

    const contentElement = document.createElement('p')
    contentElement.innerHTML = `${text}`

    // Append the paragraph to the chat-content container
    chatContent.appendChild(contentElement);

    // Append chat-bubble-user to the responseTarget
    this.responseTarget.appendChild(chatBubbleBot);

    // Scroll to the bottom of the responseTarget
    this.responseTarget.scrollTop = this.responseTarget.scrollHeight;
  }

// ORIGINAL CODE
  // #createLabel(text) {
  //   const label = document.createElement('strong')
  //   label.innerText = `${text}`
  //   this.responseTarget.appendChild(label)
  // }
  // #createMessage(text) {
    // const contentElement = document.createElement('p')
    // contentElement.innerHTML = `${text}`
    // this.responseTarget.appendChild(contentElement)
  //   this.responseTarget.scrollTop = this.responseTarget.scrollHeight
  //   return contentElement
  // }

  #setupEventSource() {
    this.eventSource = new EventSource(`/conversation_responses?prompt=${this.promptTarget.value}`)
    this.eventSource.addEventListener("message", this.#handleMessage.bind(this))
    this.eventSource.addEventListener("error", this.#handleError.bind(this))
  }

  // ORIGINAL CODE
  // #handleMessage(event) {
  //   const parsedData = JSON.parse(event.data)
  //   new Typed(this.currentContent, {
  //     strings: [marked.parse(parsedData.message)],
  //     showCursor: false,
  //     onComplete: () => {
  //       this.responseTarget.scrollTop = this.responseTarget.scrollHeight
  //     }
  //   });
  // }

  #handleMessage(event) {
    const parsedData = JSON.parse(event.data);

    // Ensure chatContent and loadingElement are set
    const { chatContent, loadingElement } = this.currentContent;

    // Remove the loading indicator
    if (loadingElement) {
      chatContent.removeChild(loadingElement);
    }

    // Create a new paragraph for the message content
    const contentElement = document.createElement('p');
    chatContent.appendChild(contentElement);

    new Typed(contentElement, {
      strings: [marked.parse(parsedData.message)],
      showCursor: false,
      onComplete: () => {
        this.responseTarget.scrollTop = this.responseTarget.scrollHeight
      }
    });

    // Ensure the responseTarget scrolls to the bottom
    this.responseTarget.scrollTop = this.responseTarget.scrollHeight;
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
