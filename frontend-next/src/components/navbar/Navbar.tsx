import { Box, Flex, Text } from "@chakra-ui/react"
import Link from "next/link"

const Navbar = () => {
  return (
    <Box position="sticky" top="0" p={3} bgColor="gray.50" boxShadow="base" fontSize="14px">
      <Flex justifyContent="space-between">
        <Link href="/" >
          <Text color="gray.900" fontWeight={"semibold"}>BTC Transcripts Queue</Text>
        </Link>
        <Text>Account Placeholder</Text>
      </Flex>
    </Box>
  )
}

export default Navbar