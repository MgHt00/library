import { DisplayUtils } from "./displayUtils.js";

export class DomUtils {
  constructor() {
    this.displayUtils = new DisplayUtils();
  }

  // Toggling the disabled state of a node with an optional delay
  setNodeDisabled({ node, isDisabled, changeItFast }) {
    console.groupCollapsed("setNodeDisabled()");

    console.info("Node to change: ", node);
    console.info("isDiabled :", isDisabled);
    console.info("Change it in fast mode:", changeItFast);

    const applyState = () => {
      node.disabled = isDisabled;
      if (isDisabled) {
        node.classList.add("disabled");
      } else {
        node.classList.remove("disabled");
      }
    };

    if (!changeItFast && isDisabled) { // Use setTimeout only when isDisabled is true, and if changeItFast is false.
      setTimeout(applyState, 300);
    } else {
      applyState();
    }

    console.groupEnd();
  }

  // To clean HTML node
  cleanNode({ node, isDeepClean = false }) {
    console.groupCollapsed("cleanNode()");
  
    if (!(node instanceof HTMLElement)) {
      console.warn("Provided node is not a valid HTML element.");
      console.groupEnd();
      return false; // Explicit return to signal invalid input
    }
  
    if (isDeepClean) {
      console.info("Performing deep cleaning.");
      node.innerHTML = ''; // Removes all child elements and their listeners
    } else {
      console.info("Performing light cleaning.");
      node.textContent = ''; // Removes only text content
    }
  
    console.groupEnd();
    return true; // Signal successful operation
  }

  // To build HTML element and add classes (if any)
  buildNode({ element, classNames =[] }) {
    console.groupCollapsed("buildNode()");
    console.log("Building Node: ", element);
    const BLK = document.createElement(element);

    // Add classes if provided
    this.displayUtils.addClass({ element: BLK, classNames });

    console.groupEnd();
    return BLK;
  }
}
