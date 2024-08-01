import { NextRequest, NextResponse } from 'next/server';
import { getCategoryByName } from '../../../../../database/categories';
import {
  getPostsByCategory,
  getPostsByUserId,
} from '../../../../../database/posts';
import {
  getUsersByCategory,
  getUsersByUsername,
} from '../../../../../database/users';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    // Buscar usuarios por nombre de usuario
    const usersByUsername = await getUsersByUsername(query);

    // Inicializa la lista de publicaciones
    let posts: any[] = [];

    if (usersByUsername.length > 0) {
      // Si se encontraron usuarios, busca publicaciones de esos usuarios
      const userIds = usersByUsername.map((user) => user.id);
      posts = await Promise.all(
        userIds.map((userId) => getPostsByUserId(userId)),
      ).then((results) => results.flat());
    } else {
      // Buscar por categoría si no se encuentran usuarios por nombre de usuario
      const category = await getCategoryByName(query);
      if (category) {
        posts = await getPostsByCategory(category.id);
        const usersByCategory = await getUsersByCategory(category.id);
        return NextResponse.json({ posts, users: usersByCategory });
      }
    }

    // Devolver resultados
    return NextResponse.json({ users: usersByUsername, posts });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
