
open Js.Null_undefined;

exception NullableInput;

let c0 =
  (f) =>
    () =>
      Js.Promise.make((~resolve, ~reject) =>
        resolve(. f())
      );

let c1 =
  (f) =>
    (a) =>
      Js.Promise.make((~resolve, ~reject) =>
        switch (toOption(a)) {
          | Some(a') => resolve(. f(a'))
          | _ => reject(. NullableInput)
        }
      );

let c2 =
  (f) =>
    (a, b) =>
      Js.Promise.make((~resolve, ~reject) =>
        switch ((toOption(a),toOption(b))) {
          | (Some(a'), Some(b')) => resolve(. f(a',b'))
          | _ => reject(. NullableInput)
        }
      );

let c3 =
  (f) =>
    (a, b, c) =>
      Js.Promise.make((~resolve, ~reject) =>
        switch ((toOption(a),toOption(b),toOption(c))) {
          | (Some(a'), Some(b'), Some(c')) => resolve(. f(a',b',c'))
          | _ => reject(. NullableInput)
        }
      );