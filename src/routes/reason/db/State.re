
type t = {
  users: list(User.t),
};

let create = () => {users:[]};

let getUserByName = (user_name, s) => {
  switch (List.filter(u => User.hasName(user_name,u), s.users)) {
    | [] => None
    | [u, ..._] => Some(u)
  }
};


let addUser = (user,state) => 
  switch (getUserByName(User.getName(user), state)) {
    | Some(_) => state
    | None => {
        users:[user, ...state.users]
      }
  };

let removeUsersByName = (user_name,state) => {
  users:List.filter(u => !User.hasName(user_name,u), state.users)
};

let addGameToUsers = (user_name,game,state) => {
  let fmap = u => switch (User.hasName(user_name,u)) {
    | true => User.addGame(game,u)
    | false => u
  };
  {
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


