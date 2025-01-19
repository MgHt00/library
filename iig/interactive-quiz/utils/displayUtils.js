export class DisplayUtils  {
  constructor() {

  }

  // To add textContent content at the desired HTML element
  addTextContent({ node, content }) {
    if (!(node instanceof HTMLElement)) {
      console.warn("Provided node is not a valid HTML element.");
      return false; // Explicit return to signal invalid input
    }
    node.textContent = content;
  }

  // To add class to a HTML node
  addClass({ element, classNames = [] }) {
    // Ensure classNames is an array, regardless of whether a string or array is passed
    if (!Array.isArray(classNames)) {
      classNames = [classNames];
    }

    classNames.forEach(c => {
      element.classList.add(c);
    });
  }

  // To remove specifed classes from the element
  removeClass({ element, classNames = [] }) {
    if (!Array.isArray(classNames)) {
      classNames = [classNames]
    }

    classNames.forEach(c => {
      element.classList.remove(c);
    });
  }

  // To remove ALL classes
  removeAllClass({ element }) {
    element.className = "";
  }
}
