import UU5 from "uu5g04";

const css = UU5.Common.Css.css;

const FilterRenderUtils = {
  renderDateTimeRangePicker() {
    return {
      component: <UU5.Forms.DateTimeRangePicker
        showTodayButton={true}
        inputWidth="auto"
        //there mus be inline style, because className cannot override this
        style="flex-grow: 0"
        className={css(`&& {
          flex-grow: 0
        }`)}
      />,
      getValueLabel: (value) => <UU5.Common.Fragment>
        <UU5.Bricks.DateTime value={value[0]} secondsDisabled/>
        <span> - </span>
        <UU5.Bricks.DateTime value={value[1]} secondsDisabled/>
      </UU5.Common.Fragment>
    }
  }
};

export default FilterRenderUtils;
