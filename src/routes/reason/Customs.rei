
open Js.Null_undefined;


let c0 : (unit => 'z) => unit => Js.Promise.t('z);
let c1 : ('a => 'z) => t('a) => Js.Promise.t('z);
let c2 : (('a, 'b) => 'z) => (t('a), t('b)) => Js.Promise.t('z);
let c3 : (('a, 'b, 'c) => 'z) => (t('a), t('b), t('c)) => Js.Promise.t('z);
