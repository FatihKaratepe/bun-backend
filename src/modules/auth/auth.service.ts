import { prisma } from '@lib';
import axios from 'axios';
import { createKeycloakUser, deleteKeycloakUser, getAdminToken } from './keycloak.service';

const KEYCLOAK_BASE = process.env.KEYCLOAK_BASE;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;

export async function register(dto: { email: string; password: string; userType: 'INDIVIDUAL' | 'CORPORATE' }) {
  const adminToken = await getAdminToken();

  const keycloakUserId = await createKeycloakUser(adminToken, dto);

  try {
    const user = await prisma.user.create({
      data: {
        keycloakId: keycloakUserId!,
        email: dto.email,
        userType: dto.userType,
      },
    });

    return user;
  } catch (error) {
    await deleteKeycloakUser(adminToken, keycloakUserId!);
    throw error;
  }
}

export async function login(dto: { email: string; password: string }) {
  try {
    const response = await axios.post(
      `${KEYCLOAK_BASE}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'password',
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        username: dto.email,
        password: dto.password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    };
  } catch (error: any) {
    throw new Error('Invalid credentials');
  }
}

export async function logout(refreshToken: string) {
  try {
    await axios.post(
      `${KEYCLOAK_BASE}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`,
      new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return true;
  } catch (error) {
    throw new Error('Logout failed');
  }
}
