//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-app";
import "uu5flextilesg01";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import AppContext from "./app-context"
import SpaReady from "./spa-ready";
import Calls from "calls"
import {CommentsDb} from "../bricks/comments-db";

//@@viewOff:imports

const SpaAuthenticated = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaAuthenticated",
    classNames: {
      main: ""
    },
    lsi: {
      name: Lsi.appName
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    identity: UU5.PropTypes.shape()
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
  async loadData() {
    let configurationResponse = await Calls.getConfiguration();
    let configuration = configurationResponse.configuration;
    Calls.BOOKKIT_URI = configuration.bookUri;
    let bookData = await Calls.loadBook();
    let comments = await Calls.loadComments({active: true});
    let commentsDb = await CommentsDb.create(bookData, comments);
    return {configuration, bookData, commentsDb};
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <AppContext.Provider
        onLoad={this.loadData}
        loading={<UU5.Bricks.Loading>Loading configuration</UU5.Bricks.Loading>}
      >
        <AppContext.Consumer>
          {({data, viewState, errorState, errorData}) => {
            if (viewState === "error") {
              return <UU5.Common.Error errorData={errorData} errorInfo={errorData}/>;
            } else if (viewState === "ready") {
              return <SpaReady identity={this.props.identity} bookData={data.bookData} configuration={data.configuration}/>
            } else {
              return <UU5.Bricks.Loading/>
            }
          }}
        </AppContext.Consumer>
      </AppContext.Provider>
    );
  }
  //@@viewOff:render
});

export default SpaAuthenticated;
