
open Js.Null_undefined;


let createUser : (t(string),t(string),t(string)) => Js.Promise.t(Js.Nullable.t(unit));

/*let checkUser : (t(string), t(string)) => Js.Promise.t(Js.boolean);*/

let doesUserExist : t(string) => Js.Promise.t(Js.boolean);

let getUserSaltAndHash : t(string) => Js.Promise.t({. "salt":User.salt, "hash":User.hash});

let printDb : unit => Js.Promise.t(string);
