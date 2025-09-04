import bcrypt from "bcrypt";
import { IHashService } from "../interfaces/hash-service.interface";

export class BcryptHashService implements IHashService {
  constructor(private readonly saltRounds: number = 10) {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
