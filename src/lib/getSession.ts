import { auth } from "@/auth";
import { getServerSession } from "next-auth";

export async function getSession() {
  const session = await getServerSession(auth());
  return session;
}
