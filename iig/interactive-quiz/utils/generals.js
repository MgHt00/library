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
    if (!path.startsWith('/')) { // ensuring the path starts with a / to avoid any relative path issues.
      path = '/' + path;
    }
    const currentURL = new URL(window.location.href);
    // captures the path up to the last /, excluding the file name (if present) but including the subdirectory.
    // const basePath = `${currentURL.origin}${currentURL.pathname.substring(0, currentURL.pathname.lastIndexOf('/'))}`; 
    const originPath = currentURL.origin;
    const absoluteURL = new URL(path, originPath);
    console.info("Path:", path, "originPath:", originPath, "Absolute URL:", absoluteURL.href);
    console.groupEnd();
    return absoluteURL.href;
  }
}
