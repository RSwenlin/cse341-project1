const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const isValidObjectId = (id) => {
    return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    const result = await mongodb.getDatabase().db().collection('users').find();
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
});
};

const getSingle = async (req, res) => {
    const userId = new ObjectId(req.params.id);

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const result = await mongodb.getDatabase().db().collection('users').find({ _id: new ObjectId(userId) });
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0] || { error: 'User not Found'});
    }).catch((err) => {
        res.status(500).json({ error: 'An error occurred', details: err });
    });

};

const createUser = async (req, res) => {
    const user = {
       // firstName: req.body.firstName,
       // lastName: req.body.lastName,
       // email: req.body.email,
       // favoriteColor: req.body.favoriteColor,
       // birthday: req.body.birthday
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        ipaddress: req.body.ipaddress
        };
        const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
        if (response.acknowledged > 0) {
        res.status(204).send();
        } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
        }
};

const updateUser = async(req, res) => {
    const userId = new ObjectId(req.params.id);
    const user = {
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        ipaddress: req.body.ipaddress
    };
    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

const deleteUser = async(req, res) => {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};


module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};

