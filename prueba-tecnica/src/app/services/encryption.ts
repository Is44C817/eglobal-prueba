import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Encryption {
  private readonly algorithm = 'AES-GCM';

  private readonly secretKey = 'eglobal-prueba-aes-key';

  async encrypt(value: string): Promise<string> {
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(this.secretKey));

    const key = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      {
        name: this.algorithm,
      },
      false,
      ['encrypt'],
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv,
      },
      key,
      encoder.encode(value),
    );

    const encryptedArray = new Uint8Array(encrypted);

    const result = new Uint8Array(iv.length + encryptedArray.length);

    result.set(iv);
    result.set(encryptedArray, iv.length);

    return this.arrayBufferToBase64(result);
  }

  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';

    buffer.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary);
  }
}
