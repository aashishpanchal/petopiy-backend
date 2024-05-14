// user roles
export enum RoleEnum {
  USER = 'User',
  ADMIN = 'Admin',
  VENDOR = 'Vendor',
}

// strategy enum
export enum AuthEnum {
  LOCAL = 'local',
  JWT = 'jwt',
}

// token enum
export enum TokenEnum {
  ACCESS = 'Access',
  REFRESH = 'Refresh',
}

// activity enum
export enum ActivityEnum {
  LOGIN = 'Login',
  LOGOUT = 'Logout',
}
