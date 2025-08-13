const User = require('../models/user');
const { jwtDecode } = require("jwt-decode");
const TODO = require('../models/todo');

//Fetch All Users 
const getAllusers = async (req, res) => {
	try {
		//Get Authorization header
		const authHeader = req.headers.authorization;
		console.log(req.user);
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'Unauthorized: No token provided' });
		}

		const token = authHeader.split(' ')[1];

		const decoded = jwtDecode(token); 
		const { username, role } = decoded.UserInfo || {};

		if (!username || !role) {
			return res.status(403).json({ message: 'Invalid token structure' });
		}

		if (role !== 'admin') {
			return res.status(403).json({ message: 'Access denied: Admins only' });
		}

		// Fetch and return all users
		const users = await User.find({}, '-password -refreshToken');

		const usersWithTasks = await Promise.all(
			users.map(async (user) => {
				const tasks = await TODO.find({ user: user._id }); 
				return {
					...user.toObject(),
					tasks,
				};
			})
		);

		res.json(usersWithTasks);


		// res.json(users);


	} catch (err) {
		console.error('Error:', err.message);
		res.status(500).json({ message: 'Failed to fetch users' });
	}

}

const getAllandDelete = async (req, res) => {
	try {
		const { id } = req.params;
		// verify admin token
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const token = authHeader.split(' ')[1];

		const decoded = jwtDecode(token);
		const { username: requesterUsername, role } = decoded.UserInfo || {};

		if (role !== 'admin') {
			return res.status(403).json({ message: "Only admins can delete users." });
		}

		//Find user to delete
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ message: "User not found" });

		await TODO.deleteMany({ user: id });

		await User.findByIdAndDelete(id);

		res.json({ message: `User ${user.username} deleted successfully.` });

	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}
};

module.exports = { getAllandDelete, getAllusers };
