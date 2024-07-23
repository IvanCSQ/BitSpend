import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="upload-images"
export default class extends Controller {
  connect() {
    console.log("upload controller connected");
  }

  submit(event) {
    const fileInput = event.target;
    const image = fileInput.files[0];

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
      }
      }
  }
}
