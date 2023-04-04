import CurrentJobsTable from "@/components/tables/CurrentJobsTable";
import PastJobsTable from "@/components/tables/PastJobsTable";
import useTranscripts from "@/hooks/useTranscripts";
import { Heading } from "@chakra-ui/react";

export default function Home() {
  const { data, isLoading, isRefetching, refetch } =
    useTranscripts().transcripts;

  return (
    <>
      <Heading size="md" mb={6}>
        My Account
      </Heading>
      <CurrentJobsTable
        data={data ?? []}
        isLoading={isLoading || isRefetching}
        refetch={refetch}
      />
      <PastJobsTable
        data={data ?? []}
        isLoading={isLoading || isRefetching}
        refetch={refetch}
      />
    </>
  );
}
