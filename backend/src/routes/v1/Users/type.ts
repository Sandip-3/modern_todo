export default interface User {
  userName: string;
  email: string;
  code?: string;
  password: string;
  refreshToken?: string;
}

export interface UserBody {
  userName?: string;
  password?: string;
}
