// src/components/PostForm.tsx

import React, { useState } from 'react';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(data.error);
    } else {
      console.log('Post created:', data);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <button>Create Post</button>
    </form>
  );
}
