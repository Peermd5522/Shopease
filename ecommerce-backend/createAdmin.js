require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const createAdmin = async () => {

    try {

        await connectDB();

        const existingAdmin = await User.findOne({
            email: process.env.ADMIN_EMAIL
        });

        if (existingAdmin) {

            console.log("Admin already exists");

            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        const admin = await User.create({
            name: "Admin",
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");

        console.log({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });

        process.exit(0);

    } catch (error) {

        console.error("Error creating admin:", error);

        process.exit(1);
    }
};

createAdmin();