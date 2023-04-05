/* eslint-disable no-unused-vars */
import { dateFormat, getCount } from "@/utils";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Transcript } from "../../../types";
import TablePopover from "../TablePopover";
import { TbReload } from "react-icons/tb";
import styles from "./queueTable.module.scss";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  UseMutationResult,
} from "react-query";
import Link from "next/link";
import { AxiosResponse } from "axios";

type Props = {
  data: Transcript[];
  isLoading: boolean;
  isError: boolean;
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
  handleAction?: (idx: number, row: any) => void;
  claimState: {
    claim: UseMutationResult<
      AxiosResponse<any, any> | Error,
      unknown,
      {
        userId: number;
        transcriptId: number;
      },
      unknown
    >;
    rowIndex: number;
  };
  tableStructure: TableStructure[];
};

type tableStructureItemType =
  | "date"
  | "text-long"
  | "text-short"
  | "tags"
  | "action";
// type TranscriptModifier = (data: Transcript) => any;

export type TableStructure = {
  name: string;
  type: tableStructureItemType;
  modifier: (data: Transcript) => any;
  action?: (data: Transcript, idx: number) => void;
};

type TableDataElement = {
  tableItem: TableStructure;
  row: Transcript;
  idx?: number;
};

const QueueTable: React.FC<Props> = ({
  data,
  isLoading,
  isError,
  refetch,
  handleAction,
  claimState,
  tableStructure,
}) => {
  // if (!data?.length) {
  //   return null;
  // }
  const LoadingSkeleton = () => {
    const getSkeleton = useMemo(() => {
      const skeletonArr = [];
      for (let index = 0; index < 3; index++) {
        skeletonArr.push(
          <Tr key={index}>
            {tableStructure.map((item, _idx) => (
              <Td key={_idx}>
                <Skeleton w="100%" h={4} />
              </Td>
            ))}
          </Tr>
        );
      }
      return skeletonArr;
    }, []);

    return <>{getSkeleton}</>;
  };
  return (
    <Box fontSize="sm" py={4} isolation="isolate">
      <Heading size="md" mb={6}>
        Transcription Queue
      </Heading>
      {refetch && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          {/* <Button variant="link" onClick={() => refetch()}>
            <Flex gap={2} alignItems="center" color="red.300" fontSize="14px" fontWeight="medium">
              <Icon as={TbReload} />
            </Flex>
          </Button> */}
          <IconButton
            aria-label="refresh table"
            minW="auto"
            h="auto"
            p="2px"
            colorScheme="red"
            variant="ghost"
            icon={<TbReload />}
            onClick={() => refetch()}
          />
        </Box>
      )}
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
            <LoadingSkeleton />
          ) : data?.length ? (
            data.map((dataRow, idx) => (
              <TableRow
                key={`data-row-${dataRow.id}`}
                row={dataRow}
                rowIndex={idx}
                ts={tableStructure}
                claimState={claimState}
              />
            ))
          ) : (
            <Tr position="relative" h={14}>
              <Td
                position="absolute"
                w="full"
                // top="50%"
                color="red.400"
                textAlign="center"
              >
                Something went wrong
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

const TableHeader = ({
  tableStructure,
}: {
  tableStructure: TableStructure[];
}) => {
  return (
    <Tr>
      {tableStructure.map((tableItem, idx) => {
        return (
          <Th key={idx} width={tableItem.type === "text-long" ? "25%" : "auto"}>
            <Text
              textTransform="capitalize"
              fontWeight="bold"
              fontSize="14px"
              color="gray.700"
            >
              {tableItem.name}
            </Text>
          </Th>
        );
      })}
    </Tr>
  );
};

const TableRow = ({
  row,
  ts,
  claimState,
  rowIndex,
}: {
  row: Transcript;
  ts: TableStructure[];
  claimState: Props["claimState"];
  rowIndex: number;
}) => {
  const DateText = ({ tableItem, row }: TableDataElement) => {
    const dateString = dateFormat(tableItem.modifier(row)) ?? "N/A";
    return <Td>{dateString}</Td>;
  };

  // type DefUnd<P,T> = (cb: P, data: T) => any;
  const defaultUndefined = (cb: any, data: any) => {
    try {
      return cb(data);
    } catch {
      return "N/A";
    }
  };

  const LongText = ({ tableItem, row }: TableDataElement) => {
    const text = defaultUndefined(tableItem.modifier, row);
    return (
      <Td>
        <Text>{text}</Text>
      </Td>
    );
  };
  const ShortText = ({ tableItem, row }: TableDataElement) => {
    const text = defaultUndefined(tableItem.modifier, row);
    return (
      <Td>
        <Text>{text}</Text>
      </Td>
    );
  };
  const Tags = ({ tableItem, row }: TableDataElement) => {
    const stringArray = tableItem.modifier(row) as string;
    let _parsed = stringArray as string | string[];
    if (stringArray[0] === "[") {
      // eslint-disable-next-line prettier/prettier
      _parsed = stringArray
        .substring(1, stringArray.length - 1)
        .replaceAll("'", "")
        .split(", ");
    }

    const _zeroItem = typeof _parsed === "string" ? "N/A" : _parsed[0];
    return (
      <Td>
        <Flex alignItems="center" justifyContent="space-between" gap={2}>
          <Text textTransform="capitalize">{_zeroItem}</Text>
          {Array.isArray(_parsed) && _parsed.length > 1 ? (
            <TablePopover
              trigger={
                <button className={styles.more_button}>
                  +{_parsed.length}
                </button>
              }
              title={tableItem.name}
            >
              <Flex flexDir="column">
                {_parsed.map((item, idx) => (
                  <Text textTransform="capitalize" fontSize="12px" key={idx}>
                    {item}
                  </Text>
                ))}
              </Flex>
            </TablePopover>
          ) : null}
        </Flex>
      </Td>
    );
  };

  const TableAction = ({ tableItem, row }: TableDataElement) => {
    // const linkId = row.id;
    const handleClick = () => {
      if (!tableItem.action) return;
      tableItem.action(row, rowIndex);
    };

    const isLoading = rowIndex === claimState.rowIndex;
    return (
      <Td>
        <Button
          isLoading={isLoading}
          colorScheme="orange"
          size="sm"
          onClick={handleClick}
        >
          Claim
        </Button>
      </Td>
    );
  };

  return (
    <Tr>
      {ts.map((tableItem, idx) => {
        switch (tableItem.type) {
          case "date":
            return (
              <DateText key={tableItem.name} tableItem={tableItem} row={row} />
            );

          case "text-long":
            return (
              <LongText key={tableItem.name} tableItem={tableItem} row={row} />
            );

          case "text-short":
            return (
              <ShortText key={tableItem.name} tableItem={tableItem} row={row} />
            );

          case "tags":
            return (
              <Tags key={tableItem.name} tableItem={tableItem} row={row} />
            );

          case "action":
            return (
              <TableAction
                key={tableItem.name}
                tableItem={tableItem}
                row={row}
              />
            );

          default:
            return <Td key={`table-data-${idx}`}>N/A</Td>;
        }
      })}
    </Tr>
  );
};

export default QueueTable;
