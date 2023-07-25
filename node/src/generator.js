const fs = require("fs");

/*in here we're going to try and generate artifical microdata that matches
this chart, assuming for each individual that likelihood of working
and likelihood of moving in and out of work are normally distributed probabilities and
just brute force it until we get a distribution that matches*/
https://www.cbpp.org/74-percent-of-adults-potentially-subject-to-the-time-limit-work-in-year-before-or-after-receiving-1*/

var targets = {
    1: 0.51,
    3: 0.59,
    6: 0.63,
    9: 0.68,
    12: 0.74
}

const n = 100

const p_work = 0.51
const p_work_var = 0.2
const p_switch = 0.15
const p_switch_var = 0.05

/*https://stackoverflow.com/questions/12556685/is-there-a-javascript-implementation-of-the-inverse-error-function-akin-to-matl*/
function erfinv(x) {
    // maximum relative error = .00013
    const a  = 0.147  
    //if (0 == x) { return 0 }
    const b = 2/(Math.PI * a) + Math.log(1-x**2)/2
    const sqrt1 = Math.sqrt( b**2 - Math.log(1-x**2)/a )
    const sqrt2 = Math.sqrt( sqrt1 - b )
    return sqrt2 * Math.sign(x)
}

const root2 = Math.sqrt(2);

/*https://en.wikipedia.org/wiki/Probit*/
function probit(p) {
    return root2*erfinv(2*p - 1)
}

const probit_table = {}
const m = 1000000;
for (var x = 0; x <= m; x++) {
    probit_table[x] = probit(x/m)
}


var cap = (x)=>Math.max(Math.min(x,1), 0)


function try_run() {

    var people = [];
    var aggregate = {};
    for (var x = 0; x < n; x++) {
        var r1 = Math.round(Math.random()*m)
        var r2 = Math.round(Math.random()*m)
        var person = {
            p_work: cap(p_work + probit_table[r1]*p_work_var),
            p_switch: cap(p_switch + probit_table[r2] * p_switch_var)
        };

        person.work_in_month = []
        person.work_in_month.push(
            Math.random() < person.p_work ? 1 : 0
        )
        for (var month = 1; month < 12; month++) {
            var switches = Math.random() < person.p_switch
            if (switches) {
                person.work_in_month.push(
                    Math.random() < person.p_work ? 1 : 0
                )
            } else {
                person.work_in_month.push(person.work_in_month[person.work_in_month.length - 1])
            }
        }
        person.tests = test(person)
        people.push(person)
        Object.keys(person.tests).forEach((test)=> {
            if (typeof(aggregate[test])==="undefined") {
                aggregate[test] = 0;
            }
            aggregate[test] += person.tests[test]/n
        })
    }

    Object.keys(aggregate).forEach((test)=>{
        aggregate[test] = Math.round(aggregate[test]*n)/n
    })

    
    return {aggregate, people}

}

function test(person) {
    var r = {};
    var tests = [1, 3, 6, 9, 12]
    tests.forEach((test)=>{
        var success = false;
        for (var j = 1; j <= test; j++) {
            success = success || person.work_in_month[person.work_in_month.length - j]
        }
        r[test] = success;
    })
    return r;
}

for (var t = 0; t < 10000000; t++) {
    var r = try_run();
    if (is_good(r.aggregate)) {
        console.log(r.aggregate)
        write_data(r.people);
        break;
        //console.log(r.people);
    }
}

function is_good(agg) {
    var good = true;
    var errors = {};
    Object.keys(targets).forEach((test)=>{
        if (Math.abs(agg[test] - targets[test]) > 0.005) {
            good = false;
        }
        errors[test] = agg[test] - targets[test]
    })
    return good;
}

function write_data(people) {
    var r = [];
    people.forEach((person) => {
        r.push(person.work_in_month.join(""));
    })
    var text = r.join("\n");
    fs.writeFileSync("./data.txt", text);
}