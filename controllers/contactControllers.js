const asyncHanlder = require("express-async-handler");
const Contact = require("../models/contactModels");
const contactModels = require("../models/contactModels");


//get all contact
const getContacts = asyncHanlder(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts)
});

//creat new contact
const creatContact = asyncHanlder(async (req, res) => {
    console.log("the request body is: ", req.body)
    const { name, email, phone } = req.body
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All information is needed");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(201).json(contact);
});


//get contact
const getContact = asyncHanlder(async (req, res) => {

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");

    }
    res.status(200).json(contact);

});

// adjust contact
const adjustContact = asyncHanlder(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");

    }
    if (contact.user_id.toString() != req.user.id) {
        res.status(403);
        throw new Error("user don't have the permission to update other user contacts");

    }
    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updateContact);
});

// delete contact
const deleteContact = asyncHanlder(async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(404);
            throw new Error("Contact not found");

        }
        if (contact.user_id.toString() != req.user.id) {
            res.status(403);
            throw new Error("user don't have the permission to delete other user contacts");

        }
        await Contact.deleteOne({ _id: req.params.id });
        res.status(200).json(contact);

    } catch (error) {
        console.log(error)

    }

});




module.exports = { getContacts, creatContact, getContact, adjustContact, deleteContact }