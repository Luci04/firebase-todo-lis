import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";
import AddTaskIcon from "@mui/icons-material/AddTask";

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [completed, setCompleted] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // add
  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uidd: uidd,
      completed: false,
    });

    setTodo("");
  };

  // update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
    setCompleted(false);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      completed: completed,
    });

    setTodo("");
    setIsEdit(false);
  };

  const handleCompleted = (todo) => {
    update(ref(db, `/${auth.currentUser.uid}/${todo.uidd}`), {
      completed: !todo.completed,
    });
  };

  // delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="add-container">
        <input
          className="add-edit-input"
          type="text"
          placeholder="Add todo..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        {isEdit ? (
          <div className="add-confirm">
            <CheckIcon
              onClick={handleEditConfirm}
              className="add-confirm-icon"
            />
          </div>
        ) : (
          <div className="add-confirm">
            <AddIcon onClick={writeToDatabase} className="add-confirm-icon" />
          </div>
        )}
      </div>
      <div className="homepage">
        {todos.map((todo) => (
          <div key={todo.uidd} className="todo">
            <p
              className="text-container"
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.todo}
            </p>
            <div className="icon-right">
              <EditIcon
                fontSize="large"
                onClick={() => handleUpdate(todo)}
                className="add-confirm-icon"
              />
              <DeleteIcon
                fontSize="large"
                onClick={() => handleDelete(todo.uidd)}
                className="add-confirm-icon"
              />
              <AddTaskIcon
                fontSize="large"
                onClick={() => handleCompleted(todo)}
                className="add-confirm-icon"
              />
            </div>
          </div>
        ))}
      </div>
      <LogoutIcon onClick={handleSignOut} className="logout-icon" />
    </div>
  );
}
