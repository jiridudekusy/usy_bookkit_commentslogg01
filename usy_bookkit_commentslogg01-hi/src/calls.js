/**
 * Server calls of application client.
 */
import * as UU5 from "uu5g04";
import Plus4U5 from "uu_plus4u5g01";

let Calls = {
  /** URL containing app base, e.g. "https://uuos9.plus4u.net/vnd-app/awid/". */
  APP_BASE_URI: location.protocol + "//" + location.host + UU5.Environment.getAppBasePath(),

  BOOKKIT_URI: "https://uuos9.plus4u.net/uu-dockitg01-main/78462435-b1c00e607db54b67af37ef060027664a/",

  call(method, url, dtoIn, clientOptions) {
    return Plus4U5.Common.Calls.call(method, url, dtoIn, clientOptions);
  },

  promiseCall(method, url, data, clientOptions) {
    return new Promise((done, fail) => {
      Calls.call(method, url, {data, done, fail}, clientOptions)
    })
  },

  loadComments(data) {
    return Calls.promiseCall("get",
      Calls.getCommandUri("listCommentThreads", Calls.BOOKKIT_URI),
      data
    );
  },

  loadBook(data) {
    return Calls.promiseCall("get",
      Calls.getCommandUri("loadBook", Calls.BOOKKIT_URI),
      data
    );
  },

  getConfiguration(dtoInData) {
    return Calls.promiseCall("get",
      Calls.getCommandUri("app/getConfiguration", Calls.APP_BASE_URI),
      dtoInData
    )
  },

  /*
  For calling command on specific server, in case of developing client site with already deployed
  server in uuCloud etc. You can specify url of this application (or part of url) in development
  configuration in *-client/env/development.json, for example:
   {
     ...
     "uu5Environment": {
       "gatewayUri": "https://uuos9.plus4u.net",
       "tid": "84723877990072695",
       "awid": "b9164294f78e4cd51590010882445ae5",
       "vendor": "uu",
       "app": "demoappg01",
       "subApp": "main"
     }
   }
   */
  getCommandUri(aUseCase, base) {
    // useCase <=> e.g. "getSomething" or "sys/getSomething"
    // add useCase to the application base URI
    let targetUriStr = base + aUseCase.replace(/^\/+/, "");

    // override tid / awid if it's present in environment (use also its gateway in such case)
    if (process.env.NODE_ENV !== "production") {
      let env = UU5.Environment;
      if (env.tid || env.awid || env.vendor || env.app) {
        let url = Plus4U5.Common.Url.parse(targetUriStr);
        if (env.tid || env.awid) {
          if (env.gatewayUri) {
            let match = env.gatewayUri.match(/^([^:]*):\/\/([^/]+?)(?::(\d+))?(\/|$)/);
            if (match) {
              url.protocol = match[1];
              url.hostName = match[2];
              url.port = match[3];
            }
          }
          if (env.tid) {
            url.tid = env.tid;
          }
          if (env.awid) {
            url.awid = env.awid;
          }
        }
        if (env.vendor || env.app) {
          if (env.vendor) {
            url.vendor = env.vendor;
          }
          if (env.app) {
            url.app = env.app;
          }
          if (env.subApp) {
            url.subApp = env.subApp;
          }
        }
        targetUriStr = url.toString();
      }
    }

    return targetUriStr;
  }
};

export default Calls;
