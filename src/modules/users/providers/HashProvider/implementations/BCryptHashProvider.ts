import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {

  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(paylod: string, hashed: string): Promise<boolean>{
    return compare(paylod, hashed);
  }
}

export default BCryptHashProvider;
