import React, { useEffect, useState } from 'react'
// import TodoItem from './components/TodoItem'
// import AddTodo from './components/AddTodo'
// import { getTodos, addTodo, updateTodo, deleteTodo, getUsers } from './API'
import { addUsers, getUsers } from './API'

const App: React.FC = () => {
  // const [todos, setTodos] = useState<ITodo[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    // fetchTodos()
    fetchUsers()
  }, [])

  // const fetchTodos = (): void => {
  //   getTodos()
  //     .then(({ data: { todos } }: ITodo[] | any) => setTodos(todos))
  //     .catch((err: Error) => console.log(err))
  // }

  const fetchUsers = (): void => {
    getUsers().then((x) => {
      console.log('BEFORE', x)
      setUsers(x as any)
    })
  }

  const handleAddUsers = async (): Promise<void> => {
    await addUsers().then(x => {
      console.log({ x })
      setUsers(x as any)
    })

  }

  // const handleSaveTodo = (e: React.FormEvent, formData: ITodo): void => {
  //   e.preventDefault()
  //   addTodo(formData)
  //     .then(({ status, data }) => {
  //       if (status !== 201) {
  //         throw new Error('Error! Todo not saved')
  //       }
  //       setTodos(data.todos)
  //     })
  //     .catch((err) => console.log(err))
  // }

  // const handleUpdateTodo = (todo: ITodo): void => {
  //   updateTodo(todo)
  //     .then(({ status, data }) => {
  //       if (status !== 200) {
  //         throw new Error('Error! Todo not updated')
  //       }
  //       setTodos(data.todos)
  //     })
  //     .catch((err) => console.log(err))
  // }

  // const handleDeleteTodo = (_id: string): void => {
  //   deleteTodo(_id)
  //     .then(({ status, data }) => {
  //       if (status !== 200) {
  //         throw new Error('Error! Todo not deleted')
  //       }
  //       setTodos(data.todos)
  //     })
  //     .catch((err) => console.log(err))
  // }

  return (
    <main className='App'>
      <h1>My Todos</h1>
      <button onClick={() => handleAddUsers()}>Handle</button>
      <p>
        {users.map(user => (<p>{user.id}: {user.email}</p>))}
      </p>

      {/* {users.map((users) => {
        { user?.id } { user?.name }
      })} */}
      {/* <AddTodo saveTodo={handleSaveTodo} /> */}
      {/* {todos.map((todo: ITodo) => (
        <TodoItem
          key={todo._id}
          updateTodo={handleUpdateTodo}
          deleteTodo={handleDeleteTodo}
          todo={todo}
        />
      ))} */}
    </main>
  )
}

export default App
