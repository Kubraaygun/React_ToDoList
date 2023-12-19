import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CustomButton from "./components/CustomButton/CustomButton";
import CustomInput from "./components/CustomInput/CustomInput";
import "./App.css";
const App = () => {
  const [todos, setTodos] = useState([]);

  const [todoText, setTodoText] = useState("");

  const getTodos = () => {
    axios
      .get("http://localhost:3001/todos")
      .then((response) => setTodos(response?.data))
      .catch((error) => console.log("get hatasi", error?.message));
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("onSubmit Calisti");
    //console.log(todoText)

    const newTodo = {
      id: new Date().getTime(),
      title: todoText,
      date: new Date().toLocaleString(),
      isDone: false,
    };

    axios
      .post("http://localhost:3001/todos", newTodo)
      .then(() => setTodos([...todos, newTodo]));

    setTodoText("");
  };

  const handleDelete = (id) => {
    //  console.log("silme fonksiyonu",id);

    axios.delete(`http://localhost:3001/todos/${id}`).then(() => {
      const filtered = todos.filter((todo) => todo.id !== id);
      setTodos(filtered);
    });
  };

  const handleEdit = (todoInfo) => {
   // console.log('checkbox fonksiyonu',todoInfo)
   let updatedTodo={...todoInfo,isDone:!todoInfo.isDone}

   axios.put(`http://localhost:3001/todos/${todoInfo.id}`,updatedTodo).then(()=>{
    const cloneTodos=[...todos]

    const updatedIndex=cloneTodos.findIndex((item)=>item.id ===todoInfo.id)
    cloneTodos.splice(updatedIndex,1,updatedTodo)
    setTodos(cloneTodos)
   })
  };

  return (
    <div className="container">
      <h1>Yapılacaklar Listesi</h1>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <CustomInput
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <CustomButton type={"primary"} buttonTitle={"Ekle"} />
      </form>
      <ul className="list-group mt-4">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <input 
              checked={todo?.isDone}
              onClick={
                ()=>handleEdit(todo)
              }
              type="checkbox" />
              {todo?.isDone === true ? " Tamamlandı " : "   Devam Ediyor "}
            </span>

            <span>{todo?.title}</span>

            <CustomButton
              onClick={() => handleDelete(todo?.id)}
              type={"danger"}
              buttonTitle={"Sil"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
