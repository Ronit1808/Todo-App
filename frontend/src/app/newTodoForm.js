// app/newTodoForm.js
'use client';
import TextEditor from "@/app/textEditor.js"

function NewTodoForm({ title, setTitle, description, setDescription }) {
  return (
    <div className="space-y-4">
      <div>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          required
          className="w-full p-2 rounded"
        />
      </div>
      <div className="h-64">
        <TextEditor 
          value={description} 
          onChange={setDescription} 
        />
      </div>
    </div>
  );
}

export { NewTodoForm };