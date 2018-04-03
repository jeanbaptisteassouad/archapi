open Id;

type hash = string;
type salt = string;

type name = string;

type cred = {
  salt:salt,
  hash:hash
};

type t = {
  name:name,
  cred:cred,
  ffs:list(ffId)
};





let create = (name,cred) => {
  name,
  cred,
  ffs:[]
};

let getName = (user) => user.name;
let hasName = (name,user) => name === user.name;
let getCred = (user) => user.cred;

let addFf = (ffId,user) => {
  ...user,
  ffs:[ffId, ...user.ffs]
};



let credToJson = cred => {
  let d = Js.Dict.empty();
  Js.Dict.set(d, "salt", Js.Json.string(cred.salt));
  Js.Dict.set(d, "hash", Js.Json.string(cred.hash));
  Js.Json.object_(d);
};

let ffsToJson = ffs =>
  List.map(ffIdToJson, ffs) |> Listpp.toArray |> Js.Json.array;

let toJson = (u) => {
  let d = Js.Dict.empty();
  Js.Dict.set(d, "name", Js.Json.string(u.name));
  Js.Dict.set(d, "ffs", ffsToJson(u.ffs));
  Js.Dict.set(d, "cred", credToJson(u.cred));
  Js.Json.object_(d);
};


