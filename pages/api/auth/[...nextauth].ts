import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import jwt from "jsonwebtoken";

const MY_SECRETE = process.env.MY_SECRETE || "";

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    }),
  ],

  secret: "vinayak",
  callbacks: {
    async session(session) {
      if (!session) return {};

      const name = session ? session.user?.name : "";
      const email = session ? session.user?.email : "";

      //Encrypting privateKey
      const token = jwt.sign({ name, email }, MY_SECRETE);
      session.token = token;
      return session;
    },
    redirect: async (url) => {
      if (url === "/user") {
        return Promise.resolve("/");
      }
      return Promise.resolve("/");
    },
  },
});
