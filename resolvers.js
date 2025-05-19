import userModel from "./models/users.js";
import todoModel from "./models/todos.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

export const resolvers = {
  Query: {
    async users() {
      try {
        let users = await userModel.find();
        return users;
      } catch (err) {
        throw new Error("Can't find users");
      }
    },
    async user(_, { id }) {
      try {
        let user = await userModel.findOne({ _id: id });
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (err) {
        throw new Error("Can't find user");
      }
    },
    async todos() {
      try {
        let todos = await todoModel.find();
        return todos;
      } catch (err) {
        throw new Error("Can't find todos");
      }
    },
    async todo(_, { id }) {
      try {
        let todo = await todoModel.findOne({ _id: id });
        if (!todo) {
          throw new Error("todo not found");
        }
        return todo;
      } catch (err) {
        throw new Error("Can't find todo");
      }
    },
  },
  Mutation: {
    async deleteUser(_, { id }, context) {
      if (context && context.role == "admin") {
        try {
          let deletedUser = await userModel.findByIdAndDelete({ _id: id });
          if (!deletedUser) {
            throw new Error("User not found");
          }
          return "User deleted successfully";
        } catch (err) {
          throw new Error("Can't find user");
        }
      } else {
        throw new Error("You are not authorized");
      }
    },
    async addUser(_, { user }) {
      try {
        let newUser = await userModel.create(user);
        return newUser;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async updateUser(_, { id, user }, context) {
      if (context && context.role == "admin") {
        try {
          let updatedUser = await userModel.findOneAndUpdate(
            { _id: id },
            user,
            { new: true }
          );
          if (!updatedUser) {
            throw new Error("User not found");
          }

          return "User updated successfully";
        } catch (err) {
          throw new Error("Can't update user");
        }
      } else {
        throw new Error("You are not authorized");
      }
    },
    async login(_, { user }) {
      let { email, password } = user;
      if (!email || !password) {
        throw new Error("You must provide email & password");
      }
      let account = await userModel.findOne({ email: email });
      if (!account) {
        throw new Error("Email not found");
      }

      let isValid = await bcrypt.compare(password, account.password);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      let token = jwt.sign(
        { id: account._id, role: account.role },
        process.env.SECRET
      );
      return { message: "User Logged in successfully", token };
    },
    async addTodo(_, { todo }, context) {
      if (context.role) {
        try {
          let newTodo = await todoModel.create({ ...todo, userId });
          return newTodo;
        } catch (err) {
          throw new Error("Can't save todo");
        }
      } else {
        throw new Error("You are not authorized");
      }
    },
    async deleteTodo(_, { id }, context) {
      if (context && context.role == "admin") {
        try {
          let deletedTodo = await todoModel.findByIdAndDelete({ _id: id });
          if (!deletedTodo) {
            throw new Error("Todo not found");
          }
          return "Todo deleted successfully";
        } catch (err) {
          throw new Error("Can't find todo");
        }
      } else {
        throw new Error("You are not authorized");
      }
    },
    async updateTodo(_, { id, todo }, context) {
      if (context.role) {
        try {
          let updatedTodo = await todoModel.findOneAndUpdate(
            { _id: id },
            todo,
            { new: true }
          );
          if (!updatedTodo) {
            throw new Error("Todo not found");
          }

          return "Todo updated successfully";
        } catch (err) {
          throw new Error("Can't update todo");
        }
      } else {
        throw new Error("You are not authorized");
      }
    },
  },
};