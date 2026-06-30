import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get(':wallet')
  findByWallet(@Param('wallet') wallet: string) {
    return this.usersService.findByWallet(wallet);
  }

  @Patch(':wallet')
  update(@Param('wallet') wallet: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(wallet, dto);
  }
}