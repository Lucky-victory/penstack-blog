import bcrypt from "bcryptjs";
import { db } from "@/src/db";
import { users } from "@/src/db/schemas";
import { eq } from "drizzle-orm";

export async function createUser({
  name,
  email,
  password,
  username,
}: {
  name: string;
  email: string;
  password: string;
  username: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userRes] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        username,
        auth_type: "local",
        role_id: 5,
      })
      .$returningId();
    const user = await db.query.users.findFirst({
      where: eq(users.id, userRes.id),
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}
