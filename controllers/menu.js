const Menu = require("../models/menu");

function addMenu(req, res) {
    const { title, url, order, active } = req.body;
    const menu = new Menu();
    menu.title = title;
    menu.url = url;
    menu.order = order;
    menu.active = active;

    menu.save((err, createMenu) => {
        if (err) {
            res.status(500).send({ message: "Server error" });
        } else {
            if (!createMenu) {
                res.status(404).send({ message: "Error menu created" });
            } else {
                res.status(200).send({ message: "Menu created successfully" });
            }
        }
    });
}

function getMenus(req, res) {
    Menu.find().sort({ order: "asc" }).exec((err, menuStore) => {
        if (err) {
            res.status(500).send({ message: "Server error" });
        } else {
            if (!menuStore) {
                res.status(404).send({ message: "Not found any menu" });
            } else {
                res.status(200).send({ menus: menuStore });
            }
        }
    });
}

function getMenu(req, res) {
    const { id } = req.params;
    console.log(id);

    Menu.find({ _id: id }).then((menuStore) => {
        if (!menuStore) {
            res.status(404).send({ message: "Not found any menu" });
        } else {
            res.status(200).send({ menu: menuStore });
        }
    });
}

function updateMenu(req, res) {
    let menuData = req.body;
    const params = req.params;

    Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdate) => {
        if (err) {
            res.status(500).send({ message: "Server error" });
        } else {
            if (!menuUpdate) {
                res.status(404).send({ message: "Not found menu" });
            } else {
                res.status(200).send({ message: "Menu update successfully" });
            }
        }
    });
}

//can be recycled updateMenu, but activateMenu have notifications customised
function activateMenu(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    Menu.findByIdAndUpdate(id, { active }, (err, menuUpdate) => {
        if (err) {
            res.status(500).send({ message: "Server error" });
        } else {
            if (!menuUpdate) {
                res.status(404).send({ message: "Menu not exist" });
            } else {
                if (active === true) {
                    res.status(200).send({ message: "Menu active successfully" });
                } else {
                    res.status(200).send({ message: "Menu desactive successfully" });
                }
            }
        }
    });
}

function deleteMenu(req, res) {
    const { id } = req.params;

    Menu.findByIdAndRemove(id, (err, menuDeleted) => {
        if (err) {
            res.status(500).send({ message: "Server error" });
        } else {
            if (!menuDeleted) {
                res.status(404).send({ message: "Menu not exist" });
            } else {
                res.status(200).send({ message: "Menu removed successfully" });
            }
        }
    });
}

module.exports = {
    addMenu,
    getMenus,
    getMenu,
    updateMenu,
    activateMenu,
    deleteMenu,
};