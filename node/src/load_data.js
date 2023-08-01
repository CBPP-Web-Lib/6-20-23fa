
import data_raw from "./data.json";

const data = parse_data(data_raw);

function parse_data(d) {
  var r = [];
  d.forEach((person)=>{
    var l = lpad(person.toString(2).split(""), 12);
    l.forEach((b, i) => {
      l[i]*=1;
    });
    r.push(l);
  })
  return r;
}

function lpad(arr, n) {
  while (arr.length < n) {
    arr.unshift(0)
  }
  return arr;
}

export { data }