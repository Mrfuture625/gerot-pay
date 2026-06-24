import { validateSession } from "@/server/sessions/validateSession";
import { getUserById } from "@/server/repositories/userRepository";

export async function getCurrentUser() {
  const session = await validateSession();

  if (!session) {
    return null;
  }

  const userResult = await getUserById(session.user_id);

  if (userResult.error || !userResult.data) {
    return null;
  }

  return userResult.data;
}