const express = require("express");
const MenuController = require("../controllers/menu");
//middlewares
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/add-menu", [md_auth.ensureAuth], MenuController.addMenu);
api.get("/get-menus", MenuController.getMenus);
api.get("/get-menu/:id", MenuController.getMenu);
api.put("/update-menu/:id", [md_auth.ensureAuth], MenuController.updateMenu);
api.put("/active-menu/:id", [md_auth.ensureAuth], MenuController.activateMenu);
api.delete("/delete-menu/:id", [md_auth.ensureAuth], MenuController.deleteMenu);

module.exports = api;