import { prisma } from '@lib';
import { AppError } from '@middlewares';
import { createUserValidatorSchema } from '@schemas';
import axios from 'axios';
import crypto from 'node:crypto';
import { createKeycloakUser, deleteKeycloakUser, enableKeycloakUser, getAdminToken, updateKeycloakPassword, updateKeycloakUser } from './keycloak.service';
import { transporter } from '@config';

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
  const activationToken = crypto.randomUUID();

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
        activationToken,
      },
    });

    try {
      const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${activationToken}`;
      await transporter.sendMail({
        from: process.env.SMTP_MAIL_USERNAME,
        to: user.email,
        subject: 'Hesabınız Oluşturuldu - E-posta Doğrulama Gerekiyor',
        text: `Merhaba ${user.firstName},\n\nHesabınız başarıyla oluşturuldu. Hesabınızı kullanmaya başlamak için lütfen aşağıdaki bağlantıya tıklayarak e-posta adresinizi doğrulayın:\n\n${verificationLink}\n\nAramıza hoş geldiniz!`,
      });
    } catch (mailError) {
      console.error('E-posta gönderme hatası:', mailError);
    }

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
    throw new AppError('Logout failed', 400);
  }
}

export async function updateUser(
  keycloakId: string,
  dto: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    companyName?: string;
    taxNumber?: string;
    taxOffice?: string;
  }
) {
  const adminToken = await getAdminToken();

  if (dto.firstName !== undefined || dto.lastName !== undefined) {
    await updateKeycloakUser(adminToken, keycloakId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
  }

  const updatedUser = await prisma.user.update({
    where: { keycloakId },
    data: {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      companyName: dto.companyName,
      taxNumber: dto.taxNumber,
      taxOffice: dto.taxOffice,
    },
  });

  return updatedUser;
}

export async function resetPassword(keycloakId: string, newPassword: string) {
  const adminToken = await getAdminToken();

  await updateKeycloakPassword(adminToken, keycloakId, newPassword);

  return { message: 'Password updated successfully' };
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findUnique({
    where: { activationToken: token },
  });

  if (!user) {
    throw new AppError('Invalid or expired activation token', 400);
  }

  const adminToken = await getAdminToken();
  await enableKeycloakUser(adminToken, user.keycloakId);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      activationToken: null,
    },
  });

  return { message: 'Email verified successfully. You can now log in.' };
}
