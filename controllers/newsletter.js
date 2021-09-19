const Newsletter = require("../models/newsletters");

function suscribeEmail(req, res) {
    const email = req.params.email;
    const newsletter = new Newsletter();

    if (!email) {
        res.status(404).send({ code: 404, message: "The email is required" });
    } else {
        newsletter.email = email.toLowerCase();
        newsletter.save((err, newsletterStore) => {
            if (err) {
                res.status(500).send({ code: 500, message: "Email already exist" });
            } else {
                if (!newsletterStore) {
                    res.status(400).send({ code: 400, message: "Email not exist" });
                } else {
                    res.status(200).send({ code: 200, message: "Email subscribed successfully" });
                }
            }
        });
    }
}

module.exports = {
    suscribeEmail,
};