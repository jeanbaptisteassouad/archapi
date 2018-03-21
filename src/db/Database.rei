
type action = AddUser(User.t)
            | RemoveUsersByName(User.name)
            | AddGameToUsers(User.name, Game.t);


let dispatch : action => unit;
let getState : unit => State.t;
