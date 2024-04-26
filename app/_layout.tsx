import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Layout() {

  const router = useRouter();

  useEffect(()=>{
    router.push('/welcome')
  },[])

  return <Stack initialRouteName='welcome'>
    <Stack.Screen name='welcome' options={{headerShown:false}}/>
    </Stack>;
}
