import ms from 'ms';
import crypto from 'crypto';
import { config } from '@/config';
import { singleton } from 'tsyringe';

@singleton()
export class OTP {
  readonly #ttl = ms(config.OTP.EXPIRES_IN);
  readonly #digits = config.OTP.DIGITS;
  readonly #secret = config.OTP.SECRET;

  public generate(label: string) {
    const expires = Date.now() + this.#ttl;
    // Generate a random otp
    const otp = this.randomOtp(this.#digits);
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');
    // make data to encode
    const data = `${label}.${otp}.${expires}.${salt}`;
    // make hash
    const hash = `${this.makeHash(data)}.${expires}.${salt}`;

    return { otp, hash, ttl: this.#ttl };
  }

  public verify(label: string, otp: string, hash: string) {
    if (!hash.match('.')) return false; // Hash should have at least one dot
    // split the hash into parts: hash value, expires from the hash returned from the user(
    const [hashValue, expires, salt] = hash.split('.');
    // make data to encode
    if (Date.now() > Number(expires)) return false;
    // calculate new hash with the secret and the same algorithm
    const data = `${label}.${otp}.${expires}.${salt}`;
    // compare the hashes
    return this.makeHash(data) === hashValue;
  }

  private randomOtp(length: number) {
    const chars = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }

    return otp;
  }

  private makeHash(data: string) {
    return crypto.createHmac('sha256', this.#secret).update(data).digest('hex');
  }
}
