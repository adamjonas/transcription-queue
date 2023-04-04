/* eslint-disable no-unused-vars */
import { Transcript } from "../../../types";

export type tableStructureItemType =
  | "date"
  | "text-long"
  | "text-short"
  | "tags"
  | "action";

export type TableStructure = {
  name: string;
  type: tableStructureItemType;
  modifier: (data: Transcript) => any;
};

export type TableDataElement = {
  tableItem: TableStructure;
  row: Transcript;
};
