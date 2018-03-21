
type name = string;
type t;

let create : (name) => t;
let setName : (name,t) => t;
let addGame : (Game.t,t) => t;
let removeGame : (Game.t,t) => t;
let hasName : (name,t) => bool;
let toJson : t => Js.Json.t;
