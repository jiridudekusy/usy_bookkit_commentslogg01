import Calls from "../src/calls.js";
import HttpClient from "./http-client.js";

const appAssetsBaseUri = (
  document.baseURI ||
  (document.querySelector("base") || {}).href ||
  location.protocol + "//" + location.host + location.pathname
).replace(/^(.*)\/.*$/, "$1/"); // strip what's after last slash

/**
 * Mocks
 */
Calls.call = (method, url, dtoIn) => {
  let mockUrl = appAssetsBaseUri + "mock/data/" + url + ".json";
  return HttpClient.get(mockUrl, dtoIn.done, dtoIn.fail);
};

Calls.getCommandUri = (aUseCase) => {
  return aUseCase;
};

export default Calls;
