const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initApp();
  await TestHelper.initAppWorkspace();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the init uuCmd...", () => {
  test("HDS", async () => {
    await TestHelper.login("AwidOwner");

    let dtoIn = {
      authoritiesUri: "urn:uu:GGALL"
    };
    let result = await TestHelper.executePostCommand("init", dtoIn);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});
