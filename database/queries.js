const { rgx } = require('../tools/common')



function searchByField(Model, searchBy, fields) {
    const searchRgx = rgx(searchBy);
    let searchArray = []
    for (const field of fields) {
        searchArray.push({ [field]: { $regex: searchRgx, $options: "i" } });
    };
    return new Promise((resolve, reject) => {
        Model.find({
            $or: searchArray,
        })
            .then(resolve)
            .catch(reject)
    })
};


module.exports = {
    searchByField,
}