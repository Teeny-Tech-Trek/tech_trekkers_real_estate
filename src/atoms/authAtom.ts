// src/atoms/authAtom.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { AuthState, User, AuthTokens } from '../types/auth';

// Atom to store auth state (user and tokens) in localStorage
export const authAtom = atomWithStorage<AuthState>('auth', {
  user: null,
  tokens: null,
  isLoading: true,
});

// Atom to set auth state
export const setAuthAtom = atom(
  null,
  (get, set, update: { user: User | null; tokens: AuthTokens | null }) => {
    set(authAtom, {
      ...get(authAtom),
      user: update.user,
      tokens: update.tokens,
      isLoading: false,
    });
  }
);

// Atom to update loading state
export const setAuthLoadingAtom = atom(null, (get, set, isLoading: boolean) => {
  set(authAtom, { ...get(authAtom), isLoading });
});