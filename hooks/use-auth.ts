import { isLoggedIn, login } from 'components/profile/actions';
import { useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';

export const useAuth = () => {
  const [loading, startTransition] = useTransition();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, authorizeAction] = useFormState(login, null);

  useEffect(() => {
    startTransition(async () => {
      const loggedIn = await isLoggedIn();
      setIsAuthenticated(loggedIn);
    });
  }, []);

  return { isAuthenticated, authorizeAction, loading };
};
