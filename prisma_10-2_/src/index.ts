import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// above code is same as --
// import mongoose from "mongoose"
// mongoose.connect()

// Doing database queries --------------------------------------
// INSERT >>>>>>>>>>>>>>>>>
async function insertUser(
  username: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const res = await prisma.user.create({
    data: {
      username,
      firstName,
      lastName,
      password,
    },
    select: {
      id: true,
      username: true,
    },
  });
  console.log("USER", res);
}
// calling ------
// insertUser("test2@gmail.com", "123456", "Ajay-2", "Dew-2");

//
// UPDATE >>>>>>>>>>>>>>>>>>>>>>
// interface for arguments
interface UpdateParams {
  firstName: string;
  lastName: string;
}
// update function
async function updateUser(
  username: string,
  { firstName, lastName }: UpdateParams
) {
  const res = await prisma.user.update({
    where: { username },
    data: { firstName, lastName },
  });
  console.log("UPDATE:", res);
}
// calling update
// updateUser("test1@gmail.com", { firstName: "AJ", lastName: "Dew" });

//
// Get user details
async function getUser(username: string) {
  const res = await prisma.user.findFirst({
    where: { username },
    select: { id: true, firstName: true, lastName: true, username: true },
  });
  console.log("GET_USER", res);
}
// getting user
// getUser("test1@gmail.com");

//
// TODO FUNCTIONS ------------------------------------------------------------
async function createTodo(userId: number, title: string, description: string) {
  const res = await prisma.todo.create({
    data: {
      userId,
      title,
      description,
    },
  });
  console.log("TODO:", res);
}
// calling create todo -
// createTodo(1, "go to market", "Buy banana and egg - 1 dozen both");

//
// GET TODO -
async function getTodos(userId: number) {
  const res = await prisma.todo.findMany({
    where: {
      userId,
    },
  });
  console.log(res);
}
// get Todos
// getTodos(1);

//
// Getting user details and all todos of the user - using JOIN
async function getTodosAndUserDetails(userId: number) {
  // with 2 quries >>>>>
  // const user = await prisma.user.findUnique({
  //     where: {
  //         id: userId
  //     }
  // });
  // const todos = await prisma.todo.findMany({
  //     where: {
  //         userId: userId,
  //     }
  // });
  //
  // Using JOIN (Given code)>>>>>>>>>>>>>
  //   const todos = await prisma.todo.findMany({
  //     where: {
  //       userId: userId,
  //     },
  //     select: {
  //       User: true,
  //       title: true,
  //       description: true,
  //     },
  //   });
  //   console.log(todos);

  //
  // Using JOIN - but having user details one time ----
  const usersWithPosts = await prisma.user.findMany({
    where: {
      id: userId,
    },
    include: {
      todos: true,
    },
  });
  console.log("USER with TODOS>", usersWithPosts, usersWithPosts[0].todos);
}

// getTodosAndUserDetails(1);
