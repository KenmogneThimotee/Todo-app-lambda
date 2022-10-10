import { ToDoAccess } from './todosAcess'
import { StorageLogic } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils';
import { TodoUpdate } from '../models/TodoUpdate'
const uuidv4 = require('uuid')

// TODO: Implement businessLogic

const toDoAccess = new ToDoAccess();
const storageLogic = new StorageLogic();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.getAllToDo(userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    console.log("Preparing to parse user id")
    const userId = parseUserId(jwtToken);
    console.log("user id parsed:", userId, "Creatinf user id")
    const todoId =  uuidv4();
    console.log("user id created", todoId)
    const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
    console.log("attachement s3: ", s3BucketName)
    
    return toDoAccess.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.deleteToDo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return storageLogic.generateUploadUrl(todoId);
}