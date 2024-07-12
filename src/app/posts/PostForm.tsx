import { useState } from 'react';
import { useRouter } from 'next/router';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();
    if (response.ok) {
      await router.push(`/posts/${data.id}`); // Assuming that the response includes the ID of the created post
    } else {
      console.error('Error creando el post', data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenido"
        required
      />
      <button>Add Post</button>
    </form>
  );
};

export default PostForm;
