const router = require('express').Router();

const db = require('../data/db');

router.post('/', (req, res) => {
    const post = req.body;
    if (post.title && post.contents) {
        db.insert(post)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(404).json({ errorMessage: "There was an error while saving the post to the database." })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post" })
    }
})

router.post('/:id/comments', (req, res) => {
    const { text, post_id } = req.body;
    const { id } = req.params
    id &&
        text &&
        post_id === id &&
        db.insertComment({ text, post_id })
            .then(comment => {
                const { id } = comment;
                res.status(201).json({ text, id, post_id })
            })
            .catch(() => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
    if (!id || id !== post_id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
})

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    db.findById(id)
        .then(comments => {
            if (comments) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Post information could not be retrieved" })
        })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    db.findPostComments(id)
        .then(comments => {
            if (comments) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: "The comments could not be retrieved" })
        })
})

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const result = db.findById(id).then(post => {
        res.status(200).json(post);
    });

    if (!id) {
        res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
    }
    db.remove(id)
        .then(() => {
            console.log('This is in remove')
            return result;
        })
        .catch(() => {
            res.status(500).json({ error: "The post could not be removed" });
        });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    if (data.title && data.contents) {
        db.update(id, data)
            .then(update => {
                res.status(200).json(data)
            })
            .catch(() => {
                res.status(400).json({ error: "The post information could not be modified." })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    if (!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }

})


module.exports = router;