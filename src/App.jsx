import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

//axios para luego renderizar todo los TODOS de API
function App() {
//para almacenar tareas
const [todos, setTodos] = useState([])
//para almacenar titulo
const [newTodo, setNewTodo]= useState("")
//para almacenar tarea editada
const [editingTodo, setEditingTodo] = useState(null);
const [editedTodoText, setEditedTodoText] = useState("");


//para llamar tareas
  useEffect(()=>{
    axios.get('http://localhost:8000/api/todos/') //cuidado NO poner https
        .then(({ data })=>{
          setTodos(_todos => {
            return data
          })
        })
  },[])

//fx para que el boton no haga postback:
const handleChangeTodo =(event)=>{
  setNewTodo(event.target.value)
}


//fx para agregar,capturar tareas y publicarlas
const createTodo = (event) => {
  event.preventDefault();

  if (editingTodo) {
    // editar tarea existente
    saveEditedTodo(editingTodo);
  } else {
    // Creating a new task
    axios.post('http://localhost:8000/api/todos/', {
      title: newTodo,
    })
      .then(({ data }) => {
        setTodos([data, ...todos]);
        setNewTodo("");
      });
  }
};


//fx para eliminar
const deleteTodo =(todo)=>{
  axios.delete(`http://localhost:8000/api/todo/${todo.id}/`)
    .then(()=>{
      setTodos(_todos=>{
        return _todos.filter(t=> t.id !== todo.id)
      })
    })
}


//para boton editar
const startEditing = (todo) => {
  setEditingTodo(todo);
  setEditedTodoText(todo.title);
};


//para guardar la edicion
const saveEditedTodo = (todo) => {
  axios.put(`http://localhost:8000/api/todos/${todo.id}`, {
    title: editedTodoText,
  })
    .then(({ data }) => {
      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.map((t) => {
          if (t.id === todo.id) {
            return data;
          }
          return t;
        });
        return updatedTodos;
      });
      setEditingTodo(null);
      setEditedTodoText("");
    });
};


//para no guardar
const cancelEditing = () => {
  setEditingTodo(null);
  setEditedTodoText("");
};

return (
  <div className='my-5 text-center'>
    <div className='card mx-auto' style={{ maxWidth: "520px"}}>
      <div className='card-body'>
        <div className='d-flex gap-3 justify-content-center'>
          
        </div>

        <h1>Lista de Tareas</h1>

        <div className="text-start">
          <form className='mt-5 mb-3' onSubmit={createTodo}>
            <div className='input-group'>

              <input 
                type="text" 
                placeholder='Ingresa una nueva tarea'
                className='form-control'
                onChange={handleChangeTodo}
                value={newTodo}
              />
              
              <button className='btn btn-primary'>+</button>
            </div>
          </form>
          {
todos.map((todo) => (
  <div key={todo.id} className='d-flex gap-1 justify-content-between align-items-center'>
    {editingTodo === todo ? (
      <>
        <input
          type="text"
          value={editedTodoText}
          onChange={(e) => setEditedTodoText(e.target.value)}
        />
        <button onClick={() => saveEditedTodo(todo)}>Guardar</button>
      </>
    ) : (
      <>
        <div>{todo.title}</div>
        
        <a href="#" className='small' onClick={() => startEditing(todo)}>Editar</a>
      </>
    )}
    <a href="#" className='small' onClick={() => deleteTodo(todo)}>Eliminar</a>
  </div>
))
}

{editingTodo && (
        <button onClick={cancelEditing}>Cancelar</button>
)}
        </div>
      </div>
    </div>
  </div>
)
}

export default App
