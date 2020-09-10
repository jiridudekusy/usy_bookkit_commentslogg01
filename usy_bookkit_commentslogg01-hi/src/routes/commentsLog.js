//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-bricks";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import "uu5flextilesg01";
import commentsLogUcSettings from "./config/commentsLogUcSettings";
import AppContext from "../core/app-context";

//@@viewOff:imports

const CommentsLog = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "CommentsLog",
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
  loadData(dtoIn, commentsDb) {
    return commentsDb.search(dtoIn).then((dtoOut) => {
      //FIXME: Remove this when flextilelist can correctly recalculate tile height.
      if (dtoIn.pageInfo.pageIndex === 0) {
        this.setState({listKey: new Date().getTime()});
      }
      return dtoOut;
    });
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _loadDataProvider(commentsDb) {
    return dtoIn => this.loadData(dtoIn, commentsDb);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let listKey = this.state.listKey || new Date().getTime();
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Section level="2" header="Comments Log">
          <AppContext.Consumer>
            {({data}) => {
              return (<UU5.FlexTiles.DataManager onLoad={this._loadDataProvider(data.commentsDb)} pageSize={50}>
                <UU5.FlexTiles.ListController ucSettings={commentsLogUcSettings}>
                  <UU5.FlexTiles.List key={listKey} bars={[<UU5.FlexTiles.FilterBar/>, <UU5.FlexTiles.SorterBar/>]}/>
                </UU5.FlexTiles.ListController>
              </UU5.FlexTiles.DataManager>)
            }}
          </AppContext.Consumer>
        </UU5.Bricks.Section>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default CommentsLog;
