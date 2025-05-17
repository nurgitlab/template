import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

type User = {
  id: string;
  name: string;
};

@Controller('users') // /users декоратор
export class UsersController {
  //GET /users
  //GET /users/id -> detail user info
  //POST /users
  //PATCH /users/id
  //DELETE /users/id

  user: User[] = [];
  isUserExists = (id: string) => {
    for (const user of this.user) {
      if (user.id === id) {
        return user;
      }
    }

    return null;
  };

  @Get()
  findAll() {
    return {
      data: {
        users: this.user,
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const findedUser = this.user.reduce((prev, current) => {
      if (current.id === id) {
        return current;
      }

      return prev;
    }, null);

    if (findedUser === null) {
      return {
        data: 'Пользователь не найден.',
      };
    }
    return {
      data: {
        id: findedUser.id,
        message: 'Найден пользователь! ',
      },
    };
  }

  @Post()
  newUser(@Body() user: User) {
    if (this.isUserExists(user.id) !== null) {
      return {
        data: {
          id: user.id,
          message: 'Данный пользователь уже существует',
        },
      };
    }

    this.user.push(user);

    return {
      data: {
        id: user.id,
        message: `Добавлен пользователь с id=${user.id ? user.id : ''}`,
      },
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() newData: Omit<User, 'id'>) {
    const user = this.isUserExists(id);

    if (user === null) {
      return {
        id: id,
        message: 'Данного пользователя не существует',
      };
    }

    this.user = this.user.map((currentUser) =>
      currentUser.id === id ? { id, ...newData } : currentUser,
    );

    return {
      id: id,
      message: 'Данные пользователя успешно обновлены',
      newData: newData,
    };
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.user = this.user.filter((user) => user.id !== id);

    return {
      id: id,
      message: 'Пользователь удалён',
    };
  }

  //Get /users
}
