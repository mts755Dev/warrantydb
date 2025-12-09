import React from 'react';
import { LoginForm } from '../../components/auth';

export function AdminLogin() {
  return <LoginForm portalType="admin" redirectPath="/admin" />;
}

