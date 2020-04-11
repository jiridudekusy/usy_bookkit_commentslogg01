import UU5 from "uu5g04";
import "uu5g04-forms";
import "uu_bookkit_uu5libg01-review"
//UuBookKit.Review

const commentsLogUcSettings = {
  columns: [
    {
      id: "name",
      headers: [
        {
          label: "Name"
        }
      ],
      cellComponent: (commentThread) => {
        const UuBookKit = window.UuBookKit;
        commentThread.comments = commentThread.commentList;
        return <UuBookKit.Review.CommentThread {...commentThread}/>
      },
      tileComponent: ({ name })=> {
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
      label: "Fulltext",
      component: <UU5.Forms.Text/>
    }
  ]
};

export default commentsLogUcSettings;
