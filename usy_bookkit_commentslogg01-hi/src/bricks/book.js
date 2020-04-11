//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
//@@viewOff:imports

const Book = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.CcrWriterMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Book",
    classNames: {
      main: ""
    },
    opt: {
      ccrKey: "UuBookKit.BookReady"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  goToPage(pageCode, force, fragment){
    window.open("https://uuos9.plus4u.net/uu-dockitg01-main/78462435-b1c00e607db54b67af37ef060027664a/book/page?code="+pageCode);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        {this.props.children}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Book;
