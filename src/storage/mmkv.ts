import { MMKV } from 'react-native-mmkv';
import { MMKV_ENCRYPTION_KEY } from '@env';

export const storage = new MMKV({
  id: 'auth-storage',
  encryptionKey: `${MMKV_ENCRYPTION_KEY}`,
});
