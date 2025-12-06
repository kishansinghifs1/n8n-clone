
import { CredentialsContainer, CredentialsList } from '@/features/credentials/components/credentials';
import { credentialsParamsLoader } from '@/features/credentials/server/params-loader';
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  searchParams: SearchParams;
}

const Page = async ({ searchParams }: Props) => {
  await requireAuth();
  const params = await credentialsParamsLoader(searchParams);
  return (
    <div>
      <CredentialsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <CredentialsList />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </CredentialsContainer>
    </div>
  )
}

export default Page
