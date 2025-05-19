export const schema= `#graphql

enum ROLE{
admin
user
}

type User{
_id:ID
username:String
email:String
role:ROLE
}

enum STATUS{
To_do
In_progress
Done
}

type Todo{
_id:ID
title:String
status:STATUS
userId:ID
}


type Query{
users:[User]
user(id:ID):User
todos:[Todo]
todo(id:ID):Todo
}

type response{
message:String
token:String
}

type Mutation{
deleteUser(id:ID):String
addUser(user:UserInput):User
updateUser(id:ID,user:UserInput):String
login(user:LoginInput):response
addTodo(todo:TodoInput):Todo
deleteTodo(id:ID):String
updateTodo(id:ID,todo:TodoInput):String
}


input TodoInput{
title:String
status:STATUS
}

input LoginInput{
email:String
password:String
}

input UserInput{
username:String
email:String
password:String
role:String
}

`