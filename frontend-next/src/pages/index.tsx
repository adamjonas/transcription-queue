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
  const { data, isLoading, isRefetching, isError, refetch } = transcripts;

  const retriedClaim = useRef(0);

  const [claimState, setClaimState] = useState({
    claim: claimTranscript,
    rowIndex: -1,
  });

  const handleClaim = useCallback(
    (idx: number, transcriptId: number) => {
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
            onSuccess: (data) => {
              setClaimState((prev) => ({ ...prev, rowIndex: -1 }));
              console.log("data from post", { data });
              if (data instanceof Error) {
                signOut({ redirect: false });
                if (retriedClaim.current < 2) {
                  retriedClaim.current += 1;
                  console.log("retry claim", {idx, transcriptId})
                  signIn("github", { callbackUrl: `${process.env.NEXTAUTH_URL}?reclaim=true&idx=${idx}&txId=${transcriptId}`  });
                }
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
        signOut({ redirect: false });
        if (retriedClaim.current < 2) {
          retriedClaim.current += 1;
          console.log("retry claim", {idx, transcriptId})
          // signIn("github", { callbackUrl: (process.env.NEXT_PUBLIC_AUTH_URL ?? process.env.NEXTAUTH_URL)+`?reclaim=true&idx=${idx}&txId=${transcriptId}`  });
          signIn("github", { callbackUrl: `http://localhost:3000?reclaim=true&idx=${idx}&txId=${transcriptId}`  });
        }
      }
      console.log({ session, idx, transcriptId });
    },
    [session, status, claimTranscript, router]
  );

  // Reclaim transcript when there's a reclaimquery
  useEffect(() => {
    const { reclaim, idx, txId } = router.query;
    if (reclaim && idx && txId && data && retriedClaim.current < 2) {
      retriedClaim.current = 2;
      handleClaim(Number(idx), Number(txId));
    }
  }, [data, router, handleClaim]);

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
