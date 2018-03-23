
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
  game_list:list(Game.t)
};


let create = (name,cred) => {
  name,
  cred,
  game_list:[]
};

let setName = (name,user) => {...user, name:name};
let getName = (user) => user.name;

let addGame = (game,user) => {...user, game_list:[game, ...user.game_list]};

let removeGame = (game,user) => {
  ...user,
  game_list:List.filter(g => !Game.compare(g,game),user.game_list)
};

let hasName = (name,user) => name === user.name;

let credToJson = cred => {
  let d = Js.Dict.empty();
  Js.Dict.set(d, "salt", Js.Json.string(cred.salt));
  Js.Dict.set(d, "hash", Js.Json.string(cred.hash));
  Js.Json.object_(d);
};

let toJson = (u) => {
  let d = Js.Dict.empty();
  Js.Dict.set(d, "name", Js.Json.string(u.name));
  let array = List.map(Game.toJson, u.game_list)
              |> Listpp.toArray;
  Js.Dict.set(d, "game", Js.Json.array(array));
  Js.Dict.set(d, "cred", credToJson(u.cred));
  Js.Json.object_(d);
};

let checkCred = (hash, u) => u.cred.hash == hash;

