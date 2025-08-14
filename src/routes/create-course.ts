import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from 'zod'

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses', {
    schema: {
      tags: ['Courses'],
      summary: 'Create a new course',
      description: 'Creates a new course in the database using the provided title.',
      body: z.object({
        title: z
          .string()
          .min(5, 'Title must be at least 5 characters long')
          .describe('The title of the course to be created')
      }),
      response: {
        201: z.object({
          courseId: z.string().uuid().describe('The unique identifier of the newly created course')
        }),
        400: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const { title: courseTitle } = request.body

    if (!courseTitle) {
      return reply.status(400).send({ message: 'Title is required' })
    }

    const result = await db
      .insert(courses)
      .values({ title: courseTitle })
      .returning()

    return reply.status(201).send({ courseId: result[0].id })
  })
}
