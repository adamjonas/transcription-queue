import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { Transcript } from "../../../types";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const EditTranscript = ({
  data,
  mdData,
  update,
}: {
  data: Transcript;
  mdData: string;
  update: (x: any) => void;
}) => {
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
      <div data-color-mode="light" style={{ height: "100%", overflow: "auto" }}>
        <MDEditor value={mdData} onChange={update} />
      </div>
    </Box>
  );
};

export default EditTranscript;
