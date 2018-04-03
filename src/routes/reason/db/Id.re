
type userId = UserId(string);
type ffId = FfId(string);

let userIdToJson = (UserId(a)) => Js.Json.string(a);
let ffIdToJson = (FfId(a)) => Js.Json.string(a);