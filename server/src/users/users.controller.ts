import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TUser, UsersService } from './users.service';

@Controller('users') // /users декоратор
export class UsersController {
  //GET /users
  //GET /users/id -> detail user info
  //POST /users
  //PATCH /users/id
  //DELETE /users/id

  constructor(private readonly usersService: UsersService) {}

  user: TUser[] = [];
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
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  newUser(@Body() user: TUser) {
    return this.usersService.create(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() newData: Omit<TUser, 'id'>) {
    return this.usersService.update(id, newData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  //Get /users
}
