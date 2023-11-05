import express, { Application, Request, Response } from "express";
import { DefaultResponse } from "./models/dto/default";
import listUsers from "./data/listUser.json";
import { User } from "./models/entity/user";
import { USerRequest } from "./models/dto/user";
import fs from 'fs';

const app = express();
app.use(express.json());
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

// method untuk tambah data
app.post("/api/users", (req: Request, res: Response ) => {
  const payload: USerRequest = req.body;

  if (!payload.name) {
    const resGagal: DefaultResponse = {
      status: "EROR",
      message: "erro 404 not found",
      data: {
        users_create: null,
      },
    };
    res.status(400).send(resGagal);
  } else {
    const userToCreate: User = {
      id: listUsers[listUsers.length - 1].id + 1,
      name: payload.name,
    };

    const response: DefaultResponse = {
      status: "OK",
      message: "Sukses Untuk menambahkan data user",
      data: {
        users: userToCreate,
      },
    };

    const users: User[] = listUsers;
    users.push(userToCreate);

    fs.writeFileSync("./data/listUser.json", JSON.stringify(users));

    res.status(201).send(response);
  }

});

app.put("/api/users/:id", (req: Request, res: Response) => {
  let id = parseInt(req.params.id);
  let payload: User = req.body;

  if (!payload.name) {
    const resGagal: DefaultResponse = {
      status: "EROR",
      message: "erro 400 Bad Request - Nama harus disertakan",
      data: {
        users_update: null,
      },
    };
    res.status(400).send(resGagal);
  } else {
    const userToUpdate = listUsers.find((user) => user.id === id);

    if (userToUpdate) {
      userToUpdate.name = payload.name;

      const response: DefaultResponse = {
        status: "OK",
        message: "Sukses Untuk memperbarui data user",
        data: {
          users: userToUpdate,
        },
      };

      fs.writeFileSync("./data/listUser.json", JSON.stringify(listUsers));

      res.status(200).send(response);
    } else {
      const resGagal = {
        status: "ERROR",
        message: "404 Not Found - User tidak ditemukan",
        data: {
          users_update: null,
        },
      };
      res.status(404).send(resGagal);
    }
  }

});

app.delete("/api/users/:id", (req: Request, res: Response) => {
  const userIdToDelete = parseInt(req.params.id);
  const userToDelete = listUsers.find((user) => user.id === userIdToDelete);

  const response: DefaultResponse = {
    status: "OK",
    message: "Berhasil Menghapus user",
    data: {
      users: userToDelete,
    },
  };

  const resGagal: DefaultResponse = {
    status: "EROR",
    message: "erro 404 not found",
    data: {
      users: null,
    },
  };

  if (userToDelete) {
    res.send(response);
    fs.writeFileSync("./data/listUser.json", JSON.stringify(userToDelete));
  } else {
    res.status(404).send(resGagal);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
