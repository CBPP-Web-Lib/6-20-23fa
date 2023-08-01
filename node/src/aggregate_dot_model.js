function aggregate_dot_model(model) {
    var r = {nowork:[], work: []};
    model.forEach((person)=> {
      if (person.months_since_work === -1) {
        r.nowork.push(person);
      } else {
        r.work.push(person);
      }
    })
    var x_loc = {
        nowork: 0.77,
        work: 0.22
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