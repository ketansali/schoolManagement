const router = require("express").Router()


const accountController = require("../controller/AccountController");
const { registerValidation, loginValidation } = require("../validator/accountValidation");

router.post("/login",loginValidation, function (req, res) {
  return accountController.account.login(req, res);
});

router.post("/register", registerValidation,function (req, res) {
  return accountController.account.register(req, res);
});



module.exports = router;
