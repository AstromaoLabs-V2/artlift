// "use client";

// import { useEffect, useState } from "react";
// import {
//   getUsers,
//   createUser,
//   deleteUser,
// } from "@/lib/users";

// export default function UsersPage() {
//   const [users, setUsers] = useState([]);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   async function loadUsers() {
//     const data = await getUsers();
//     setUsers(data);
//   }

//   async function handleCreate(e) {
//     e.preventDefault();
//     await createUser({
//       username,
//       email,
//       password: "test12345",
//     });
//     setUsername("");
//     setEmail("");
//     loadUsers();
//   }

//   async function handleDelete(id) {
//     await deleteUser(id);
//     setUsers(users.filter((u) => u.id !== id));
//   }

//   return (
//     <main style={{ padding: 20 }}>
//       <h1>Users</h1>

//       <form onSubmit={handleCreate}>
//         <input
//           placeholder="username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           placeholder="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit">Create User</button>
//       </form>

//       <ul>
//         {users.map((user) => (
//           <li key={user.id}>
//             {user.username} ({user.email})
//             <button onClick={() => handleDelete(user.id)}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }
