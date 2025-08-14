import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses', {
    schema: {
      tags: ['Courses'],
      summary: 'List all courses',
      description: 'Retrieves a list of all available courses from the database.',
      response: {
        200: z.object({
          courses: z.array(
            z.object({
              id: z.string().uuid().describe('Course unique identifier'),
              title: z.string().describe('Title of the course')
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const result = await db.select({
      id: courses.id,
      title: courses.title
    }).from(courses);

    return reply.status(200).send({
      courses: result
    });
  });
};
