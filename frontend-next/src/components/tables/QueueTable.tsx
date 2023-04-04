/* eslint-disable no-unused-vars */
import { getCount } from "@/utils";
import { Box, Heading, Table, Tbody, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import type { Transcript } from "../../../types";
import {
  DataEmpty,
  LoadingSkeleton,
  RefetchButton,
  RowData,
  TableHeader,
} from "./TableItems";
import type { TableStructure } from "./types";

type Props = {
  data: Transcript[];
  isLoading: boolean;
  isError: boolean;
  refetch?: () => Promise<unknown>;
};

const tableStructure: TableStructure[] = [
  { name: "date", type: "date", modifier: (data) => data?.createdAt },
  {
    name: "title",
    type: "text-long",
    modifier: (data) => data.originalContent.title,
  },
  {
    name: "speakers",
    type: "tags",
    modifier: (data) => data.originalContent.speakers,
  },
  {
    name: "category",
    type: "tags",
    modifier: (data) => data.originalContent.categories,
  },
  { name: "tags", type: "tags", modifier: (data) => data.originalContent.tags },
  {
    name: "word count",
    type: "text-short",
    modifier: (data) => `${getCount(data.originalContent.body) ?? "-"} words`,
  },
  // { name: "bounty rate", type: "text-short", modifier: (data) => "N/A" },
  { name: "", type: "action", modifier: (data) => data.id },
];

const QueueTable: React.FC<Props> = ({ data, isLoading, refetch }) => {
  return (
    <Box fontSize="sm" py={4} isolation="isolate">
      <Heading size="md" mb={6}>
        Transcripts waiting for review...
      </Heading>
      {refetch && <RefetchButton refetch={refetch} />}
      <Table
        boxShadow="lg"
        borderTop="4px solid"
        borderTopColor="orange.400"
        borderRadius="xl"
      >
        <Thead>
          <TableHeader tableStructure={tableStructure} />
        </Thead>
        <Tbody fontWeight="medium">
          {isLoading ? (
            <LoadingSkeleton rowsLength={tableStructure.length} />
          ) : data?.length ? (
            data.map((dataRow, idx) => (
              <TableRow
                key={`data-row-${dataRow.id}`}
                row={dataRow}
                ts={tableStructure}
              />
            ))
          ) : (
            <DataEmpty />
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

const TableRow = ({ row, ts }: { row: Transcript; ts: TableStructure[] }) => {
  return (
    <Tr>
      {ts.map((tableItem, index) => (
        <RowData
          key={tableItem.name}
          index={index}
          tableItem={tableItem}
          row={row}
        />
      ))}
    </Tr>
  );
};

export default QueueTable;
