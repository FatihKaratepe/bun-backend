import express from "express";
import { UserRoutes } from "@routes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/users", UserRoutes);

app.get("/", (req, res) => {
    res.send("Hello Bun + Express!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
