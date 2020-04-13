//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";
import "uu5flextilesg01";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import Left from "./left.js";
import Bottom from "./bottom.js";
import About from "../routes/about.js";
import Home from "../routes/home.js";
import CommentsLog from "../routes/commentsLog";
import CommentsThreadTest from "../routes/commentsThreadTest";


//@@viewOff:imports

const SpaReady = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.CcrWriterMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaReady",
    classNames: {
      main: ""
    },
    lsi: {
      name: Lsi.appName
    },
    opt: {
      ccrKey: "UuBookKit.BookReady"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    identity: UU5.PropTypes.shape(),
    initData: UU5.PropTypes.shape().isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      identity: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  goToPage(pageCode, force, fragment){
    window.open(this.props.configuration.bookUri + "book/page?code="+pageCode);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private

  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <Plus4U5.App.Page
        {...this.getMainPropsToPass()}
        top={<Plus4U5.App.Top content={this.getLsiComponent("name")}/>}
        bottom={<Bottom/>}
        type={2}
        displayedLanguages={["cs", "en"]}
        left={<Left identity={this.props.identity}/>}
        leftWidth="!xs-320px !s-320px !m-256px l-256px xl-256px"
      >
        <UU5.Common.Router
          routes={{
            "": "home",
            home: {component: <Home identity={this.props.identity}/>},
            about: {component: <About identity={this.props.identity}/>},
            commentsLog: {component: <CommentsLog/>},
            commentsThreadTest: {component: <CommentsThreadTest/>}
          }}
          controlled={false}
        />
      </Plus4U5.App.Page>
    );
  }
  //@@viewOff:render
});

export default SpaReady;
