import { Injectable } from '@nestjs/common';
import { generateRandomString } from '../utlis';

export type TUser = {
  id: string;
  age: number;
  name: string;
  role: string;
};

@Injectable()
export class UsersService {
  users: TUser[] = [
    {
      id: '1',
      age: 28,
      name: 'Алексей Петров',
      role: 'admin',
    },
    {
      id: '2',
      age: 32,
      name: 'Мария Иванова',
      role: 'manager',
    },
    {
      id: '3',
      age: 24,
      name: 'Дмитрий Смирнов',
      role: 'developer',
    },
    {
      id: '4',
      age: 41,
      name: 'Ольга Кузнецова',
      role: 'analyst',
    },
    {
      id: '5',
      age: 19,
      name: 'Иван Васильев',
      role: 'intern',
    },
  ];

  findAll(role?: string) {
    if (role === undefined) {
      return this.users;
    }

    return this.users.filter((user) => user.role === role);
  }

  findOne(id: string) {
    let res: null | TUser = null;

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        res = this.users[i];
        break;
      }
    }

    return res;
  }

  create(user: Omit<TUser, 'id'>) {
    const newId = generateRandomString(10);
    const newUser: TUser = { ...user, id: newId };
    this.users.push(newUser);

    return newUser;
  }

  update(id: string, user: Omit<TUser, 'id'>) {
    this.users = this.users.map((currentUser) =>
      currentUser.id === id ? { ...currentUser, ...user } : currentUser,
    );

    return { id, ...user };
  }

  delete(id: string) {
    let deletedUser = this.findOne(id);
    if (deletedUser === null) {
      return null;
    }

    this.users = this.users.filter((user) => user.id !== id);

    return deletedUser;
  }
}
