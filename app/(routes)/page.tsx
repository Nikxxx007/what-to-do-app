import Form from "next/form";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Input } from "@heroui/react";
import { startTransition, useActionState, useState } from "react";
import { createNote, updateNote } from "@/app/(routes)/actions";

export default async function Page() {
  const [note, setNote] = useState<number | undefined>(undefined);
  const [tate, action, pending] = useActionState(createNote, false);
  const [state, action, pending] = useActionState(updateNote, false);
  const notes = await prisma.note.findMany();

  const handleKeyPress = (e){
    if (e.keyCode === 13){
      e.target.blur();
      //Write you validation logic here
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">TO DO LIST</h1>
      <div>
        {notes.map((note) => (
          <Input
            key={note.id}
            value={note.content ?? ""}
            onFocus={() => setNote(note.id)}
            onKeyDown={handleKeyPress}
          />
        ))}
      </div>
      <Input
        placeholder="What on your mind"
        onBlur={() => startTransition(action)}
      />
      {/*  TODO how to edit already existing entities in db (add status to the note: checked or not)*/}
    </div>
  );
}
