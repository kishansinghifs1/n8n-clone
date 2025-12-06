import {
    createTRPCRouter,
    protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import { z } from "zod";
import { PAGINATION_LIMIT } from "@/config/constants";

export const executionsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return await prisma.execution.findUniqueOrThrow({
                where: { id: input.id, workflow: { userId: ctx.auth.user.id } , },
                include:{
                    workflow : {
                        select : {
                            id : true,
                            name : true
                        }
                    }
                }
            });
        }),
    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(PAGINATION_LIMIT.DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(PAGINATION_LIMIT.MIN_PAGE_SIZE)
                    .max(PAGINATION_LIMIT.MAX_PAGE_SIZE)
                    .default(PAGINATION_LIMIT.DEFAULT_PAGE_SIZE)
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize } = input;

            const [items, totalCount] = await Promise.all([
                prisma.execution.findMany({
                    where: { workflow: { userId: ctx.auth.user.id } },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    orderBy: {
                        startedAt: "desc",
                    },
                    include: {
                        workflow: {
                            select: {
                                id: true,
                                name : true
                            },
                        },
                    },
                }),
                prisma.execution.count({
                    where: { workflow: { userId: ctx.auth.user.id } },
                }),
            ]);

            const totalPages = Math.ceil(totalCount / pageSize);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return {
                items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            };
        }),
});
