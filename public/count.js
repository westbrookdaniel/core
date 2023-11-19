class CountButton extends HTMLButtonElement {
  static observedAttributes = ["count"];
  props = {};

  attributeChangedCallback(name, _oldValue, newValue) {
    this.props[name] = parseInt(newValue);

    this.render();
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("click", () => {
      this.setAttribute("count", this.props.count + 1);
    });
  }

  render() {
    this.innerText = this.innerText.replace(/\d+/, this.props.count);
  }
}

customElements.define("count-button", CountButton, { extends: "button" });
