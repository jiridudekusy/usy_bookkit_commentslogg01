//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import Tools from "../core/tools.js";
//@@viewOff:imports

const LeftLink = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "LeftLink",
    classNames: {
      main: () => Config.Css.css`
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);

        .uu5-bricks-link {
          text-decoration: none;
          color: rgba(0, 0, 0, 0.87);
          display: flex;
          align-items: center;
      
          padding: 14px 14px 14px 24px;
      
          @media (min-width: 480px) {
            padding: 14px 16px;
          }
        }
      
        &:hover .uu5-bricks-link {
          background-color: #e0e0e0;
        }
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    route: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      route: null
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
  _goRoute() {
    // to reset menu
    UU5.Environment.App.menuRef.update("");
    UU5.Environment.setRoute(this.props.route);
  },

  _tabRoute() {
    // to reset menu
    UU5.Environment.App.menuRef.update("");
    Tools.openNewTab({ code: this.props.route });
  },

  _getChildren() {
    let children = UU5.Common.Children.toArray(this.props.children);

    if (typeof this.props.route === "string") {
      children = (
        <UU5.Bricks.Link onClick={this._goRoute} onWheelClick={this._tabRoute} onCtrlClick={this._tabRoute}>
          {children}
        </UU5.Bricks.Link>
      );
    }

    return children;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <UU5.Bricks.Div {...this.getMainPropsToPass()}>{this._getChildren()}</UU5.Bricks.Div>;
  }
  //@@viewOff:render
});

export default LeftLink;
