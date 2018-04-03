open Id;

type hash = string;
type salt = string;

type cred = {
  salt:salt,
  hash:hash
};
type name = string;
type t;

let create : (name,cred) => t;
let getName : (t) => name;
let hasName : (name,t) => bool;
let toJson : t => Js.Json.t;
let getCred : (t) => cred;
let addFf : (ffId,t) => t;