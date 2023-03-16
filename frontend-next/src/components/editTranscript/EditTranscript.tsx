import { Transcript } from "../../../types";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

import "easymde/dist/easymde.min.css";
import { useCallback } from "react";

import dynamic from "next/dynamic";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const EditTranscript = ({
  data,
  mdData,
  update,
}: {
  data: Transcript;
  mdData: string;
  update: (x: any) => void;
}) => {
  
  const onChange = useCallback((value: string) => {
    update(value);
  }, []);

  return (
    <Box w="full" h="70vh">
      <Flex alignItems="center" justifyContent="space-between" my={2}>
        <Text>Transcription Text</Text>
        <Button
          colorScheme="red"
          onClick={() => update(data.originalContent?.body || "")}
          size="xs"
        >
          Restore Original
        </Button>
      </Flex>
      <Box h="full" id="simplemde-container-controller">
        <SimpleMdeReact value={mdData} onChange={onChange} />
      </Box>
      {/* <div data-color-mode="light" style={{ height: "100%", overflow: "auto" }}>
        <MDEditor value={mdData} onChange={update} />
      </div> */}
    </Box>
  );
};

export default EditTranscript;
