
type hash = string;
type salt = string;

type cred = {
  salt:salt,
  hash:hash
};
type name = string;
type t;

let create : (name,cred) => t;
let setName : (name,t) => t;
let getName : (t) => name;
let addGame : (Game.t,t) => t;
let removeGame : (Game.t,t) => t;
let hasName : (name,t) => bool;
let toJson : t => Js.Json.t;
let checkCred : (hash,t) => bool;
let getCred : (t) => cred;