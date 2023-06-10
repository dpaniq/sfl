import axios, { AxiosResponse } from 'axios'

const baseUrl: string = 'http://localhost:4000'


export const getUsers = async (): Promise<AxiosResponse<any>> => {
  return await axios.get(baseUrl + '/api/users').then(res => {
    console.log(res?.data.data)
    console.log(res?.data.message)
    return res?.data.data
  })
}

export const addUsers = async (): Promise<AxiosResponse<any>> => {
  await await axios.post(baseUrl + '/api/users')
  return await getUsers()
}

export const getTodos = async (): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const todos: AxiosResponse<ApiDataType> = await axios.get(
      baseUrl + '/todos'
    )
    return todos
  } catch (error) {
    throw new Error(error as any)
  }
}



export const addTodo = async (
  formData: ITodo
): Promise<AxiosResponse<ApiDataType>> => {
  console.log(formData)
  try {
    const todo: Omit<ITodo, '_id'> = {
      name: formData.name,
      description: formData.description,
      status: false,
    }
    const saveTodo: AxiosResponse<ApiDataType> = await axios.post(
      baseUrl + '/add-todo',
      todo
    )
    return saveTodo
  } catch (error) {
    throw new Error(error as any)
  }
}

export const updateTodo = async (
  todo: ITodo
): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const todoUpdate: Pick<ITodo, 'status'> = {
      status: true,
    }
    const updatedTodo: AxiosResponse<ApiDataType> = await axios.put(
      `${baseUrl}/edit-todo/${todo._id}`,
      todoUpdate
    )
    return updatedTodo
  } catch (error) {
    throw new Error(error as any)
  }
}

export const deleteTodo = async (
  _id: string
): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const deletedTodo: AxiosResponse<ApiDataType> = await axios.delete(
      `${baseUrl}/delete-todo/${_id}`
    )
    return deletedTodo
  } catch (error) {
    throw new Error(error as any)
  }
}
