import { connectToDB } from "@database/mongodb/database";
import User from "@database/models/User";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error("No user found");
        }

        const isMatchedPassword = await compare(credentials?.password, user.password);

        if (!isMatchedPassword) {
          throw new Error("Invalid password");
        }

        return user
      }
    })
  ],
  
  callbacks: {
    async session({ session }) {
      const mongodbUser = await User.findOne({ email: session.user.email })
      session.user.id = mongodbUser._id.toString()

      session.user = {...session.user, ...mongodbUser._doc}

      return session
    }
  }

}