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
  status?: 'Tersedia' | 'Diadopsi' | 'Pending'; 
};

export type Article = {
  id: number;
  title: string;
  category: string;
  author: string;
  image: any;
};



