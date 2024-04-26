import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
    id: 'userSecurity'
  })


export const setSecurityKey = (key:string, value:string) => {
     storage.set(key, value);
}

export const getSecurityKey = (key:string) => {
    storage.getString(key);
}