import { ImageSourcePropType } from 'react-native';

export interface Pet {
  id: number;
  name: string;
  location: string;
  gender: string;
  age: string;
  image: string | ImageSourcePropType;
} 