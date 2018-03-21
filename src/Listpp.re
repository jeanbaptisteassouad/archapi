
let toArray = l => {
  let ans = [||];
  List.map((elem)=>Js.Array.push(elem,ans), l);
  ans;
};
