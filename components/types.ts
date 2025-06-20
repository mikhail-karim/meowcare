export type Pet = {
  id: number;
  name: string;
  location: string;
  gender: string;
  age: string;
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

export const API_BASE_URL = 'http://192.168.0.108:8000';