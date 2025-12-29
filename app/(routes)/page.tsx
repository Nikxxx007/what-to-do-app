"use client";

import Form from "next/form";
import { Input } from "@heroui/react";
import React, {
  FocusEventHandler,
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  createNoteAction,
  getNotesActions,
  updateNoteAction,
} from "@/app/(routes)/actions";
import { NoteModel } from "@/app/generated/prisma/models/Note";

export default function Page() {
  const [newNoteContent, setNewNoteContent] = useState<string>("");
  const [notes, setNotes] = useState<NoteModel[] | undefined>(undefined);
  const [isUpdatedNotePending, startUpdateTransition] = useTransition();
  const [isNotesPending, startNotesTransition] = useTransition();

  const updateData = () => {
    startNotesTransition(async () => {
      const notesList = await getNotesActions();
      setNotes(notesList);
    });
  };

  const updateNote = async (noteId: number, content: string) => {
    startUpdateTransition(async () => {
      await updateNoteAction(noteId, content);
      updateData();
    });
  };

  const blurEditingNote = (
    e: FormEvent<HTMLInputElement> | undefined,
    noteId: number,
  ) => {
    if (!e?.currentTarget?.value) return;
    updateNote(noteId, e?.currentTarget?.value);
  };

  const keyDownEditingNote = (
    e: React.KeyboardEvent<HTMLInputElement>,
    noteId: number,
  ) => {
    if (!e.currentTarget.value || e?.key != "Enter") return;
    updateNote(noteId, e?.currentTarget?.value);
  };

  const changeEditingNote = (
    e: FormEvent<HTMLInputElement>,
    noteId: number,
  ) => {
    const value = e.currentTarget.value;
    setNotes((prev) =>
      prev?.map((n) => (n.id === noteId ? { ...n, content: value } : n)),
    );
  };

  const createNewNote = async (content: string) => {
    startUpdateTransition(async () => {
      await createNoteAction(content);
      setNewNoteContent("");
      updateData();
    });
  };

  const blurNewNote = (e: FormEvent<HTMLInputElement> | undefined) => {
    if (!e?.currentTarget?.value) return;
    createNewNote(e?.currentTarget?.value);
  };

  const keyDownNewNote = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value || e?.key != "Enter") return;
    createNewNote(e?.currentTarget?.value);
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">TO DO LIST</h1>
      <div className="flex flex-col">
        {notes?.map((note) => (
          <div key={note.id}>
            <Input
              key={note.id}
              value={note.content ?? ""}
              onChange={(e) => changeEditingNote(e, note.id)}
              onBlur={(e) => blurEditingNote(e, note.id)}
              onKeyDown={(e) => keyDownEditingNote(e, note.id)}
            />
          </div>
        ))}
      </div>
      <Input
        placeholder="What on your mind"
        value={newNoteContent}
        onChange={(e: any) => setNewNoteContent(e.target.value)}
        onBlur={blurNewNote}
        onKeyDown={keyDownNewNote}
      />
      {/*  TODO how to edit already existing entities in db (add status to the note: checked or not)*/}
    </div>
  );
}
