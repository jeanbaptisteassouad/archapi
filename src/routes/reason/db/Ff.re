
open Id;

type t = {
  name: string,
  path: string,
  size: int,
  parent: ffId,
  children: list(ffId)
};

