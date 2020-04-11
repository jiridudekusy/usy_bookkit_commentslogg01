//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-bricks";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import "uu5flextilesg01";
import Book from "../bricks/book";
import bookData from "./config/bookData";

//@@viewOff:imports

const CommentsThreadTest = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "CommentsThreadTest",
    classNames: {
      main: ""
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
  getCommentThread(dtoIn) {
    let thread = {
      "name": "",
      "type": "comment",
      "personal": false,
      "page": "1_18_x",
      "commentPoint": "957643499e02b47a6be2eb7ae3c0bb46",
      "active": true,
      "author": "1-2006-1",
      "commentCount": 1,
      "commentList": [{
        "id": "ba6f0464c1c9fcaaad39d976588d28f3",
        "content": "TODO specify Environment Name and Color Configuration Values",
        "author": "1-2006-1",
        "authorName": "Jakub Eliáš",
        "active": true,
        "cts": 1584949721229,
        "mts": 1584949721229
      }]
    };
    thread.comments = thread.commentList;
    return thread;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    console.log(UU5.FlexTiles);
    const UuBookKit = window.UuBookKit;
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Section header="Commts test">
          <Book bookData={bookData}>
            <UuBookKit.Review.CommentThread {...this.getCommentThread()}/>
          </Book>
        </UU5.Bricks.Section>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default CommentsThreadTest;
