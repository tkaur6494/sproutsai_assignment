let aggregation = ["SUM", "COUNT", "AVG"]
let allowed_conditions = ["=", "<=", ">=", "<>", ">", "<"]

function verify_input(input, columns, connection) {
    let columns_table = []
    let query = ""
    let group_by_clause = ''
    for (let cols of columns) {
        columns_table.push(cols["COLUMN_NAME"])
    }
    if (!input.dimensions.every(ai => columns_table.includes(ai))) {
        return false
    } else {
        query = `SELECT \`${input.dimensions.join("\`, \`")}\``
        group_by_clause = ` group by \`${input.dimensions.join("\`, \`")}\``
    }

    input.measures.forEach(element => {
        if (aggregation.indexOf(element.aggregation) == -1 || columns_table.indexOf(element.column) == -1) {
            return false;
        } else {
            query += `, ${element.aggregation}(\`${element.column}\`) `
        }
    });
    query += "from `data` "
    let filter = ""
    input.filters.forEach(element => {
        if (columns_table.indexOf(element.column) == -1 || allowed_conditions.indexOf(element.condition) == -1) {
            return false;
        } else {
            filter += `${element.column}${element.condition}${connection.escape(element.value)}`
        }
    });
    if (filter.length) {
        query += ` where ${filter}`
    }
    query += `${group_by_clause}`
    return query
}

function determine_chart_type(data) {

    if (data.series.length == 1 && data.xAxis.categories.length <= 5) {
        data.chart.type = "pie"
    } else {
        data.chart.type = "bar"
    }
    return data
}
function process_data(result) {
    // {"type":"","series":[{"name": "","data": []}],"categories":[]}
    let response = { "series": [], "xAxis": { "categories": [], "title": { "text": "" }, }, "chart": { "type": "bar" } }
    let temp = {}
    result.forEach(element => {
        for (e in element) {
            if (!temp[e]) {
                temp[e] = []
            }
            temp[e].push(element[e])
        }
    });
    for (e in temp) {
        let is_aggregate = false
        for (item of aggregation) {
            if (e.startsWith(`${item}(`)) {
                response.series.push({ "name": e, "data": temp[e] })
                is_aggregate = true;
                break;
            }
        }
        if (!is_aggregate) {
            response.xAxis.categories = temp[e];
            response.xAxis.title.text = e;
        }
    }
    return determine_chart_type(response);
}
module.exports = function (connection) {
    return {
        get_columns: function (req, res, next) {
            connection.query("SELECT COLUMN_NAME FROM information_schema.columns WHERE table_name='data' and TABLE_SCHEMA='application';", function (err, results, fields) {
                if (err || results.length == 0) {
                    console.error(err);
                    res.status(500);
                    res.json({ error: err });
                } else {
                    let response = []
                    for (let cols of results) {
                        response.push(cols["COLUMN_NAME"])
                    }
                    res.status(200);
                    res.json(response)
                }
            })
        },
        data: function (req, res, next) {
            connection.query("SELECT COLUMN_NAME FROM information_schema.columns WHERE table_name='data' and TABLE_SCHEMA='application';", function (err, results, fields) {
                if (err || results.length == 0) {
                    console.error(err);
                    res.status(500);
                    res.json({ error: err });
                } else {
                    let query = verify_input(req.body, results, connection)
                    if (query == false) {
                        res.status(400);
                        res.json({ error: "Invalid Query" });
                    } else {
                        connection.query(query, function (err, results, fields) {
                            if (err) {
                                console.error(err);
                                res.status(500);
                                res.json({ error: err });
                            } else {
                                res.status(200);
                                res.json(process_data(results));
                            }
                        })
                    }
                }
            })
            res.status(200);
        }
    }
}

