import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../App.css";

interface User {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersProps {
  onUserSelect: (user: { userId: string; userName: string }) => void;
}

const Users: React.FC<UsersProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    const selectedUser = users.find((user) => user.id.toString() === userId);
    if (selectedUser) {
      setSelectedUserId(userId);
      onUserSelect({ userId, userName: selectedUser.name });
    }
  };

  return (
    <div
      style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}
    >
      <h4 style={{ marginRight: "10px" }}>Usuário</h4>
      <select
        onChange={handleUserChange}
        value={selectedUserId}
        style={{ width: "30%" }}
      >
        <option value="">Selecione o Usuario</option>
        {users.map((user) => (
          <option key={user.id} value={user.id.toString()}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Users;
