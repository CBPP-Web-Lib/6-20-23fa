function aggregate_dot_model(model) {
    /*originally we had bars for 1, 3, 6, 9, 12 months but
    decided to go in a simpler direction*/
    var months = [12];
    var r = {nowork:[]};
    months.forEach((month)=>{
      r[month] = [];
    })
    model.sort((a, b)=>{
      return a.months_since_work - b.months_since_work
    })
    model.forEach((person)=> {
      if (person.months_since_work === -1) {
        r.nowork.push(person);
      } else {
        var person_month = "nowork"
        months.forEach((month)=>{
          if (person.months_since_work <= month) {
            person_month = month
          }
        })
        r[person_month].push(person)
      }
    })
    var x_loc = {
        nowork: 0.15,
        12: 0.7
    };
    var y = 0.82;
    Object.keys(r).forEach((group)=>{
        var x_off = -0.13, y_off = 0;
        r[group].forEach((person)=>{
            person.x_targ = x_loc[group] + x_off;
            person.y_targ = y + y_off;
            if (x_off < 0.132) {
                x_off += 0.03
            } else {
                x_off = -0.13;
                y_off -= 0.03;
            }
        })
    })
    return { aggregate_data: r, x_loc };
}


export { aggregate_dot_model }