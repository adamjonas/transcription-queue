import axios from "@/api/axios";
import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "public_repo" },
      },
    }),
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      token: any;
    }): Promise<Session> {
      session.userId = token.id;
      session.permissions = token.permissions;
      session.accessToken = token.accessToken; // Add the access token to the session
      return session;
    },
    async jwt({ token, account }: { token: JWT; account?: any }) {
      if (account && account.accessToken) {
        token.accessToken = account.accessToken; // Store the access token in the JWT
      }

      if (!token?.id) {
        await axios
          .get("/users/4")
          .then((res) => {
            if (res.data) {
              token.id = res.data.id;
              token.permissions = res.data.permissions;
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
