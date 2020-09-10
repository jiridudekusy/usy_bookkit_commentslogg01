import UU5 from "uu5g04";
import "uu5g04-forms";
import "uu_bookkit_uu5libg01-review"
import FilterRenderUtils from "../../bricks/helpers/FilterRenderUtils";
import CommentsLsi from "../../lsi/routes/comments-lsi";

const css = UU5.Common.Css.css;

const commentsLogUcSettings = {
  columns: [
    {
      id: "name",
      headers: [
        {
          label: CommentsLsi.columns.comment
        }
      ],
      cellComponent: (commentThread) => {
        const UuBookKit = window.UuBookKit;
        commentThread.comments = commentThread.commentList;
        return <UuBookKit.Review.CommentThread {...commentThread}/>
      },
      tileComponent: ({name}) => {
        return (
          <UU5.Common.Fragment>
            <div>
              <strong>
                Name
              </strong>{" "}
              {name}
            </div>
          </UU5.Common.Fragment>
        );
      },
      width: "l"
    }
  ],
  filters: [
    {
      key: "fulltext",
      label: CommentsLsi.filters.fulltext,
      component: <UU5.Forms.Text/>
    },
    {
      key: "created",
      label: CommentsLsi.filters.created,
      ...FilterRenderUtils.renderDateTimeRangePicker()
    },
    {
      key: "modified",
      label: CommentsLsi.filters.modified,
      ...FilterRenderUtils.renderDateTimeRangePicker()
    }
  ]
};

export default commentsLogUcSettings;
