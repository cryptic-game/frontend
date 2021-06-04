export interface Provider {
  id: string;
  name: string;
  auth_uri: string;
}

export interface Token {
  value: string;
  userId: string;
  expire: number; // seconds (unix epoche)
}

export interface Session {
  id: string;
  user_id: string;
}
