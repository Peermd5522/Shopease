
require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const createAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";

            await existingAdmin.save();

            console.log("Admin password updated successfully!");
        } else {
            await User.create({
                name: "Admin",
                email,
                password: hashedPassword,
                role: "admin"
            });

            console.log("Admin created successfully!");
        }

        process.exit(0);

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

createAdmin();
