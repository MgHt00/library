import contentManager from "./contentManager.js";
import controlManager from "./controlManager.js";
import listenerManager from "./listenerManager.js";

export class Quiz {
  constructor(globalInstance) {
    this.global = globalInstance;
    this.controlMgr = controlManager(this.global); 
    
    // Initialize listenerMgr with a temporary contentMgr reference [LE01]
    this.listenerMgr = null;
    this.contentMgr = contentManager(this.global, this.listenerMgr, this.controlMgr); 
    
    // Now that contentMgr is initialized, assign it to listenerMgr
    this.listenerMgr = listenerManager(this.global, this.contentMgr, this.controlMgr); 
    
    // Update the contentMgr's reference to listenerMgr
    this.contentMgr.setListenerMgr(this.listenerMgr);
  
  }

  initialize() {
    this.contentMgr.start();
    this.global.nextButton.disabled = true; // Disable `global.nextButton` at the start
    this.global.nextButton.addEventListener("click", this.listenerMgr.nextButtonClick); // Add event listener to Next button
  }
}
