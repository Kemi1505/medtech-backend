import * as crypto from 'crypto';

export class EncryptionService {
  static async hash(data: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
  static async compare(password: string, userPassword: string): Promise<boolean> {
    if( await EncryptionService.hash(password) !== userPassword){
      return false
    }else {
      return true
    }
  }
}
