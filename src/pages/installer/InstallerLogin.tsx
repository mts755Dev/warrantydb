import React from 'react';
import { LoginForm } from '../../components/auth';

export function InstallerLogin() {
  return <LoginForm portalType="installer" redirectPath="/installer" />;
}

