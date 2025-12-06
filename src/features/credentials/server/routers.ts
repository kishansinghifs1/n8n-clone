import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import { z } from "zod";
import { PAGINATION_LIMIT } from "@/config/constants";
import { CredentialType } from "@/generated/prisma/enums";

export const credentialsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(z.object({
      name: z.string().min(1, "Name Is Required!"),
      type: z.enum(CredentialType),
      value: z.string().min(1, "Value Is Required!"),
    }))
    .mutation(async ({ ctx, input }) => {
      const { name, value, type } = input;
      return prisma.credential.create({
        data: {
          name,
          userId: ctx.auth.user.id,
          type,
          value,
        },
      });
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.credential.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name Is Required!"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value Is Required!"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, value, type } = input;
      const credential = await prisma.credential.findUniqueOrThrow({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
      })
      return prisma.credential.update({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
        data: {
          name,
          type,
          value,
        },
      })
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.credential.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.auth.user.id },
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
          .default(PAGINATION_LIMIT.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const where = {
        userId: ctx.auth.user.id,
        name: {
          contains: search,
          mode: "insensitive",
        },
      };

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            updatedAt: true,
            value: true, 
            userId: true,
          },
        }),
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
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
  getByType: protectedProcedure
    .input(z.object({ type: z.enum(CredentialType) }))
    .query(async ({ ctx, input }) => {
      const { type } = input;
      return await prisma.credential.findMany({
        where: {
          userId: ctx.auth.user.id,
          type,
        },
      });
    }),
});
