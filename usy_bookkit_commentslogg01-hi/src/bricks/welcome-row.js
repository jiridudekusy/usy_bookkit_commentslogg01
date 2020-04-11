//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
//@@viewOff:imports

const WelcomeRow = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "WelcomeRow",
    classNames: {
      main: () => Config.Css.css`
        padding: 24px 0;
        max-width: 624px;
        margin: 0 auto;
      `,
      text: () => Config.Css.css`
        text-align: center;

        ${UU5.Utils.ScreenSize.getMinMediaQueries("s", `text-align: left;`)}
      `,
      iconColumn: () => Config.Css.css`
        padding-right: 24px;
        text-align: center;
      
        ${UU5.Utils.ScreenSize.getMinMediaQueries("s", `text-align: right;`)}
      
        .uu5-bricks-icon {
          font-size: 48px;
        }
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    icon: UU5.PropTypes.string,
    textPadding: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      icon: undefined, // default of UU5.Bricks.Icon
      textPadding: null
    };
  },
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
    let margin = "-" + this.props.textPadding;
    return (
      <UU5.Bricks.Row {...this.getMainPropsToPass()}>
        <UU5.Bricks.Column className={this.getClassName("iconColumn")} colWidth="xs-12 s-2">
          <UU5.Bricks.Icon icon={this.props.icon} style={{ marginTop: margin, marginBottom: margin }} />
        </UU5.Bricks.Column>
        <UU5.Bricks.Column className={this.getClassName("text")} colWidth="xs-12 s-10" content={this.props.children} />
      </UU5.Bricks.Row>
    );
  }
  //@@viewOff:render
});

export default WelcomeRow;
