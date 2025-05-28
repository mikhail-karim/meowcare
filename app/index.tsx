import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import SplashScreen from './splash';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}
