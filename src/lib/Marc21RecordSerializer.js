// This file is part of Invenio.
//
// Copyright (C) 2021-2022 Graz University of Technology.
//
// React-Records-Marc21 is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import { DepositRecordSerializer } from "react-invenio-deposit";
import { cloneDeep, defaults, pick, set } from "lodash";
import { Field, Marc21MetadataFields } from "./fields";

export class Marc21RecordSerializer extends DepositRecordSerializer {
  constructor(defaultLocale) {
    super();
    this.defaultLocale = defaultLocale;
  }

  depositRecordSchema = {
    access: new Field({
      fieldpath: "access",
      deserializedDefault: {
        record: "public",
        files: "public",
      },
    }),
    files: new Field({
      fieldpath: "files",
    }),
    links: new Field({
      fieldpath: "links",
    }),
    parent: new Field({
      fieldpath: "parent",
    }),
    pids: new Field({
      fieldpath: "pids",
      deserializedDefault: {},
      serializedDefault: {},
    }),
    metadata: new Marc21MetadataFields({
      fieldpath: "metadata",
      deserializedDefault: { leader: "00000nam a2200000zca4500", fields: [] },
      serializedDefault: "",
    }),
  };

  /**
   * Deserialize backend record into format compatible with frontend.
   * @method
   * @param {object} record - potentially empty object
   * @returns {object} frontend compatible record object
   */
  deserialize(record) {
    record = cloneDeep(record);

    let deserializedRecord = record;
    deserializedRecord = pick(deserializedRecord, [
      "access",
      "expanded",
      "metadata",
      "id",
      "links",
      "files",
      "is_published",
      "versions",
      "parent",
      "status",
      "pids",
    ]);
    for (let key in this.depositRecordSchema) {
      deserializedRecord =
        this.depositRecordSchema[key].deserialize(deserializedRecord);
    }
    if ("id" in record) {
      if (typeof record.id !== "string") {
        delete deserializedRecord["id"];
      }
    }
    return deserializedRecord;
  }

  /**
   * Deserialize backend record errors into format compatible with frontend.
   * @method
   * @param {array} errors - array of error objects
   * @returns {object} - object representing errors
   */
  deserializeErrors(errors) {
    let deserializedErrors = {};
    for (let e of errors) {
      set(deserializedErrors, e.field, e.messages.join(" "));
    }

    return deserializedErrors;
  }

  /**
   * Serialize record to send to the backend.
   * @method
   * @param {object} record - in frontend format
   * @returns {object} record - in API format
   *
   */
  serialize(record) {
    record = cloneDeep(record);
    let serializedRecord = record; //this.removeEmptyValues(record);
    serializedRecord = pick(serializedRecord, [
      "access",
      "metadata",
      "id",
      "links",
      "files",
      "pids",
      "parent",
    ]);
    for (let key in this.depositRecordSchema) {
      serializedRecord = this.depositRecordSchema[key].serialize(serializedRecord);
    }
    if ("id" in record) {
      if (typeof record.id !== "string") {
        delete serializedRecord["id"];
      }
    }

    defaults(serializedRecord, { metadata: {} });

    return serializedRecord;
  }
}
