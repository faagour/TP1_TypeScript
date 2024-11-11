import { FastifyReply, FastifyRequest } from "fastify";
import { ITodoList, ITodoItem } from "../interfaces";

// afficher toutes les listes
export async function listLists(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  if (this.level.db.status !== 'open') {
    reply.code(500).send({ error: 'Database is not connected' });
    return;
  }

  const listsIter = this.level.db.iterator();
  const result: ITodoList[] = [];
  for await (const [key, value] of listsIter) {
    result.push(JSON.parse(value));
  }
  reply.send({ data: result });
}

// ajouter une nouvelle liste
export async function addList(
  request: FastifyRequest, 
  reply: FastifyReply
) {
 const list = request.body as ITodoList;
 const result = await this.level.db.put(
   list.id.toString(), JSON.stringify(list)
 );
 reply.send({ data: result });
}

// mise à jour
export async function updateList(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const { name, description } = request.body as Partial<ITodoList>;

  const existingList = await this.level.db.get(id).catch(() => null);
  if (!existingList) {
    reply.code(404).send({ error: 'List not found' });
    return;
  }

  const list = JSON.parse(existingList);
  list.name = name ?? list.name;
  list.description = description ?? list.description;

  await this.level.db.put(id, JSON.stringify(list));
  reply.send({ data: list });
}

// ajouter un item à une liste
export async function addItemToList(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { description, status } = request.body as ITodoItem;

  if (!this.level?.db) {
    reply.code(500).send({ error: 'Database is not connected' });
    return;
  }

  const listData = await this.level.db.get(id).catch(() => null);
  if (!listData) {
    reply.code(404).send({ error: 'List not found' });
    return;
  }

  const list = JSON.parse(listData) as ITodoList;

  if (!Array.isArray(list.items)) {
    list.items = [];
  }

  const newItem: ITodoItem = {
    id: `i-${Date.now()}`,
    description,
    status
  };

  list.items.push(newItem);

  await this.level.db.put(id, JSON.stringify(list));
  reply.code(201).send({ data: newItem });
}


// supprimer un item d'une liste
export async function removeItemFromList(request: FastifyRequest, reply: FastifyReply) {
  const { listId, itemId } = request.params as { listId: string, itemId: string };

  if (!this.level?.db) {
    reply.code(500).send({ error: 'Database is not connected' });
    return;
  }

  const listData = await this.level.db.get(listId).catch(() => null);
  if (!listData) {
    reply.code(404).send({ error: 'List not found' });
    return;
  }

  const list = JSON.parse(listData) as ITodoList;

  const itemIndex = list.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    reply.code(404).send({ error: 'Item not found' });
    return;
  }

  list.items.splice(itemIndex, 1);

  await this.level.db.put(listId, JSON.stringify(list));
  reply.send({ message: 'Item removed' });
}

// mettre à jour un item dans une liste
export async function updateItemInList(request: FastifyRequest, reply: FastifyReply) {
  const { listId, itemId } = request.params as { listId: string, itemId: string };
  const { description, status } = request.body as Partial<ITodoItem>;

  if (!this.level?.db) {
    reply.code(500).send({ error: 'Database is not connected' });
    return;
  }

  const listData = await this.level.db.get(listId).catch(() => null);
  if (!listData) {
    reply.code(404).send({ error: 'List not found' });
    return;
  }

  const list = JSON.parse(listData) as ITodoList;

  const item = list.items.find(item => item.id === itemId);
  if (!item) {
    reply.code(404).send({ error: 'Item not found' });
    return;
  }

  item.description = description ?? item.description;
  item.status = status ?? item.status;

  await this.level.db.put(listId, JSON.stringify(list));
  reply.send({ data: item });
}
