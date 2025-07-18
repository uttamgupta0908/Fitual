import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'auth-storage', // Optional: Custom ID
  encryptionKey: 'your-32-character-encryption-key', // Optional: For encryption (recommended for tokens)
});
