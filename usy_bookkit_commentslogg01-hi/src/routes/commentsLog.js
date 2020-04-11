//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-bricks";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import "uu5flextilesg01";
import Calls from "../calls";
import commentsLogUcSettings from "./config/commentsLogUcSettings";
import bookData from "./config/bookData";
import Book from "../bricks/book";
import lunr from "lunr";
import cloneDeep from "clone-deep";

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
  async loadData(dtoIn) {
    let loadedData;
    let pageInfo = dtoIn.pageInfo;
    let lunrIdx;
    let loadedDataIdMap;
    if (!this.state.loadedData) {
      loadedData = await this._loadDataInternal(dtoIn);
      let loadedDataIdMap = loadedData.itemList.reduce((agg, c) => {
        agg[c.id] = c;
        return agg;
      }, {})
      lunrIdx = this._indexComments(loadedData);
      this.setState({loadedData, loadedDataIdMap, lunrIdx});
    } else {
      loadedData = this.state.loadedData;
      lunrIdx = this.state.lunrIdx;
      loadedDataIdMap = this.state.loadedDataIdMap;
    }
    let res = {};
    let resData = this._filterRecords(dtoIn, loadedData, loadedDataIdMap, lunrIdx);
    res.itemList = resData.slice(pageInfo.pageIndex * pageInfo.pageSize, (pageInfo.pageIndex + 1) * pageInfo.pageSize);
    res.pageInfo = pageInfo;
    res.pageInfo.total = resData.length;

    //FIXME: Remove this when flextilelist can correctly recalculate tile height.
    if (pageInfo.pageIndex === 0) {
      this.setState({listKey: new Date().getTime()});
    }
    return res;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  async _loadDataInternal(dtoIn) {
    dtoIn.active = true;
    delete dtoIn.pageInfo;
    return Calls.loadComments(dtoIn)
    .then(dtoOut => {
      console.log(dtoOut);
      dtoOut.itemList.forEach(i => {
        i.pageName = i.page;
        i.readOnly = true;
      });
      return dtoOut;
    });
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _indexComments(dtoOut) {
    let lunrIdx = lunr(function () {
      this.field('content');
      this.metadataWhitelist = ['position'];
      dtoOut.itemList
      .map(c => {
        return {content: c.commentList[0].content, id: c.id}
      })
      .forEach(c => this.add(c));
    });
    return lunrIdx;
  },
  _filterRecords(dtoIn, loadedData, loadedDataIdMap, lunrIdx) {
    let records;
    if (dtoIn.filterMap.fulltext) {
      let searchResult = lunrIdx.search(dtoIn.filterMap.fulltext);
      console.log(searchResult);
      records = searchResult.map(sri => {
        let res = cloneDeep(loadedDataIdMap[sri.ref])
        this._highlightSearchResults(res, sri);
        return res;
      });
    } else {
      records = loadedData.itemList;
    }
    return records;
  },
  _highlightSearchResults(document, searchResult) {
    let metadata = searchResult.matchData.metadata;
    let fieldName = "content"
    let highlightTuples = Object.keys(metadata).reduce((agg, term) => {
      if (metadata[term][fieldName]) {
        agg.push(...metadata[term][fieldName].position);
      }
      return agg;
    },[]);
    if (highlightTuples.length > 0) {
      highlightTuples.sort((a, b) => a[0]-b[0]);
      let prevEnd = 0;
      let re = "^";
      let replacement = "";
      for (let i = 0; i < highlightTuples.length; i++) {
        let pos = highlightTuples[i];
        re+=`(.{${pos[0]-prevEnd}})(.{${pos[1]}})`;
        prevEnd = pos[0]+pos[1];
        replacement += `$${i*2+1}<strong>$${i*2+2}</strong>`
      }
      debugger
      document.commentList[0].content = document.commentList[0].content.replace(new RegExp(re, "s"), replacement);
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    console.log(UU5.FlexTiles);
    let listKey = this.state.listKey || new Date().getTime();
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Section level="2" header="Comments Log">
          <Book bookData={bookData}>
            <UU5.FlexTiles.DataManager onLoad={this.loadData} pageSize={50}>
              <UU5.FlexTiles.ListController ucSettings={commentsLogUcSettings}>
                <UU5.FlexTiles.List key={listKey} bars={[<UU5.FlexTiles.FilterBar/>, <UU5.FlexTiles.SorterBar/>]}/>
              </UU5.FlexTiles.ListController>
            </UU5.FlexTiles.DataManager>
          </Book>
        </UU5.Bricks.Section>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default CommentsLog;
