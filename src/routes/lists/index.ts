import { FastifyInstance } from 'fastify';
import * as itemController from '../../controllers/lists.controller';

async function lists(fastify: FastifyInstance) {
  fastify.get('/', itemController.listLists);
  fastify.post('/', itemController.addList);
  fastify.put('/:id', itemController.updateList);
  fastify.post('/:id/items', itemController.addItemToList);
  fastify.delete('/:listId/items/:itemId', itemController.removeItemFromList);
  fastify.put('/:listId/items/:itemId', itemController.updateItemInList);
}

export default lists;
