// controllers/lists.controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { ITodoList, ITodoItem } from "../interfaces";

let staticLists: ITodoList[] = [
  {
    id: 'l-1',
    name: 'Dev tasks',
    description: 'Tasks related to development',
    items: []
  }
];

export async function listLists(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  console.log('DB status', this.level.db.status)
  const listsIter = this.level.db.iterator()

  const result: ITodoList[] = []
  for await (const [key, value] of listsIter) {
    result.push(JSON.parse(value))
  }
  reply.send({ data: result })
}


export async function addList(
  request: FastifyRequest, 
  reply: FastifyReply
) {
 const list = request.body as ITodoList
 const result = await this.level.leveldb.put(
   list.id.toString(), JSON.stringify(list)
 )
 reply.send({ data: result })
}

export const addItemToList = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { description, status } = request.body as ITodoItem;

  const list = staticLists.find(list => list.id === id);
  if (!list) {
    reply.code(404).send({ error: 'List not found' });
    return;
  }

  const newItem: ITodoItem = {
    id: `i-${Date.now()}`,  
    description,
    status
  };

  list.items.push(newItem);
  reply.code(201).send({ data: newItem });
};

export const removeItemFromList = async (request: FastifyRequest, reply: FastifyReply) => {
  const { listId, itemId } = request.params as { listId: string, itemId: string };

  const list = staticLists.find(list => list.id === listId);
  if (!list) {
    reply.code(404).send({ error: 'List not found' });
    return;
  }

  const itemIndex = list.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    reply.code(404).send({ error: 'Item not found' });
    return;
  }

  list.items.splice(itemIndex, 1);
  reply.send({ message: 'Item removed' });
};

export const updateItemInList = async (request: FastifyRequest, reply: FastifyReply) => {
  const { listId, itemId } = request.params as { listId: string, itemId: string };
  const { description, status } = request.body as Partial<ITodoItem>;

  const list = staticLists.find(list => list.id === listId);
  if (!list) {
    reply.code(404).send({ error: 'List not found' });
    return;
  }

  const item = list.items.find(item => item.id === itemId);
  if (!item) {
    reply.code(404).send({ error: 'Item not found' });
    return;
  }

  item.description = description ?? item.description;
  item.status = status ?? item.status;

  reply.send({ data: item });
};
