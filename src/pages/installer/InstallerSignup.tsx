import React from 'react';
import { SignupForm } from '../../components/auth';

export function InstallerSignup() {
  return <SignupForm portalType="installer" redirectPath="/installer" />;
}

