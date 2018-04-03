
type name = string;
type t;

let create : (name) => t;
let compare : (t,t) => bool;
let toJson : t => Js.Json.t;