import { REST_API_ADDRESS as API } from './../config';
import axios from 'axios';
import { Task } from '../model/task';

export class TaskService {
  static getTasks() {
    return axios.get(API + '/tasks');
  }

  static saveTask(task: Task) {
    return axios.post(API + '/tasks', task);
  }

  static deleteTask(id: string) {
    return axios.delete(API + '/tasks/' + id);
  }

  static getTaskById(id: string) {
    return axios.get(API + '/tasks/' + id);
  }

  static toggleTask(task: Task) {
    return axios.put(API + '/tasks/' + task.id, task);
  }
}
