import useTranscripts from "@/hooks/useTranscripts";
import QueueTable, { TableStructure } from "@/components/queueTable/QueueTable";
import { useCallback, useMemo, useState } from "react";
import { getCount } from "@/utils";
import { Transcript } from "../../types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { transcripts, claimTranscript } = useTranscripts();
  const { data, isLoading, isRefetching, isError, refetch } = transcripts;

  const [claimState, setClaimState] = useState({
    claim: claimTranscript,
    rowIndex: -1,
  });

  const handleClaim = useCallback(
    (idx: number, transcriptId: number) => {
      setClaimState((prev) => ({ ...prev, rowIndex: idx }));
      if (status === "loading") {
        alert("Authenticating.... please wait.");
        return;
      } else if (status === "unauthenticated") {
        alert("You have to login to claim a transcript");
        return;
      }
      if (session?.user?.id) {
        claimTranscript.mutate(
          { userId: session.user.id, transcriptId },
          {
            onSuccess: (_data) => {
              setClaimState((prev) => ({ ...prev, rowIndex: -1 }));
              router.push(`/transcripts/${transcriptId}`);
            },
            onError: (err) => alert("failed to claim: " + err),
          }
        );
      }
      console.log({ session, idx, transcriptId });
    },
    [session, status, claimTranscript, router]
  );

  const tableStructure = useMemo(
    () =>
      [
        { name: "date", type: "date", modifier: (data) => data?.createdAt },
        {
          name: "title",
          type: "text-long",
          modifier: (data) => data.originalContent.title,
        },
        {
          name: "speakers",
          type: "tags",
          modifier: (data) => data.originalContent.speakers,
        },
        {
          name: "category",
          type: "tags",
          modifier: (data) => data.originalContent.categories,
        },
        {
          name: "tags",
          type: "tags",
          modifier: (data) => data.originalContent.tags,
        },
        {
          name: "word count",
          type: "text-short",
          modifier: (data) =>
            `${getCount(data.originalContent.body) ?? "-"} words`,
        },
        // { name: "bounty rate", type: "text-short", modifier: (data) => "N/A" },
        {
          name: "",
          type: "action",
          modifier: (data) => data.id,
          action: (data: Transcript, idx: number) => handleClaim(idx, data.id),
        },
      ] as TableStructure[],
    [handleClaim]
  );

  return (
    <>
      <QueueTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        claimState={claimState}
        tableStructure={tableStructure}
      />
    </>
  );
}
