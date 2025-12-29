"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNoteAction(content: string) {
  await prisma.note.create({
    data: {
      content,
      category: "index",
    },
  });
}

export async function updateNoteAction(id: number, content: string) {
  await prisma.note.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });
}

export async function getNotesActions() {
  return prisma.note.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}
