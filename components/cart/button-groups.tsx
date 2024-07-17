'use client';

import { Button } from 'components/ui';
import { useAuth } from 'hooks/use-auth';
import Link from 'next/link';

const ButtonGroups = () => {
  const { isAuthenticated, loading, authorizeAction } = useAuth();
  return (
    <>
      {!isAuthenticated && (
        <form action={authorizeAction}>
          <Button
            color="primary"
            variant="solid"
            className="mb-3 min-w-[160px]"
            disabled={loading}
            isLoading={loading}
            loadingText="Checking Authentication"
          >
            Login
          </Button>
        </form>
      )}
      <Button className="min-w-[160px]">
        <Link href="/">Let&apos;s go Shopping!</Link>
      </Button>
    </>
  );
};

export default ButtonGroups;
