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
