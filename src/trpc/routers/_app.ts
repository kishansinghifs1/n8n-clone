import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "../../lib/db";
import {inngest} from "@/inngest/client"

export const appRouter = createTRPCRouter({
  testAI :  protectedProcedure.mutation(
    async() => {
       await inngest.send({
        name : "execute/ai"
       })
       return {Success : true  , message : "Job Queued" }
    }
  ),
  getUsers: protectedProcedure.query(({ ctx }) => {
    console.log({ userId: ctx.auth.user.id });
    return prisma.user.findMany({
      where: {
        id: ctx.auth.user.id,
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
