import * as UU5 from "uu5g04";

const Tools = {
  openNewTab(component) {
    let url = UU5.Common.Url.parse()
      .setUseCase(component.code)
      .toString();
    window.open(url, "_blank");
  },

  setRoute: (component, setStateCallback) => {
    UU5.Environment.setRoute(component.code, null, setStateCallback);
  }
};

export default Tools;
