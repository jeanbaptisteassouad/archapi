/*
open Express;


external myCFunction : int => string = "theCFunction";


let getDictString = (dict, key) =>
  switch (Js.Dict.get(dict, key)) {
  | Some(json) => Js.Json.decodeString(json)
  | _ => None
  };


/*module Entry = {
  type t = (int, string);
  let compare = (a,b) => compare(a,b);
};
*/
module EntryMap = Map.Make(String);
let state = ref(EntryMap.empty);

let stateToStr = () =>
  EntryMap.fold((key,val_,acc) => {
    acc ++ key ++ " : " ++ val_ ++ "<br>"
  }, state^, "");


module Cpt = {
  let cpt = ref(0);

  let ask = () => {
    cpt := cpt^ + 1;
    string_of_int(cpt^);
  }
};

let app = express();

let printDb = () => Database.getState()
                 |> State.toJson
                 |> Js.Json.stringify;

App.get(app, ~path="/:user_name") @@
Middleware.from(
  (next, req, resp) =>
    switch(getDictString(Request.params(req),"user_name")) {
      | Some(user_name) =>
          Database.dispatch(Database.AddUser(
            User.create(user_name,{salt:"",hash:""})));
          Response.sendString(printDb(),resp)
      | None => Response.sendStatus(Response.StatusCode.Unauthorized,resp)
    }
);


App.get(app, ~path="/fefef/:test") @@
Middleware.from(
  (next, req, resp) => {
    switch(getDictString(Request.params(req),"test")) {
      | Some(test) =>
        state := EntryMap.add(Cpt.ask(), test, state^);
        Response.sendString(stateToStr(),resp)
      | None => Response.sendStatus(Response.StatusCode.Unauthorized,resp)
    };
  }
);


let onListen = (port, e) =>
  switch e {
  | exception (Js.Exn.Error(e)) =>
    Js.log(e);
    Node.Process.exit(1)
  | _ => Js.log @@ "Listening at http://127.0.0.1:" ++ string_of_int(port)
  };

App.listen(app, ~onListen=onListen(3000), ());
*/

exception UserDoesNotExist;

let createUser = Customs.c3 @@ (user_name, salt, hash) => {
  Database.dispatch(Database.AddUser(
    User.create(user_name, {salt,hash})));
  Js.Nullable.null;
};

/*let checkUser = Customs.c2 @@ (user_name, hash) => {
  let state = Database.getState();
  switch (State.getUserByName(user_name, state)) {
    | Some(u) => Js.Boolean.to_js_boolean(User.checkCred(hash, u))
    | None => Js.false_
  };
};
*/

let doesUserExist = Customs.c1 @@ user_name => {
  let state = Database.getState();
  switch (State.getUserByName(user_name, state)) {
    | Some(_) => Js.true_
    | None => Js.false_
  };
};

let getUserSaltAndHash = Customs.c1 @@ user_name => {
  let state = Database.getState();
  switch (State.getUserByName(user_name, state)) {
    | Some(u) => {
      let {salt,hash} : User.cred = User.getCred(u);
      {"salt":salt, "hash":hash};
    }
    | None => raise(UserDoesNotExist)
  };
};

let printDb = Customs.c0 @@ () => {
  Js.Json.stringify @@ State.toJson @@ Database.getState();
};
