import {
  Flex,
  FormControl,
  IconButton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiCheck, BiPencil, BiX } from "react-icons/bi";

const TextField = ({ data, editedData, updateData }: any) => {
  const [isEdit, setIsEdit] = useState(false);
  const [state, setState] = useState(data);

  const handleUpdateEdit = () => {
    setIsEdit(false);
    updateData(state);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    setState(inputValue);
  };

  return (
    <FormControl>
      <Flex gap={2}>
        {isEdit ? (
          <>
            <Textarea
              p={1}
              fontSize="12px"
              resize="none"
              value={state}
              onChange={handleInputChange}
            ></Textarea>
            <Flex direction="column" justifyContent="space-around" gap={2}>
              <IconButton
                fontSize="20px"
                size="sm"
                colorScheme="green"
                onClick={handleUpdateEdit}
                aria-label="edit title"
                icon={<BiCheck />}
              />
              <IconButton
                fontSize="20px"
                size="sm"
                colorScheme="red"
                onClick={() => setIsEdit(false)}
                aria-label="edit title"
                icon={<BiX />}
              />
            </Flex>
          </>
        ) : (
          <>
            <Text>{editedData ? editedData : data}</Text>
            {/* <Button onClick={() => setIsEdit(true)}><BiPencil /></Button> */}
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setIsEdit(true)}
              aria-label="edit title"
              icon={<BiPencil />}
            />
          </>
        )}
      </Flex>
    </FormControl>
  );
};

export default TextField;
