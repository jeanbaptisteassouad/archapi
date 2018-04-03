
let state = ref(State.create());

let addUser =
  (user) => state:=State.addUser(user,state^);
let removeUsersByName =
  (user_name) => state:=State.removeUsersByName(user_name,state^);


let getUserByName = (user_name) => State.getUserByName(user_name, state^);
let toJson = () => State.toJson(state^)
