
type t;
let create : unit => t;
let addUser : (User.t,t) => t;
let removeUsersByName : (User.name,t) => t;
let toJson : t => Js.Json.t;
let getUserByName : (User.name,t) => option(User.t);
