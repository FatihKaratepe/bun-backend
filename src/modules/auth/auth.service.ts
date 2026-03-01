import { prisma } from '@lib';
import { AppError } from '@middlewares';
import { createUserValidatorSchema } from '@schemas';
import axios from 'axios';
import { createKeycloakUser, deleteKeycloakUser, getAdminToken } from './keycloak.service';

export async function register(dto: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'INDIVIDUAL' | 'CORPORATE';
  companyName?: string;
  taxNumber?: string;
  taxOffice?: string;
}) {
  const { password, ...userData } = dto;

  const result = createUserValidatorSchema.safeParse({
    ...userData,
    keycloakId: 'temp',
  });

  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new AppError(`Validation failed — ${messages}`, 400);
  }

  const adminToken = await getAdminToken();
  const keycloakUserId = await createKeycloakUser(adminToken, dto);

  try {
    const user = await prisma.user.create({
      data: {
        keycloakId: keycloakUserId!,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        userType: userData.userType,
        companyName: userData.companyName,
        taxNumber: userData.taxNumber,
        taxOffice: userData.taxOffice,
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
      `${process.env.KEYCLOAK_BASE}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
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
    const detail = error.response?.data?.error_description || error.message;
    throw new AppError(`Invalid credentials — ${detail}`, 401);
  }
}

export async function logout(refreshToken: string) {
  try {
    await axios.post(
      `${process.env.KEYCLOAK_BASE}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`,
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
