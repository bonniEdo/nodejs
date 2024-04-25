const express = require("express");
const router = express.Router();
const { getContacts, creatContact, getContact, adjustContact, deleteContact } = require("../controllers/contactControllers");
const validateToken = require("../middleware/validateTokenHandler");


router.use(validateToken);
router.route("/").get(getContacts).post(creatContact);

router.route("/:id").get(getContact).put(adjustContact).delete(deleteContact);



module.exports = router;
