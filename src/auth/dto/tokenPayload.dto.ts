export class TokenPayloadDTO {
  constructor(public email: string) {}

  public expiresIn = 86400; // 1 day
}
