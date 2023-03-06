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

  // const sendInvite = async (body: {email: string, salary: number}) => {
  //   return axios
  //     .post(endpoints.SEND_INVITE(auth.userId), body)
  //     .then((res) => {
  //       toast({
  //         title: "Success",
  //         description: `Invite sent to ${body.email} `,
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //       return res
  //     })
  //     .catch((err) => {
  //       const errMessage =
  //         err?.response?.data?.message || "Please try again later";
  //       toast({
  //         title: "Unable to send invite",
  //         description: errMessage,
  //         status: "error",
  //         duration: 6000,
  //         isClosable: true,
  //       });
  //       return new Error(err)
  //     });
  // };

  const transcripts = useQuery("trancripts", getAllTranscripts);

  // const inviteEmployee = useMutation(sendInvite)

  return { transcripts };
};

export default useTranscripts;
