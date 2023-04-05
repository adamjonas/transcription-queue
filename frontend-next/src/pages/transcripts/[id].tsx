/* eslint-disable no-unused-vars */
import { Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { Transcript } from "../../../types";
import SidebarContentEdit from "@/components/sideBarContentEdit/SidebarContentEdit";
import EditTranscript from "@/components/editTranscript/EditTranscript";
import useTranscripts from "@/hooks/useTranscripts";
import { useRouter } from "next/router";
import RedirectToLogin from "@/components/RedirectToLogin";

type Props = {
  data: Transcript;
};

const TranscriptPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useTranscripts().SingleTranscript(Number(id));
  const [editedData, setEditedData] = useState(
    data?.originalContent?.body ?? ""
  );

  if (status === "loading") {
    return (
      <>
        <h2>Authenticating...</h2>
        <p>Please wait</p>
      </>
    );
  }
  if (status === "unauthenticated") {
    return <RedirectToLogin />;
  }

  // if (data.status === "queued") {
  //   return <h4>Transcript has been claimed</h4>;
  // }

  const handleSave = (editedContent: any) => {
    return;
  };
  const handleSubmit = (editedContent: any) => {
    return;
  };

  return (
    <>
      {isLoading ? (
        <p> Loading...</p>
      ) : (
        <Flex gap={6} w="full" flexDir={{ base: "column", md: "row" }}>
          <SidebarContentEdit data={data}>
            {(editedContent) => (
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorScheme="orange"
                  variant="outline"
                  onClick={() => handleSave(editedContent)}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  colorScheme="orange"
                  onClick={() => handleSubmit(editedContent)}
                >
                  Submit
                </Button>
              </Flex>
            )}
          </SidebarContentEdit>
          <EditTranscript
            data={data}
            mdData={editedData}
            update={setEditedData}
          />
        </Flex>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps<{
//   data: Transcript;
// }> = async ({ params }) => {
//   const id = params?.id;

//   const fetchedData = await fetch(`${process.env.BASE_URL}/transcripts/${id}`);
//   const data = await fetchedData.json();

//   return {
//     props: {
//       data,
//     },
//   };
// };

export default TranscriptPage;
