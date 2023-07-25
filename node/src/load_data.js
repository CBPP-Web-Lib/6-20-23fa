
import data_string from "raw-loader!./data.txt";

const data = parse_data_string(data_string);

function parse_data_string(str) {
  str = str.split("\n");
  const r = [];
  str.forEach((line)=>{
    var l = line.split("");
    l.forEach((char, j)=>{
      l[j]*=1;
    })
    r.push(l);
  })
  return r;
}

export { data }