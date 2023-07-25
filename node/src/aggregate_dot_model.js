function aggregate_dot_model(model) {
    var months = [12, 9, 6, 3, 1];
    var r = {nowork:[]};
    months.forEach((month)=>{
      r[month] = [];
    })
    model.forEach((person)=> {
      if (person.months_since_work === -1) {
        r.nowork.push(person);
      } else {
        var person_month = 12;
        months.forEach((month)=>{
          if (person.months_since_work < month) {
            person_month = month
          }
        })
        r[person_month].push(person)
      }
    })
    var x_loc = {
        nowork: 0.1,
        12: 0.3,
        9: 0.45,
        6: 0.6,
        3: 0.75,
        1: 0.9
    };
    var y = 0.75;
    Object.keys(r).forEach((group)=>{
        var x_off = -0.05, y_off = 0;
        r[group].forEach((person)=>{
            person.x_targ = x_loc[group] + x_off;
            person.y_targ = y + y_off;
            if (x_off < 0.049) {
                x_off += 0.025
            } else {
                x_off = -0.05;
                y_off -= 0.025;
            }
        })
    })
    return { aggregate_data: r, x_loc };
}


export { aggregate_dot_model }