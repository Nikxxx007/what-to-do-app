import Form from "next/form";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export default async function Page() {
  const notes = await prisma.note.findMany();

  async function createPost(formData: FormData) {
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

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">TO DO LIST</h1>
      <div>
        {notes.map((note) => (
          <div key={note.id}>{note.content}</div>
        ))}
      </div>
      <Form action={createPost} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-lg mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your post content here..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Create Post
        </button>
      </Form>
    </div>
  );
}
