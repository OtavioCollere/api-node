import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { eq } from "drizzle-orm";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:id', {
    schema: {
      tags: ['Courses'],
      summary: 'Get course by ID',
      description: 'Retrieves the details of a course given its unique ID.',
      params: z.object({
        id: z.string().uuid().describe('The unique identifier of the course')
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.string().uuid().describe('Course unique identifier'),
            title: z.string().describe('Title of the course')
          })
        }),
        404: z.object({
          message: z.string().describe('Error message when the course is not found')
        })
      }
    }
  }, async (request, reply) => {
    const courseId = request.params.id;

    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));

    if (result.length > 0) {
      return reply.status(200).send({
        course: result[0]
      });
    }

    return reply.status(404).send({ message: 'Course not found' });
  });
};
