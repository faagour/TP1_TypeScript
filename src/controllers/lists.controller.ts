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

// 1. Récupérer la liste de toutes les listes
export const listLists = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ data: staticLists });
};

// 2. Ajouter une nouvelle liste
export const addList = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, name, description } = request.body as Omit<ITodoList, 'items'>;
  const newList: ITodoList = {
    id,
    name,
    description,
    items: []
  };

  staticLists.push(newList);
  reply.code(201).send({ data: newList });
};

// 4. Ajouter un item à une liste
export const addItemToList = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { description, status } = request.body as ITodoItem;

  const list = staticLists.find(list => list.id === id);
  if (!list) {
    reply.code(404).send({ error: 'List not found' });
    return;
  }

  const newItem: ITodoItem = {
    id: `i-${Date.now()}`,  // Unique ID for each item
    description,
    status
  };

  list.items.push(newItem);
  reply.code(201).send({ data: newItem });
};

// 5. Supprimer un item d'une liste
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

// 6. Mettre à jour un item d'une liste
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
