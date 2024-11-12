import fp from 'fastify-plugin'
import swagger, { FastifySwaggerOptions } from '@fastify/swagger'

export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.register(swagger, {
    openapi: {
      "info": { "title": 'Todo API by Fouad Mehdi & Abdoulaye', 
        "description": 'This is a todo-list API' , 
        "version": '1.0.0',
        "contact": {
          "name": "Fouad",
          "email": "Fouad.aagour@imt-atlantique.net"
      }
    },
      "servers": [
        {
          "url": 'http://localhost:3000',
          "description": 'Development server'
        }
      ],
      paths: {
        "/": {
          get: {
            "description": "Returns all the lists",
            "responses": {
              "200": {         
                "description": "The lists (to-do)"
                      }
                    }
                  },
          post: {
            "description": "Add a new list",
            "responses": {
              "200": {
                "description":"All the lists created"
              }
            }
          },
          parameters: [{
            "name": "new_list",
            "in": "query",
            "description": "ID of the list to add",
            "required": true,
            "schema": {
            "type": "string"
            }
          }]        
        },
        '/{id}': {
          put: {
            "description": "update the list",
            "responses" : {
              "200": {
                "description": "list updated"
              } 
            }
          },
          parameters: [{
            "name": "id",
            "in": "path",
            "description": "ID of the list that needs to be updated",
            "required": true,
            "schema": {
            "type": "string"
            }
          }]
        },
        '/{id}/items': {
          post: {
            "description": "take the id of a list and gives it an item",
            "responses" : {
              "200": {
                "description": "item added"
              } 
            }
          },
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the list to use",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "style": "simple"
            },
            {
              "name": "item",
              "in": "query",
              "description": "item to add",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "style": "simple"
            }
          ]
        },
        '/{listId}/items/{itemId}':{
          delete: {
            "description": "Take the id of a list and the id of an item and remove the item from the list",
            "responses" : {
              "200": {
                "description": ""
              }
            }
          },
          parameters: [
            {
              "name": "listId",
              "in": "path",
              "description": "ID of the list to use",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "style": "simple"
            },
            {
              "name": "itemId",
              "in": "path",
              "description": "ID of the item to delete",
              "required": true,
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "style": "simple"
            }
          ]
        }
      }
    }
  })
})