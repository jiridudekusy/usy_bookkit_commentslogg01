import lunr from "lunr";
import cloneDeep from "clone-deep";

const FilterTypes = {
  FULLTEXT: "fulltext",
  POST: "post"
}

export class CommentsDb {

  static create(bookData, comments) {
    let res = new CommentsDb();
    res.bookData = bookData;
    res.comments = comments.itemList;
    res.total = comments.pageInfo.total;
    return new Promise((resolve, reject) => {
      try {
        res._initialize();
        resolve(res);
      } catch (e) {
        reject(e);
      }
    });
  }

  search(dtoIn, highlightResult) {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._searchInternal(dtoIn, highlightResult));
      } catch (e) {
        reject(e);
      }
    })
  }

  _searchInternal(dtoIn, highlightResult) {
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

  _preprocessThreads(threads) {
    let processedThreads = threads
    .map(this._preprocessThread.bind(this));
    this.comments = processedThreads;
    let comments = processedThreads.map(this._flattenComments)
    .reduce((agg, thread) => [...agg, ...thread]);
    return comments;
  }

  _preprocessThread(thread) {
    thread.commentList.forEach((comment) => {
      thread.content += comment.content + "\n";
      comment.sys = {
        mts: comment.mts,
        cts: comment.cts
      }
      this._sysTs2Date(comment.sys);
    });
    this._sysTs2Date(thread.sys);
    return thread;
  }

  _sysTs2Date(sys){
    sys.cts = new Date(sys.cts);
    sys.ctsTime = sys.cts.getTime();
    sys.mts = new Date(sys.mts);
    sys.mtsTime = sys.mts.getTime()
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
    let records = this._filterRecordsFulltext(dtoIn);
    records = this._filterRecordsPost(dtoIn, records);
    return records;
    // let records;
    // let threadRecords = {};
    // if (dtoIn.filterMap.fulltext) {
    //   let searchResult = this.idx.search(dtoIn.filterMap.fulltext);
    //   records = searchResult.reduce((agg, sri) => {
    //     let res = cloneDeep(this.idMap[sri.ref]);
    //     if (res._internal) {
    //       let threadRecord = threadRecords[res.threadId];
    //       if (!threadRecord) {
    //         threadRecords[res.threadId] = {},
    //           threadRecord = threadRecords[res.threadId]
    //       }
    //       res._internalSearchResult = sri;
    //       threadRecord[res.commentId] = res;
    //     } else {
    //       agg.push(res);
    //     }
    //     return agg;
    //   }, []);
    // } else {
    //   records = this.comments;
    // }
    //
    // records.forEach(rec => rec._internalSearchResults = threadRecords[rec.id]);
    // return records;
  }

  _filterRecordsPost(dtoIn, records) {
    let filterList = Object.keys(dtoIn.filterMap)
    .filter((filterId) => this.filters[filterId].type === FilterTypes.POST)
    .map((filterId) => {
      return {key: filterId, value: dtoIn.filterMap[filterId], filterFn: this.filters[filterId].filterFn}
    });
    if (filterList.length > 0) {
      records = records.filter((record) => {
        return !filterList.some((filterObject) => !filterObject.filterFn(filterObject, record))
      });
    }
    return records;
  }

  _filterRecordsFulltext(dtoIn) {
    let fulltextQuery = Object.keys(dtoIn.filterMap)
    .filter((filterId) => this.filters[filterId].type === FilterTypes.FULLTEXT)
    .map((filterId) => this.filters[filterId].createQuery({key: filterId, value: dtoIn.filterMap[filterId]}))
    .join(" ");
    let records;
    let threadRecords = {};
    if (fulltextQuery) {
      let searchResult = this.idx.search(fulltextQuery);
      records = searchResult.reduce((agg, sri) => {
        let res = cloneDeep(this.idMap[sri.ref]);
        if (res._internal) {
          let threadRecord = threadRecords[res.threadId];
          if (!threadRecord) {
            threadRecords[res.threadId] = {},
              threadRecord = threadRecords[res.threadId]
          }
          res._internalSearchResult = sri;
          threadRecord[res.commentId] = res;
        } else {
          agg.push(res);
        }
        return agg;
      }, []);
    } else {
      records = this.comments.map(cloneDeep);
    }

    records.forEach(rec => rec._internalSearchResults = threadRecords[rec.id]);
    return records;
  }

  _sortAndPaginateRecords(dtoIn, data) {
    let resData = data.slice(dtoIn.pageInfo.pageIndex * dtoIn.pageInfo.pageSize, (dtoIn.pageInfo.pageIndex + 1) * dtoIn.pageInfo.pageSize);
    return resData;
  }

  _highlightSearchResults(threads) {
    threads.forEach((thread) => thread.commentList.forEach((comment) => {
      if (thread._internalSearchResults && thread._internalSearchResults[comment.id]) {
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

  filters = {
    fulltext: {
      type: FilterTypes.FULLTEXT,
      createQuery: (filter) => filter.value,
    },
    created: {
      type: FilterTypes.POST,
      filterFn: (filter, comment) => this.filterDateTimeRange(filter, comment.sys.ctsTime)
    },
    modified: {
      type: FilterTypes.POST,
      filterFn: (filter, comment) => this.commentsFilter(filter, comment, (filter, comment)=>this.filterDateTimeRange(filter, comment.sys.mtsTime))
    }
  }

  filterDateTimeRange(filter, date) {
    return date >= filter.value[0].getTime() && date < filter.value[1].getTime();
  }

  commentsFilter(filter, thread, filterFn) {
    return thread.commentList.some((comment) => filterFn(filter, comment))
  }

}
