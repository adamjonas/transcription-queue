import { Transcript } from "../../../types";
// import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";

import "easymde/dist/easymde.min.css";
import { useEffect, useRef, useState } from "react";

// const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// });

const EditTranscript = ({
  data,
  mdData,
  update,
}: {
  data: Transcript;
  mdData: string;
  // eslint-disable-next-line no-unused-vars
  update: (x: any) => void;
}) => {
  const hasUpdatedEditorData = useRef<Boolean>(false);
  const [isModalOpen, setIsModalopen] = useState(false);
  useEffect(() => {
    if (
      data.originalContent?.body &&
      !mdData &&
      !hasUpdatedEditorData.current
    ) {
      update(data.originalContent?.body);
      hasUpdatedEditorData.current = true;
    }
    return () => {
      hasUpdatedEditorData.current = false;
    };
  }, [data, mdData, update]);

  const restoreOriginal = () => {
    update(data.originalContent?.body || "");
    setIsModalopen(false);
  };

  return (
    <>
      <Box
        flex="1 1 70%"
        w={{ base: "100%", md: "70%" }}
        display="flex"
        flexDir="column"
      >
        <Box my={2}>
          <Button
            colorScheme="gray"
            onClick={() => setIsModalopen(true)}
            size="xs"
            ml="auto"
            display="block"
            variant="outline"
          >
            Restore Original
          </Button>
        </Box>
        <Box h="full" id="simplemde-container-controller">
          <MdEditor modelValue={mdData} onChange={update} language="en-US" />
        </Box>
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalopen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text align="center" fontWeight={600} fontSize="md" color="red.600">
              Restore Original
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure? any changes made will be lost.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalopen(false)}
              mr={2}
            >
              Cancel
            </Button>
            <Button
              // variant="outline"
              colorScheme="red"
              size="sm"
              onClick={restoreOriginal}
            >
              Yes, Restore!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditTranscript;
