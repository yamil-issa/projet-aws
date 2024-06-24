import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../task/task.model';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async findAll(userId: Types.ObjectId): Promise<Task[]> {
    return await this.taskModel.find({ user: userId }).exec();
  }

  async findById(id: string): Promise<Task> {
    return await this.taskModel.findById(id).exec();
  }

  async create(task: Task, userId: string): Promise<Task> {
    task.user = new Types.ObjectId(userId);
    const newTask = new this.taskModel(task);
    return await newTask.save();
  }

  async update(id: string, task: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, task, { new: true }).exec();
  }

  async delete(id: string): Promise<Task> {
    return await this.taskModel.findByIdAndDelete(id).exec();
  }
}
