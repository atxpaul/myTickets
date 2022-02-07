class UserController {
  constructor() {}

  login = async (req, res) => {
    const user = req.user;
    res.status(200).json({ name: user.name, email: user.email });
  };

  signup = async (req, res) => {
    const user = req.user;
    res.status(200).json({ name: user.name, email: user.email });
  };

  home = async (req, res) => {
    const user = req.user;
    res.status(200).json({ name: user.name, email: user.email });
  };
}

export default UserController;
