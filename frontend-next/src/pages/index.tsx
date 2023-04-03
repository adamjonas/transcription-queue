import useTranscripts from "@/hooks/useTranscripts";
import QueueTable, { TableStructure } from "@/components/queueTable/QueueTable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCount } from "@/utils";
import { Transcript } from "../../types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { transcripts, claimTranscript } = useTranscripts();
  const { data, isLoading, isError, refetch } = transcripts;

  const retriedClaim = useRef(0);
  const auth_url = useRef(process.env.NEXT_PUBLIC_AUTH_URL);

  const [claimState, setClaimState] = useState({
    claim: claimTranscript,
    rowIndex: -1,
  });

  useEffect(() => {
    if (!auth_url.current) {
      auth_url.current = process.env.NEXT_PUBLIC_AUTH_URL;
    }
  }, []);

  const retryLoginAndClaim = async (idx: number, transcriptId: number) => {
    await signOut({ redirect: false });
    if (retriedClaim.current < 2) {
      retriedClaim.current += 1;
      await signIn("github", {
        callbackUrl: `${auth_url.current}?reclaim=true&idx=${idx}&txId=${transcriptId}`,
      });
      console.log("I got here")
    }
  };

  const handleClaim = useCallback(
    async (idx: number, transcriptId: number) => {
      if (status === "loading") {
        alert("Authenticating.... please wait.");
        return;
      } else if (status === "unauthenticated") {
        alert("You have to login to claim a transcript");
        return;
      }
      if (session?.user?.id) {
        setClaimState((prev) => ({ ...prev, rowIndex: idx }));
        claimTranscript.mutate(
          { userId: session.user.id, transcriptId },
          {
            onSuccess: async (data) => {
              setClaimState((prev) => ({ ...prev, rowIndex: -1 }));
              if (data instanceof Error) {
                await retryLoginAndClaim(idx, transcriptId);
                return;
              }
              router.push(`/transcripts/${transcriptId}`);
            },

            onError: (err) => {
              setClaimState((prev) => ({ ...prev, rowIndex: -1 }));
              alert("failed to claim: " + err);
            },
          }
        );
      } else {
        await retryLoginAndClaim(idx, transcriptId);
      }
    },
    [session, status, claimTranscript, router]
  );

  // Reclaim transcript when there's a reclaimquery
  useEffect(() => {
    const { reclaim, idx, txId } = router.query;
    if (
      reclaim &&
      idx &&
      txId &&
      data &&
      status === "authenticated" &&
      retriedClaim.current < 2
    ) {
      retriedClaim.current = 2;
      handleClaim(Number(idx), Number(txId));
    }
  }, [data, router, handleClaim, status]);

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
