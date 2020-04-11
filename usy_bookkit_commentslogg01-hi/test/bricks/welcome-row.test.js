import { mount, shallow } from "enzyme";
import WelcomeRow from "../../src/bricks/welcome-row.js";

describe("WelcomeRow", function() {
  test("should render props", function() {
    let icon = "mdi-check";
    let textPadding = "111px";
    let children = "asdfegsdf";
    let wrapper = mount(
      <WelcomeRow id="id" icon={icon} textPadding={textPadding}>
        {children}
      </WelcomeRow>
    );

    let renderedHtml = wrapper.html();
    expect(renderedHtml).toContain(icon);
    expect(renderedHtml).toContain(textPadding);
    expect(renderedHtml).toContain(children);
  });

  test("should match snapshot", function() {
    let icon = "mdi-check";
    let textPadding = "111px";
    let wrapper = shallow(<WelcomeRow id="id" icon={icon} textPadding={textPadding} />);
    expect(wrapper).toMatchSnapshot();
  });

  // test("API test - should support hello() method", function() {
  //   let wrapper = mount(<WelcomeRow id="id" />);
  //   let componentInstance = wrapper.instance();

  //   expect(typeof componentInstance.hello).toBe("function");
  //   expect(wrapper.state("counter")).toBe(0);
  //   componentInstance.hello();
  //   expect(wrapper.state("counter")).toBe(1);

  //   wrapper.unmount();
  // });
});
