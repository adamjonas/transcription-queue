import endpoints from "@/api/endpoints";
import { useMutation, useQuery } from "react-query";
import axios from "../api/axios";

const useTranscripts = () => {
  const getAllTranscripts = async (): Promise<any> => {
    return axios
      .get(endpoints.GET_TRANSCRIPTS())
      .then((res) => res.data)
      .catch((err) => err);
  };
  const getSingleTranscripts = async (transcriptId: number): Promise<any> => {
    return axios
      .get(endpoints.GET_TRANSCRIPTS_BY_ID(transcriptId || 0))
      .then((res) => res.data)
      .catch((err) => err);
  };

  const addReview = async (body: { userId: number, transcriptId: number }) => {
    return axios
      .post(endpoints.REVIEWS(), body)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        const errMessage =
          err?.response?.data?.message || "Please try again later";
        return new Error(errMessage);
      });
  };

  const transcripts = useQuery("trancripts", getAllTranscripts, {
    refetchOnWindowFocus: false,
  });

  const SingleTranscript = (transcriptId: number) =>
    useQuery(
      `transcript_${transcriptId}`,
      () => getSingleTranscripts(transcriptId),
      {
        refetchOnWindowFocus: false,
      }
    );

  const claimTranscript = useMutation(addReview);

  return { transcripts, SingleTranscript, claimTranscript };
};

export default useTranscripts;
