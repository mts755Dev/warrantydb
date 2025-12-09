import React from 'react';
import { SignupForm } from '../../components/auth';

export function AdminSignup() {
  return <SignupForm portalType="admin" redirectPath="/admin" />;
}

