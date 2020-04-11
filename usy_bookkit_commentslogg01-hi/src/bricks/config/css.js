import UU5 from "uu5g04";
import Config from "./config.js";

export default UU5.Common.Css.createCssModule(
  Config.TAG.replace(/\.$/, "")
    .toLowerCase()
    .replace(/\./g, "-")
    .replace(/[^a-zA-Z-]/g, "")
);
