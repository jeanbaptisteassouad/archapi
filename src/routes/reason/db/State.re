

open Id;

type t = {
  users: list( (userId, User.t) ),
  ffs: list( (ffId, Ff.t) )
};

let create = () => {
  users:[],
  ffs:[]
};

let getUserByName = (user_name, s) => {
  switch (List.filter(((_,u)) => User.hasName(user_name,u), s.users)) {
    | [] => None
    | [(_,u), ..._] => Some(u)
  }
};

let addUser = (user,state) => 
  switch (getUserByName(User.getName(user), state)) {
    | Some(_) => state
    | None => {
        ...state,
        users:[(UserId("dummyid"),user), ...state.users],
      }
  };

let addFf = (user_name, ff, state) => {
  let ff_id = FfId("dummyid");
  let fmap = ((k,u)) => {
    if (User.hasName(user_name,u)) {
      (k,User.addFf(ff_id,u));
    } else {
      (k,u);
    }
  };
  {
    users:List.map(fmap, state.users),
    ffs:[(ff_id,ff), ...state.ffs]
  };
};
  
let removeUsersByName = (user_name,state) => {
  ...state,
  users:List.filter(((_,u)) => !User.hasName(user_name,u), state.users)
};


let toJson = (s) => {
  let d = Js.Dict.empty();
  let array = List.map( ((UserId(k),u)) => {
    let d = Js.Dict.empty(); 
    Js.Dict.set(d, "user_id", Js.Json.string(k));
    Js.Dict.set(d, "user", User.toJson(u));
    Js.Json.object_(d);
  }, s.users) |> Listpp.toArray;

  Js.Dict.set(d, "users", Js.Json.array(array));
  Js.Json.object_(d);
};


