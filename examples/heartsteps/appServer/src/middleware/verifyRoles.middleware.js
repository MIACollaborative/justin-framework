// (...allowedRoles) allows us to pass in as many allowed roles as we like
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      console.log('ERR: ROLES NOT PRESENT IN REQUEST');
      return res.sendStatus(401);
    }
    const rolesArray = [...allowedRoles];
    const result = req.roles
      // an array of booleans mapping roles to [true, false]
      .map((role) => rolesArray.includes(role))
      // find first role match that's true
      .find((val) => val === true);

    if (!result) {
      console.log('ERR: ROLE CHECKING FAILED, ROLES DON NOT MATCH');
      return res.sendStatus(401);
    }
    next();
  };
};

module.exports = verifyRoles;
