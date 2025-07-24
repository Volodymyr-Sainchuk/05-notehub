// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import useCreateNote from "./services/noteService";

// function App() {
//   const [count, setCount] = useState(0);
//   const { isLoading, isError } = useQuery({
//     queryKey: ["notes"],
//     queryFn: fetchNotes,
//   });

//   const { mutate: createNote, isPending } = useCreateNote();
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newNote = {
//       title: "Нова нотатка",
//       content: "Це тестова нотатка",
//     };

//     createNote(newNote);
//   };

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
//     </>
//   );
// }

// export default App;
