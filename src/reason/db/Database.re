
let state = ref(State.create());

type action = AddUser(User.t)
            | RemoveUsersByName(User.name)
            | AddGameToUsers(User.name, Game.t);

let reducer = (action,state:State.t) => switch (action) {
  | AddUser(user) =>
    State.addUser(
      user,
      state)
  | RemoveUsersByName(user_name) =>
    State.removeUsersByName(
      user_name,
      state)
  | AddGameToUsers(user_name,game) => State.addGameToUsers(user_name,game,state)
};

let dispatch = (action) => {
  state:=reducer(action,state^);
  ();
};

let getState = () => state^;