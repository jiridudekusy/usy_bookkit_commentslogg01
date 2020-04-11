//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import WelcomeRow from "../bricks/welcome-row.js";
//@@viewOff:imports

const Home = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Home",
    classNames: {
      main: "",
      welcomeRow: () => Config.Css.css`
        padding: 56px 0 20px;
        max-width: 624px;
        margin: 0 auto;
        text-align: center;
      
        ${UU5.Utils.ScreenSize.getMinMediaQueries("s", `text-align: left;`)}
      
        .uu5-bricks-header {
          margin-top: 8px;
        }
        
        .plus4u5-bricks-user-photo {
          margin: 0 auto;
        }
      `
    },
    lsi: Lsi.auth
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    identity: UU5.PropTypes.shape()
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Row className={this.getClassName("welcomeRow")}>
          <UU5.Bricks.Column colWidth="x-12 s-3">
            <Plus4U5.Bricks.UserPhoto width="100px" />
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="x-12 s-9">
            <UU5.Bricks.Header level="2" content={this.getLsiComponent("welcome")} />
            <UU5.Bricks.Header level="2" content={this.props.identity.name} />
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
        <WelcomeRow textPadding="14px" icon="mdi-human-greeting">
          {this.getLsiComponent("intro")}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" icon="mdi-monitor">
          {this.getLsiComponent("clientSide")}
        </WelcomeRow>
        <WelcomeRow textPadding="8px" icon="mdi-server">
          {this.getLsiComponent("serverSide")}
        </WelcomeRow>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Home;
