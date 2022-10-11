import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    //const todo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    console.log("Auhtenticated", jwtToken)

    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    console.log("newTodo formed", newTodo)
    const toDoItem = await createToDo(newTodo, jwtToken);
    console.log("Todo created")

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            "item": toDoItem
        }),
    }
})

handler.use(
  cors({
    credentials: true
  })
)
