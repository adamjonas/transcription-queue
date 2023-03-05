import { Box, Divider, Flex, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
  return (
    <Box bgColor="gray.800" p={8}>
      <Flex mb={5}>
        <Flex color="gray.100" gap={2}>
          <Text>Copyright © {new Date().getFullYear()}</Text>
          <Divider orientation='vertical' />
          <Text>All Rights Reserved.</Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Footer