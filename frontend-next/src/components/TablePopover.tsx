import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

type Props = {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: React.ReactNode;
};

const TablePopover: React.FC<Props> = ({ trigger, children, title }) => {
  return (
    <Box boxShadow="2xl">
      <Popover placement="bottom-start">
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent w="auto" minW="100px">
          {title ? (
            <PopoverHeader>
              <Text
                textTransform="capitalize"
                fontWeight="bold"
                fontSize="12px"
                color="gray.500"
              >
                {title}
              </Text>
            </PopoverHeader>
          ) : null}
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default TablePopover;
