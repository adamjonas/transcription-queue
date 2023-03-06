import { dateFormat } from '@/utils'
import { Box, Button, Heading, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import { Transcript } from '../../../types'


type Props = {
  data: Transcript[],
  isLoading: boolean
}

type tableStructureItemType = "date" | "text-long" | "text-short" | "tags" | "action";
type TranscriptModifier = (data: Transcript) => any;

type TableStructure = {
  name: string,
  type: tableStructureItemType,
  modifier: (data: Transcript) => any;
}

type TableDataElement = {
  tableItem: TableStructure,
  row: Transcript,
}

const tableStructure: TableStructure[] = [
  {name: "date", type:"date", modifier: (data) => data?.createdAt },
  {name: "title", type:"text-long", modifier: (data) => data.title},
  {name: "speakers", type:"text-short", modifier: (data) => "N/A"},
  {name: "category", type:"text-long", modifier: (data) => "N/LA"},
  {name: "tags", type:"tags", modifier: (data) => "N/A"},
  {name: "word count", type:"text-short", modifier: (data) => "N/A"},
  {name: "bounty rate", type:"text-short", modifier: (data) => "N/A"},
  {name: "", type:"action", modifier: (data) => "N/A"},
]

const QueueTable: React.FC<Props> = ({data}) => {
  if (!data?.length) {
    return null;
  }
  return (
    <Box fontSize="sm" py={4}>
      <Heading size="md" mb={6} >Transcription Queue</Heading>
      <Table boxShadow="lg" borderTop="2px solid" borderTopColor="orange.400">
        <Thead>
          <TableHeader tableStructure={tableStructure} />
        </Thead>
        <Tbody>
          {
            data?.length 
            ? data.map((dataRow, idx) => <TableRow key={idx} row={dataRow} ts={tableStructure} />)
            : null
          }
        </Tbody>
      </Table>
    </Box>
  )
}

export const TableHeader = ({tableStructure}: {tableStructure: TableStructure[]}) => {
  return (
    <Tr>
      {tableStructure.map((tableItem, idx) => {
        return (
          <Th key={idx}>
            <Text textTransform="capitalize" fontWeight="bold" fontSize="14px" color="gray.700" >
              {tableItem.name}
            </Text>
          </Th>
        )
      })}
    </Tr>
  )
}

const TableRow = ({row, ts}: {row: Transcript, ts: TableStructure[]}) => {

  const dateData = (date: Date) => {
    return defaultUndefined(dateFormat, date)
  }

  // type DefUnd<P,T> = (cb: P, data: T) => any;
  const defaultUndefined = (cb: any, data: any) => {
    try {
      return cb(data)
    } catch {
      return "N/A"
    }
  }

  const LongText = ({tableItem, row}: TableDataElement) => {
    const text = defaultUndefined(tableItem.modifier, row)
    return (
      <Td>
        <Text>{text}</Text>
      </Td>
    )
  } 
  const TableAction = ({tableItem, row}: TableDataElement) => {
    return (
      <Td>
        <Button colorScheme="orange" size="sm">
          Claim
        </Button>
      </Td>
    )
  } 

  return (
    <Tr>
      {ts.map((tableItem, idx) => {
        switch (tableItem.type) {
          case "date":
            return <Td key={`table-data-${idx}`}>{dateData(tableItem.modifier(row) ?? "")}</Td>

          case "text-long":
            return <LongText tableItem={tableItem} row={row} />

          case "action":
            return <TableAction tableItem={tableItem} row={row} />
        
          default:
            return <Td key={`table-data-${idx}`}>N/A</Td>
        }
      })}
    </Tr>
  )
}

export default QueueTable