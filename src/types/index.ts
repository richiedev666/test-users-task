export interface User {
  id: number;
  loading: boolean;
  username: string;
  posts: Post[];
}

export interface Post {
  id?: number;
  title: string;
  body: string;
  user?: { username: string };
  userId: number;
}
