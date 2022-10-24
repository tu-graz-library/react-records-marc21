// This file is part of Invenio.
//
// Copyright (C) 2022 Graz University of Technology.
//
// React-Records-Marc21 is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import { Marc21RecordSerializer } from "./Marc21RecordSerializer";

describe("Marc21RecordSerializer tests", () => {
  const defaultLocale = "en";
  const serializer = new Marc21RecordSerializer(defaultLocale);

  describe("serialize", () => {
    describe("metadata", () => {
      it("serializes leader", () => {
        const record = {
          metadata: {
            leader: "Hi to do!",
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata).toMatch("<leader>Hi to do!</leader>");
      });
      it("serializes field", () => {
        const record = {
          metadata: {
            leader: "Hi to do!",
            fields: [
              {
                id: "100",
                ind1: "1",
                ind2: " ",
                subfield: "$$a Hallo",
              },
            ],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata).toMatch(
          '<datafield tag="100" ind1="1" ind2="_">'
        );
        expect(serializedRecord.metadata).toMatch(
          '<subfield code="a">Hallo</subfield>'
        );
        expect(serializedRecord.metadata).toMatch("</datafield>");
      });
    });
  });

  describe("deserialize", () => {
    it("fills empty values with predefined values", () => {
      const record = {
        access: {},
        metadata: "",
      };
      const expectedRecord = {
        access: {},
        metadata: {
          leader: "            ",
          fields: [],
        },
        pids: {},
      };

      const deserializedRecord = serializer.deserialize(record);

      expect(deserializedRecord).toEqual(expectedRecord);
    });

    it("deserializes a full record", () => {
      const record = {
        access: {
          access_right: "open",
          files: false,
          metadata: false,
        },
        conceptid: "nz13t-me993",
        created: "2020-10-28 18:35:58.113520",
        expires_at: "2020-10-28 18:35:58.113692",
        id: "zra2a-wzm79",
        links: {
          publish:
            "https://127.0.0.1:5000/api/marc21/zra2a-wzm79/draft/actions/publish",
          self: "https://127.0.0.1:5000/api/marc21/zra2a-wzm79/draft",
          self_html: "https://127.0.0.1:5000/marc21/uploads/zra2a-wzm79",
        },
        pids: {
          doi: {
            identifier: "10.1234/rec.nz13t-me993",
            provider: "datacite",
            client: "rdm",
          },
        },
        metadata:
          '<record><leader>Hi to do!</leader><datafield tag="100" ind1="1" ind2=" "><subfield code="a">Hallo</subfield></datafield></record>',
        revision_id: 1,
        updated: "2022-06-10 15:35:58.12232",
      };

      const deserializedRecord = serializer.deserialize(record);

      const expectedRecord = {
        access: {
          access_right: "open",
          files: false,
          metadata: false,
        },
        id: "zra2a-wzm79",
        links: {
          publish:
            "https://127.0.0.1:5000/api/marc21/zra2a-wzm79/draft/actions/publish",
          self: "https://127.0.0.1:5000/api/marc21/zra2a-wzm79/draft",
          self_html: "https://127.0.0.1:5000/marc21/uploads/zra2a-wzm79",
        },
        pids: {
          doi: {
            identifier: "10.1234/rec.nz13t-me993",
            provider: "datacite",
            client: "rdm",
          },
        },
        metadata: {
          leader: "Hi to do!",
          fields: [
            {
              id: "100",
              ind1: "1",
              ind2: " ",
              subfield: " $$a Hallo",
            },
          ],
        },
      };
      expect(deserializedRecord).toEqual(expectedRecord);
    });
  });
});
