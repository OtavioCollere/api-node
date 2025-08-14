import { fastifySwagger } from '@fastify/swagger'
import { fastify } from 'fastify';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { createCourseRoute } from './src/routes/create-course.ts';
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts';
import { getCoursesRoute } from './src/routes/get-courses.ts';
import scalarAPIReference from '@scalar/fastify-api-reference'
import fastifyApiReference from '@scalar/fastify-api-reference';


const server = fastify({
  logger : {
    transport : {
      target : 'pino-pretty',
      options : {
        translateTime : 'HH:MM:ss Z',
        ignore : 'pid,hostname'
      }
    }
  }
}).withTypeProvider<ZodTypeProvider>();

server.register(fastifySwagger, {
  openapi : {
    info : {
      title : 'Desafio Node.js',
      version : '1.0.0'
    }
  },
  transform : jsonSchemaTransform
})

server.register(fastifyApiReference, {
  routePrefix: '/docs'
})

// Validator => checagem nos dados de entrada ( validar dados obrigatórios )
server.setValidatorCompiler(validatorCompiler)

//Serializer => converter os dados de saida ( transformar os dados de saida de uma rota em outro formato )
server.setSerializerCompiler(serializerCompiler) 


server.register(createCourseRoute)
server.register(getCourseByIdRoute)
server.register(getCoursesRoute)

server.listen({port : 3333}).then(() => {
  console.log("HTTP server running!");
})