// interfaces/index.ts

export interface ITodoList {
  id: string;
  name: string;
  description?: string;
  items: ITodoItem[];
}

export interface ITodoItem {
  id: string;
  description: string;
  status: 'PENDING' | 'IN-PROGRESS' | 'DONE';
}
