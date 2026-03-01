import { AppError } from '@middlewares';
import axios from 'axios';

export async function getAdminToken() {
  const response = await axios.post(
    `${process.env.KEYCLOAK_BASE}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );

  return response.data.access_token;
}

export async function createKeycloakUser(
  adminToken: string,
  data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  },
) {
  const response = await axios.post(
    `${process.env.KEYCLOAK_BASE}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
    {
      username: data.email,
      email: data.email,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      enabled: true,
      emailVerified: true,
      requiredActions: [],
      credentials: [
        {
          type: 'password',
          value: data.password,
          temporary: false,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    },
  );

  if (response.status !== 201) {
    throw new AppError('Keycloak user creation failed', 400);
  }

  const location = response.headers.location;
  const userId = location.split('/').pop();

  return userId;
}

export async function deleteKeycloakUser(adminToken: string, userId: string) {
  await axios.delete(`${process.env.KEYCLOAK_BASE}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
}
