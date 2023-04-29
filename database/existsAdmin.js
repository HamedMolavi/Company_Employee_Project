const bcrypt = require('bcryptjs');

module.exports = async function (models) {
    models.User.findOne({ role: 'admin' })
        .then(admin => {
            if (!!admin) return console.log('admin -->', admin);
            // Hashing password
            bcrypt.hash(process.env.ADMIN_PASSWORD, 10, function (err, hashedPassword) {
                if (err) throw err;
                let NEW_ADMIN = new models.User({
                    username: process.env.ADMIN_USERNAME,
                    password: hashedPassword,
                    role: 'admin',
                    email: 'none@none.none',
                    gender: 'male'

                });
                NEW_ADMIN.save()
                    .then(admin => console.log('admin -->', admin))
                    .catch(err => { throw err });
            });
        })
        .catch(err => { throw err })
};