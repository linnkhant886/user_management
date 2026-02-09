import express from "express";
import cors from "cors";
import roleRoutes from "./routes/role-route.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/roles", roleRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "RBAC Backend Running..." });
});

export default app;
