import { FastifyInstance } from 'fastify';
import * as itemController from '../../controllers/lists.controller';
import { addListSchema, listListsSchema } from '../../schemas';

async function lists(fastify: FastifyInstance) {
  fastify.get('/', { schema: listListsSchema },itemController.listLists);
  fastify.post('/', { schema: addListSchema },itemController.addList);
  fastify.put('/:id', itemController.updateList);
  fastify.post('/:id/items', itemController.addItemToList);
  fastify.delete('/:listId/items/:itemId', itemController.removeItemFromList);
  fastify.put('/:listId/items/:itemId', itemController.updateItemInList);
}

export default lists;


