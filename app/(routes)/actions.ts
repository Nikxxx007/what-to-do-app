import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  "use server";

  const content = formData.get("content") as string;

  await prisma.note.create({
    data: {
      content,
      category: "index",
    },
  });

  revalidatePath("/");
}

export async function updateNote(id: number, content: string) {
  "use server";

  await prisma.note.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });
}
