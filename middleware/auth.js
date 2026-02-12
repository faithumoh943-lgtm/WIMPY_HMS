module.exports = (roles = []) => {
  return (req, res, next) => {
    const role = req.headers.role;

    if (!role) {
      return res.status(403).json({ message: "No role provided" });
    }

    if (!roles.includes(role)) {
      return res.status(401).json({ message: "Access denied" });
    }

    next();
  };
};
