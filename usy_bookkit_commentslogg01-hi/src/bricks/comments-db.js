import lunr from "lunr";
import cloneDeep from "clone-deep";

export class CommentsDb {
  constructor(bookData, comments) {
    this.bookData = bookData;
    this.comments = comments.itemList;
    this.total = comments.pageInfo.total;

    this._initialize();
  }

  search(dtoIn, highlightResult) {
    let pageInfo = dtoIn.pageInfo;

    let dtoOut = {pageInfo};
    let resData = this._filterRecords(dtoIn);
    dtoOut.pageInfo.total = resData.length;
    resData = this._sortAndPaginateRecords(dtoIn, resData);
    this._highlightSearchResults(resData);
    dtoOut.itemList = resData;
    return dtoOut;
  }

  _initialize() {
    let processedComments = this._preprocessThreads(this.comments);
    this.idx = this._indexComments(processedComments);

    this.idMap = processedComments.reduce((agg, c) => {
      agg[c.id] = c;
      return agg;
    }, {})
  }

  _indexComments(comments) {
    let lunrIdx = lunr(function () {
      this.field('content');
      this.metadataWhitelist = ['position'];
      comments.map(c => {
        return {content: c.content, id: c.id}
      })
      .forEach(c => this.add(c));
    });
    return lunrIdx;
  }

  _preprocessThreads(threads){
    let processedThreads = threads
      .map(this._preprocessThread)
      .map(this._flattenComments)
      .reduce((agg, thread) => [...agg, ...thread]);
    return processedThreads;
  }

  _preprocessThread(thread){
    thread.commentList.forEach((comment) => {
      thread.content += comment.content +"\n";
    })
    return thread;
  }

  _flattenComments(thread) {
    let searchComments = thread.commentList.map(comment => {
      let res = {...thread, ...comment};
      delete res.commentList;
      res.commentId = res.id;
      res.id = `${thread.page}-${thread.id}-${res.id}`;
      res.threadId = thread.id;
      res._internal = true;
      return res;
    });
    return [thread, ...searchComments];
  }

  _filterRecords(dtoIn) {
    let records;
    let threadRecords = {};
    if (dtoIn.filterMap.fulltext) {
      let searchResult = this.idx.search(dtoIn.filterMap.fulltext);
      records = searchResult.reduce((agg, sri) => {
        let res = cloneDeep(this.idMap[sri.ref]);
        if(res._internal){
          let threadRecord = threadRecords[res.threadId];
          if(!threadRecord){
            threadRecords[res.threadId] = {},
            threadRecord = threadRecords[res.threadId]
          }
          res._internalSearchResult = sri;
          threadRecord[res.commentId] = res;
        }else{
          agg.push(res);
        }
        return agg;
      }, []);
    } else {
      records = this.comments;
    }
    records.forEach(rec => rec._internalSearchResults= threadRecords[rec.id]);
    return records;
  }

  _sortAndPaginateRecords(dtoIn, data) {
    let resData = data.slice(dtoIn.pageInfo.pageIndex * dtoIn.pageInfo.pageSize, (dtoIn.pageInfo.pageIndex + 1) * dtoIn.pageInfo.pageSize);
    return resData;
  }
  _highlightSearchResults(threads) {
    threads.forEach((thread)=>thread.commentList.forEach((comment)=> {
      if(thread._internalSearchResults && thread._internalSearchResults[comment.id]){
        this._highlightSearchResultsDocument(comment, thread._internalSearchResults[comment.id]._internalSearchResult)
      }
    }))
  }

  _highlightSearchResultsDocument(document, searchResult) {
    let metadata = searchResult.matchData.metadata;
    let fieldName = "content"
    let highlightTuples = Object.keys(metadata).reduce((agg, term) => {
      if (metadata[term][fieldName]) {
        agg.push(...metadata[term][fieldName].position);
      }
      return agg;
    }, []);
    if (highlightTuples.length > 0) {
      highlightTuples.sort((a, b) => a[0] - b[0]);
      let prevEnd = 0;
      let re = "^";
      let replacement = "";
      for (let i = 0; i < highlightTuples.length; i++) {
        let pos = highlightTuples[i];
        re += `(.{${pos[0] - prevEnd}})(.{${pos[1]}})`;
        prevEnd = pos[0] + pos[1];
        replacement += `$${i * 2 + 1}<strong>$${i * 2 + 2}</strong>`
      }
      document.content = document.content.replace(new RegExp(re, "s"), replacement);
    }
  }
}
