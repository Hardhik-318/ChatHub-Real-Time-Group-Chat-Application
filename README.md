# ChatHub — Real-Time Multi-Room Chat Application

ChatHub is a real-time chat application that lets users join named rooms, chat live with others, see who's online, and pick up right where they left off thanks to persistent message history.

---

## 🔴 Live Demo

https://chathub-r6gp.onrender.com

---

## Features

- Real-time messaging using WebSockets (Socket.io)
- Multiple chat rooms — users choose or create a room by name
- Live online user list per room
- Persistent chat history — messages are stored in MongoDB and reload automatically when a room is rejoined
- Clean join/exit flow — users can leave a room and switch to another without reloading the page
- Responsive, modern UI with a dedicated join screen and full-page chat layout

---

## Tech Stack

- **Backend:** Node.js, Express
- **Real-time layer:** Socket.io
- **Database:** MongoDB (via Mongoose), hosted on MongoDB Atlas
- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Deployment:** Render

---

## How It Works

1. A user enters their name and a room name on the join screen.
2. The client connects via Socket.io and joins a Socket.io "room" matching the room name.
3. Messages are broadcast only to clients in the same room (`io.to(room).emit(...)`), keeping rooms isolated.
4. Every message is saved to MongoDB; when a user joins a room, the last 50 messages are fetched and loaded automatically.
5. Typing status and online-user lists update live via dedicated Socket.io events.
6. Exiting a room disconnects and resets the client, returning the user to the join screen to pick a new room.

---

## Project Structure

```text
chat-app/
│
├── server.js              # Express + Socket.io backend, MongoDB models and events
├── package.json           # Dependencies
├── .env                   # MongoDB connection string (not committed)
├── .gitignore
│
└── public/
    └── index.html         # Frontend (join screen + chat UI)
```

---

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/Hardhik-318/chathub.git
cd chathub
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file in the root directory

```env
MONGO_URI=your_mongodb_connection_string_here
```

### Run the app

```bash
node server.js
```

### Open your browser at

```
http://localhost:3000
```

---

## Limitations

- No authentication — usernames are self-declared and not verified
- No message editing/deletion once sent
- Typing indicator only shows one user at a time (last person typing)

---

## Future Enhancements

- User authentication and persistent identity across sessions
- Private (1-on-1) messaging alongside room chat
- File/image sharing in chat
- Read receipts and message timestamps in the UI
- Mobile-optimized layout

---

## Developed By

**Hardhik**

**Email:**  
https://mail.google.com/mail/?view=cm&fs=1&to=hardhik318@gmail.com

**GitHub:**  
https://github.com/Hardhik-318

**LinkedIn:**  
https://linkedin.com/in/hardhik-balla
