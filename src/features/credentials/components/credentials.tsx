"use client"
import { EntityHeader, EntityContainer, EntitySearch, EntityPagination, LoadingView, ErrorView, EmptyView, EntityList, EntityItem } from "@/components/entity-components";
import { useParams, useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { CredentialType } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { useRemoveCredential, useSuspenseCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import { useCredentialQueryStates } from "../hooks/use-credentials-params";

import Image from "next/image";
import { Credential } from "@/generated/prisma/browser";
import { CredentialForm } from "./credentialForm";

export const CredentialView = ({credentialId} : {credentialId: string}) => {
    const params = useParams();
    const {data : credential} = useSuspenseCredential(credentialId);
    return <CredentialForm initialData={credential} />
}

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();
    return (
        <EntityList
            items={credentials.data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialItem data={credential as Credential} />}
            emptyView={<CredentialsEmpty />}
        />
    )
};

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialQueryStates();
    const { searchValue, setSearchValue } = useEntitySearch({
        params,
        setParams,
    });
    return (
        <EntitySearch
            placeholder="Search credentials"
            value={searchValue}
            onChange={setSearchValue}
        />
    );
}


const credentialLogo: Record<CredentialType, string> = {
    [CredentialType.GEMINI]: "/logos/gemini.svg"
}


export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
    return (
        <EntityHeader
            title="Credentials"
            description="Create and manage your credentials"
            newButtonHref={`/credentials/new`}
            newButtonLabel="New credential"
            disabled={disabled}
        />
    );
};

export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialQueryStates();

    return (
        <EntityPagination
            disabled={credentials.isFetching}
            totalPages={credentials.data.totalPages}
            page={credentials.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};


export const CredentialsContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<CredentialsHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}
        >
            {children}
        </EntityContainer>
    );
};


export const CredentialsLoading = () => {
    return <LoadingView message="Loading Credentials ... " />
}

export const CredentialsError = () => {
    return <ErrorView message="Error loading credentials ... " />
}

export const CredentialsEmpty = () => {
    const router = useRouter();
    const handleCreate = () => {
        router.push(`/credentials/new`);
    }
    return (
        <EmptyView message="No credentials found. Get started by creating a new credential" onNew={handleCreate} />
    )
}

export const CredentialItem = ({
    data,
}: {
    data: Credential
}) => {
    const removeCredential = useRemoveCredential();
    const handleRemove = () => {
        removeCredential.mutate({ id: data.id });
    }

    const logo = credentialLogo[data.type] || "/logos/gemini.svg";

    return (
        <EntityItem
            href={`/credentials/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
                    &bull; Created {" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                <div className="size-8 flex items-center justify-center rounded-full bg-muted">
                    <Image src={logo} alt={data.type} width={24} height={24} />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}