import axios from "./axios";
import endpoints from "./endpoints";

type CreateUserProp = {
  username: string;
  permissions?: string;
};

type UserData = {
  data: {
    permissions: "reviewer" | "admin";
    id: number;
    githubUsername: string;
    updatedAt: string;
    createdAt: string;
    authToken?: string | null;
    archivedAt?: string | null;
  };
};

export const createNewUser = async ({
  username,
  permissions,
}: CreateUserProp): Promise<UserData> => {
  return axios.post(endpoints.USERS(), {
    username,
    permissions,
  });
};
