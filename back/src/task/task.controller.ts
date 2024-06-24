import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { Types } from 'mongoose';

@Controller('tasks')
export class TaskController {
  constructor(private tasksService: TaskService) {}

  @Get(':userId')
  async findAll(@Param('userId') userId: string): Promise<Task[]> {
    const userObjId = new Types.ObjectId(userId);
    return this.tasksService.findAll(userObjId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findById(id);
  }

  @Post(':userId')
  @UseGuards(AuthMiddleware) 
  async create(@Body() task: Task, @Param('userId') userId: string): Promise<Task> {
    return this.tasksService.create(task, userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() task: Task): Promise<Task> {
    return this.tasksService.update(id, task);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Task> {
    return this.tasksService.delete(id);
  }
}
