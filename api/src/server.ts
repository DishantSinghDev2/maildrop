import express from 'express';
import { listHandler, messageHandler, deleteHandler } from './mailbox'; // Adjust the import based on your file structure

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // For parsing application/json

// Define your API routes
app.get('/mailbox/:name', listHandler);
app.get('/mailbox/:name/message/:id', messageHandler);
app.delete('/mailbox/:name/message/:id', deleteHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
