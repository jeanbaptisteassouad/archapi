/*
type password = string;
type salt = string;
type iterations = int;
type keylen = int;
type digest = Sha512();

let digestToStr = (d) => switch (d) {
  | Sha512 => "sha512"
};

type callback = (. );

[@bs.module "crypto"] external pbkdf2 :
  (password, salt, iterations, keylen, digest, callback) => unit = "pbkdf2";


crypto.pbkdf2(pw, salt, 100000, 512, 'sha512', (err, derivedKey)


type t = {
  salt:string,
  hashed_password:string
};

let create = (password) => {salt:"salt",hashed_password:"dummy"};
let check = (password, cred) => true;*/