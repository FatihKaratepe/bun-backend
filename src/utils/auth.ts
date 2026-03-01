import { createRemoteJWKSet, jwtVerify } from 'jose';

let jwks: ReturnType<typeof createRemoteJWKSet>;

function getJWKS() {
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(`${process.env.KEYCLOAK_BASE}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`),
    );
  }
  return jwks;
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getJWKS(), {
    issuer: `${process.env.KEYCLOAK_BASE}/realms/${process.env.KEYCLOAK_REALM}`,
  });

  return payload;
}
