import useTranscripts from "@/hooks/useTranscripts";
import QueueTable from "@/components/queueTable/QueueTable";

export default function Home() {
  const { data, isLoading, isError, refetch } = useTranscripts().transcripts;
  return (
    <>
      <QueueTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
      />
    </>
  );
}
