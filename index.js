import express from 'express'
const app = express();
const PORT = 4040;

app.listen(PORT, () => {
    console.log(`Server is running ... ${PORT}`);
});