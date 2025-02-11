import http from '@/lib/http';
import {
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from '@/schemaValidations/auth.schema';
import {
  GuestLoginBodyType,
  GuestLoginResType,
} from '@/schemaValidations/guest.schema';

const prefix = '/guest';
const guestApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>(`${prefix}/auth/login`, body),
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>(`/api/guest/auth/login`, body, {
      baseUrl: '',
    }),
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    },
  ) =>
    http.post(
      `${prefix}/auth/logout`,
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    ),
  logout: () => http.post('/api/guest/auth/logout', null, { baseUrl: '' }), // client gọi đến route handler, không cần truyền AT và RT vào body vì AT và RT tự  động gửi thông qua cookie rồi
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>(`${prefix}/auth/refresh-token`, body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      '/api/guest/auth/refresh-token',
      null,
      {
        baseUrl: '',
      },
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
};

export default guestApiRequest;
