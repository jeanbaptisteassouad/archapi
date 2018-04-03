
exception UserDoesNotExist;

let createUser = Customs.c3 @@ (user_name, salt, hash) => {
  Database.addUser(User.create(user_name, {salt,hash}));
  Js.Nullable.null;
};

let doesUserExist = Customs.c1 @@ user_name => {
  switch (Database.getUserByName(user_name)) {
    | Some(_) => Js.true_
    | None => Js.false_
  };
};

let getUserSaltAndHash = Customs.c1 @@ user_name => {
  switch (Database.getUserByName(user_name)) {
    | Some(u) => {
      let {salt,hash} : User.cred = User.getCred(u);
      {"salt":salt, "hash":hash};
    }
    | None => raise(UserDoesNotExist)
  };
};

let printDb = Customs.c0 @@ () => {
  Database.toJson() |> Js.Json.stringify;
};



/*type path = string

let path2list = str => Js.String.split("/",str) |> fromArray;

let aaa = (path, size) => {
  let l = path2list(path);
  
};*/