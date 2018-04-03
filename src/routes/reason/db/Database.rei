
let addUser : (User.t) => unit;
let removeUsersByName : (User.name) => unit;


let getUserByName : (User.name) => option(User.t);
let toJson : unit => Js.Json.t;