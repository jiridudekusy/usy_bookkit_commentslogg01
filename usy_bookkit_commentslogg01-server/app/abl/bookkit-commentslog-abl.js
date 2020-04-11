"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const Errors = require("../api/errors/bookkit-commentslog-error.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  }
};

class BookkitCommentslogAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async init(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    const schemas = ["bookkitCommentslog"];
    let schemaCreateResults = schemas.map(async schema => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    // HDS 3
    try {
      await SysProfileModel.setProfile(awid, { code: "Authorities", roleUri: dtoIn.authoritiesUri });
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A4
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.authoritiesUri }, e);
      }
      throw e;
    }

    // HDS 4 - HDS N
    // TODO Implement according to application needs...

    // HDS N+1
    return {
      uuAppErrorMap: uuAppErrorMap
    };
  }
}

module.exports = new BookkitCommentslogAbl();
