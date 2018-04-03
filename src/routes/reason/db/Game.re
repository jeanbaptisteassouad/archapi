
type name = string;

type t = {
  name:name
};

let create = (name) => {name:name};

let compare = (g1,g2) => g1.name === g2.name;

let toJson = (g) => {
  let d = Js.Dict.empty();
  Js.Dict.set(d, "name", Js.Json.string(g.name));
  Js.Json.object_(d);
};
