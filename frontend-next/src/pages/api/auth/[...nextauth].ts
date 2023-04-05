import axios from "@/api/axios";
import { createNewUser } from "@/api/lib";
import NextAuth, {
  GhExtendedProfile,
  NextAuthOptions,
  Session,
} from "next-auth";
// import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user user:email public_repo" },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      token: any;
    }): Promise<Session> {
      // Send userId and permission properties to the client
      const defaultSessionUser = session.user;
      session.user = {
        ...token.user,
        ...defaultSessionUser,
      };
      return session;
    },
    async jwt({ isNewUser, token, ...response }) {
      const profile = response.profile as GhExtendedProfile | undefined;

      const createAndSetNewUser = async (
        username: string,
        permissions?: string
      ) => {
        const res = await createNewUser({ username, permissions });
        if (res.data) {
          token.user = res.data;
        } else {
          throw new Error("Unable to create user");
        }
      };

      if (isNewUser && profile?.login) {
        await createAndSetNewUser(profile?.login);
      }
      // Temporary get userId
      // TODO: when resource is available send properties to backend and get id
      if (!isNewUser && !token?.id && profile?.login) {
        await axios
          .get("/users")
          .then(async (res) => {
            if (res.data) {
              const _users = res.data;
              const user = _users.find(
                (user: any) => user.githubUsername === profile?.login
              );
              if (user) {
                token.user = user;
              } else {
                await createAndSetNewUser(profile?.login);
              }
            }
          })
          .catch(() => (token.id = undefined));
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
