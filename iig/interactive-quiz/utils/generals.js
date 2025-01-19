export class Generals {
  constructor() {
    
  }

  // To generate a random number
  random(min, max) {
    console.groupCollapsed("random()");
    const randonNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    console.info("min:", min, "max:", max,"randonNumber:", randonNumber)
    console.groupEnd();
    return randonNumber
  }
}
