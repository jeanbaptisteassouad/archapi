
let toArray = l => {
  let ans = [||];
  List.map((elem)=>Js.Array.push(elem,ans), l) |> ignore;
  ans;
};

let fromArray = a => {
  let ans = ref([]);
  for (i in Js.Array.length(a) - 1 downto 0) {
    ans := [a[i]] @ ans^
  };
  ans^;
};
