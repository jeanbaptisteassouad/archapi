
module Game = {
  type game = {
    name:string
  };
  type t = T(game);
  
  let create = (name) => {name:name};
  let compare = (g1,g2) => g1.name == g2.name;
};

type caca = [Game.t];

module User = {
  type t = {
    name:string,
    game_list:[Game.t]
  };
  let create = (name) => {
    name,
    game_list:[]
  };
  let setName = (name,user) => {...user, name:name};
  let addGame = (name,game,user) => {...user, game_list:[game, ...user.game_list]};
  let removeGame = (game,user) => {
    ...user,
    game_list:List.filter(g=>!Game.compare(g,game),user.game_list)
  };
  let hasName = (name,user) => name == user.name;
};

module State = {
  type t = {
    users:[User.t]
  };
  let create = () => {users:[]};
  let addUser = (user,state) => {
    ...state,
    users:[user, ...state]
  };
  let removeUsersByName = (user_name,state) => {
    ...state,
    users:List.filter(u=>!User.hasName(user_name,u))
  };
  let addGameToUsers = (user_name,game,state) => {
    let fmap = u => switch (User.hasName(user_name,u)) {
      | true => User.addGame(game,u)
      | false => u
    };
    {
      ...state,
      users:List.map((fmap,state.users))
    }
  };
};


