const Post = require("../models/post.js");

function addPost(req, res) {
    const body = req.body;
    const post = new Post(body);

    post.save((err, postStore) => {
        if (err) {
            res.status(500).send({
                code: 500,
                message: "Server error"
            });
        } else {
            if (!postStore) {
                res.status(400).send({
                    code: 400,
                    message: "Error to created post"
                });
            } else {
                res.status(200).send({
                    code: 200,
                    message: "Post created successfully"
                });
            }
        }
    });
};

function getPosts(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page, // = page: page
        limit: parseInt(limit),
        sort: { date: "desc" }
    }

    Post.paginate({}, options, (err, postsStore) => {
        if (err) {
            res.status(500).send({
                code: 500,
                message: "Server error"
            });
        } else {
            if (!postsStore) {
                res.status(404).send({
                    code: 404,
                    message: "Not found any post"
                })
            } else {
                res.status(200).send({
                    code: 200,
                    posts: postsStore
                });
            }
        }
    });
};

function getPost(req, res) {
    const { url } = req.params;

    Post.findOne({ url }, (err, postStored) => {
        if (err) {
            res.status(500).send({ code: 500, message: "Error del servidor." });
        } else {
            if (!postStored) {
                res
                    .status(404)
                    .send({ code: 404, message: "No se ha encontrado ningun post." });
            } else {
                res.status(200).send({ code: 200, post: postStored });
            }
        }
    });
};


function updatePost(req, res) {
    const postData = req.body;
    const { id } = req.params; //destructuring

    Post.findByIdAndUpdate(id, postData, (err, postUpdate) => {
        if (err) {
            res.status(500).send({
                code: 500,
                message: "Server error"
            });
        } else {
            if (!postUpdate) {
                res.status(404).send({
                    code: 404,
                    message: "Not found post"
                });
            } else {
                res.status(200).send({
                    code: 200,
                    message: "Post updated succcessfully"
                });
            }
        }
    });
};

function deletePost(req, res) {
    const { id } = req.params;

    Post.findByIdAndDelete(id, (err, postDelete) => {
        if (err) {
            res.status(500).send({
                code: 500,
                message: "Server error"
            });
        } else {
            if (!postDelete) {
                res.status(404).send({
                    code: 404,
                    message: "Error deleting post"
                });
            } else {
                res.status(200).send({
                    code: 200,
                    message: "Post deleted successfully"
                });
            }
        }
    });
};

module.exports = {
    addPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
};