
type t = {
  users:list(User.t)
};

let create = () => {users:[]};

let addUser = (user,state) => {
  ...state,
  users:[user, ...state.users]
};

let removeUsersByName = (user_name,state) => {
  ...state,
  users:List.filter(u => !User.hasName(user_name,u), state.users)
};

let addGameToUsers = (user_name,game,state) => {
  let fmap = u => switch (User.hasName(user_name,u)) {
    | true => User.addGame(game,u)
    | false => u
  };
  {
    ...state,
    users:List.map(fmap, state.users)
  }
};

let toJson = (s) => {
  let d = Js.Dict.empty();
  let array = List.map(User.toJson, s.users)
              |> Listpp.toArray;
  Js.Dict.set(d, "users", Js.Json.array(array));
  Js.Json.object_(d);
};
