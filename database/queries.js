const { rgx } = require('../tools/common')



function searchByField(Model, searchBy, fields, options = {}) {
    let aggArray = []
    // Inner Join
    if (!!options.lookup) {
        aggArray.push({
            $lookup: {
                from: options.lookup, // collection name in db
                localField: `id_${options.lookup}`,
                foreignField: "_id",
                as: options.lookup
            }
        });
    };

    // Search with LIKE
    const searchRgx = rgx(searchBy);
    let searchArray = []
    if (Array.isArray(fields)) {
        for (const field of fields) {
            searchArray.push({ [field]: { $regex: searchRgx, $options: "i" } });
        };
    } else {
        searchArray.push({ [fields]: { $regex: searchRgx, $options: "i" } });
    };
    aggArray.push({ $match: { $or: searchArray } },);


    // Returning promise
    return new Promise((resolve, reject) => {
        Model.aggregate(aggArray).then(resolve).catch(reject)
    })
};


module.exports = {
    searchByField,
}