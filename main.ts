import express, { Application, Request, Response } from "express";
import { DefaultResponse } from "./models/dto/default";
import listUsers from "./data/listUser.json";
import { User } from "./models/entity/user";
import * as fs from 'fs';

const app = express();
const PORT: number = 8080;

// untuk menampilkan data user keseluruhan
app.get("/api/users", (req: Request, res: Response) => {
  const nameQuery: string = req.query.name as string;

  const response: DefaultResponse = {
    status: "OK",
    message: "data berhasi ditampilkan",
    data: {
      users:
      listUsers.map((user:User) => ({
        id: user.id,
        name: user.name || ""
      })).filter((user:User) =>
        user.name?.toLowerCase().includes(nameQuery.toLowerCase())
      ),
    },
  };

  res.status(200).send(response);
});

// untuk menampilkan data user menggunakan format id
app.get("/api/users/:id", (req: Request, res: Response) => {
  const user = listUsers.find((user) => user.id === parseInt(req.params.id));

  const response = {
    status: "OK",
    message: "Sukses Untuk menampilkan data user",
    data: {
      users: user,
    },
  };

  const resGagal = {
    status: "EROR",
    message: "erro 404 not found",
    data: {
      users: null,
    },
  };

  if (user) {
    res.send(response);
  } else {
    res.status(404).send(resGagal);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
