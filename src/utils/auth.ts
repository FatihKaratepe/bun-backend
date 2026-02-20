import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(new URL('http://localhost:8080/realms/my-app/protocol/openid-connect/certs'));

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: 'http://localhost:8080/realms/my-app',
  });

  return payload;
}
