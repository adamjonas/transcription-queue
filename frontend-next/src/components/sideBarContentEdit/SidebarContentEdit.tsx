import { getTimeLeft } from "@/utils";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { Transcript } from "../../../types";

const SidebarContentEdit = ({ data }: { data: Transcript }) => {
  return (
    <Box
      w="full"
      h="500px"
      flex="1 1 30%"
      top={14}
      position="sticky"
      p={4}
      boxShadow="lg"
      borderRadius="lg"
      border="2px solid"
      borderColor="gray.200"
    >
      <Flex direction="column" gap={6}>
        <Box
          display="flex"
          gap={2}
          fontSize="16px"
          fontWeight={700}
          lineHeight={1}
          color="red.700"
          ml="auto"
        >
          <span>
            <MdOutlineAccessTimeFilled />
          </span>
          <span>{getTimeLeft(data.createdAt)} hours left</span>
        </Box>
        <Box>
          <Text fontWeight={600} mb={2}>Original Media</Text>
          <Link href={data.originalContent?.media || ""}>
            <Box
              display="inline-block"
              bgColor="red.600"
              p={2}
              fontSize="12px"
              borderRadius="md"
              color="white"
              fontWeight={700}
              width="auto"
            >
              Youtube
            </Box>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};

export default SidebarContentEdit;
