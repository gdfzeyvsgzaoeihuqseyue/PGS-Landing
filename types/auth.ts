export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  [key: string]: any;
}

export interface Service {
  serviceId: string;
  serviceName: string;
  domain: string;
  role: 'user' | 'admin' | 'moderator';
  permissions: any;
  lastAccess: string;
  isActive: boolean;
}
