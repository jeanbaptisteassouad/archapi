
type name = string;

type t = {
  name:name,
  game_list:list(Game.t)
};


let create = (name) => {
  name,
  game_list:[]
};

let setName = (name,user) => {...user, name:name};

let addGame = (game,user) => {...user, game_list:[game, ...user.game_list]};

let removeGame = (game,user) => {
  ...user,
  game_list:List.filter(g => !Game.compare(g,game),user.game_list)
};

let hasName = (name,user) => name === user.name;

let toJson = (u) => {
  let d = Js.Dict.empty();
  Js.Dict.set(d, "name", Js.Json.string(u.name));
  let array = List.map(Game.toJson, u.game_list)
              |> Listpp.toArray;
  Js.Dict.set(d, "game", Js.Json.array(array));
  Js.Json.object_(d);
};

