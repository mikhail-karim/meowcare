export type Pet = {
  id: number;
  name: string;
  location: string;
  gender: string;
  age: number;
  image: any;
  vaccinated?: boolean;
  sterilized?: boolean;
  breed?: string;
  color?: string;
  status?: string;
  description?: string; 
  owner: number;
};

export type Article = {
  id: number;
  title: string;
  category: string;
  author: string;
  image: any;
};

// Ganti 192.168.1.6 dengan IP server anda
export const API_BASE_URL = 'http://192.168.1.6:8000';