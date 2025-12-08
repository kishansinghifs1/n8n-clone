"use client"
import { EntityHeader, EntityContainer, EntitySearch, EntityPagination, LoadingView, ErrorView, EmptyView, EntityList, EntityItem } from "@/components/entity-components";
import { useParams, useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { formatDistanceToNow } from "date-fns";
import { useSuspenseExecution, useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsQueryStates } from "../hooks/use-executions-params";
import Image from "next/image";
import type { Execution } from "@/generated/prisma";
import { ExecutionStatus } from "@/generated/prisma";
import { CheckCircle2Icon, Clock12Icon, Loader2Icon, XCircleIcon } from "lucide-react";

 
export const ExecutionsList = () => {
    const executions = useSuspenseExecutions();
    return (
        <EntityList
            items={executions.data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => <ExecutionItem data={execution} />}
            emptyView={<ExecutionsEmpty />}
        />
    )
};



export const ExecutionsHeader = () => {
    return (
        <EntityHeader
            title="Executions"
            description="Create and manage your credentials"
        />
    );
};

export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsQueryStates();

    return (
        <EntityPagination
            disabled={executions.isFetching}
            totalPages={executions.data.totalPages}
            page={executions.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};


export const ExecutionsContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination />}
        >
            {children}
        </EntityContainer>
    );
};


export const ExecutionsLoading = () => {
    return <LoadingView message="Loading Executions ... " />
}

export const ExecutionsError = () => {
    return <ErrorView message="Error loading Executions ... " />
}

export const ExecutionsEmpty = () => {
    return (
        <EmptyView message="No executions found. Get started by execution of a workflow" />
    )
}

const getStatusIcon = (status : ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-success" />
        case ExecutionStatus.RUNING:
            return <Loader2Icon className="size-5 text-warning animate-spin" />
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-error" />
        default :
            return <Clock12Icon className="size-5 text-muted" />
    }
}


export const ExecutionItem = ({
    data,
}: {
    data: Execution & {
        workflow: {
            id: string,
            name: string
        }
    }
}) => {
    const duration = data.completedAt ? Math.round((new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000) : undefined;
    const subtitle = (
        <>
        {data.workflow.name} &bull; Started{" "}
        {formatDistanceToNow(data.startedAt, { addSuffix: true })}
        {duration !== null && <> &bull; Duration {duration}s</>}
        </>
    )
    return (
        <EntityItem
            href={`/executions/${data.id}`}
            title={data.status}
            subtitle={subtitle}
            image={
                <div className="size-8 flex items-center justify-center rounded-full bg-muted">
                    {getStatusIcon(data.status)}
                </div>
            }
        />
    )
}