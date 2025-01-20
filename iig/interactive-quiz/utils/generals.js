export class Generals {

  // To generate a random number
  random(min, max) {
    console.groupCollapsed("random()");
    if (min > max) {
      console.error("Invalid range: min should not be greater than max.");
      return null;
    }
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    console.info("min:", min, "max:", max,"randonNumber:", randomNumber)
    console.groupEnd();
    return randomNumber;
  }

  // Construct an absolute URL from a relative path
  constructAbsoluteURL(path) {
    console.groupCollapsed("constructAbsoluteURL()");
    
    // Check if path starts with '/'. Remove it to prevent absolute path behavior
    // When the path is an absolute path (starting with /), it overrides the baseURL
      if (path.startsWith('/')) {
        path = path.substring(1);
    }
    console.info("path:", path);

    const currentURL = new URL(window.location.href);
    const urlOrigin = currentURL.origin;
    const urlPathName = currentURL.pathname;

    const baseURL = `${urlOrigin}${urlPathName}`;
    console.info("baseURL:", baseURL);

    const absoluteURL = new URL(path, baseURL);
    console.info("absoluteURL.href:", absoluteURL.href);

    console.groupEnd();
    return absoluteURL.href;
  }
}
