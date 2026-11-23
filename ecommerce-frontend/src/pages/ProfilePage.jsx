
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";
import "./ProfilePage.css";

function ProfilePage() {
    const { user, setUser, token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(Boolean(token));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch customer profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load profile"
                    );
                }

                const updatedProfile = {
                    name: data.user.name || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    address: data.user.address || ""
                };

                setProfile(updatedProfile);
                setUser(data.user);
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token, setUser]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Start editing
    const handleEdit = () => {
        setSuccess("");
        setError("");
        setEditing(true);
    };

    // Save updated profile
    const handleSave = async (e) => {
        e.preventDefault();

        if (!editing || saving) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    address: profile.address
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Profile update failed"
                );
            }

            const updatedProfile = {
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                address: data.user.address || ""
            };

            setProfile(updatedProfile);
            setUser(data.user);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setEditing(false);
            setSuccess("Profile updated successfully!");

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setEditing(false);
        setError("");
        setSuccess("");

        setProfile({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || ""
        });
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken(null);

        navigate("/login");
    };

    if (loading) {
        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );
    }

    if (!token) {
        return (
            <div className="profile-error">
                Please log in to view your profile.
            </div>
        );
    }

    if (error && !profile.email) {
        return (
            <div className="profile-error">
                {error}
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">

                <Link to="/home" className="profile-back-btn">
                    <ArrowLeft size={18} />
                    Back to Store
                </Link>

                <div className="profile-heading">
                    <h1>My Profile</h1>
                    <p>Manage your personal information</p>
                </div>

                <div className="profile-card">

                    <div className="profile-avatar">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>

                    <h2>{profile.name}</h2>

                    <p className="profile-email">
                        {profile.email}
                    </p>

                    {error && (
                        <p className="profile-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="profile-success">
                            {success}
                        </p>
                    )}

                    {/* Profile form */}
                    <form
                        id="profile-form"
                        onSubmit={handleSave}
                    >

                        <div className="profile-field">
                            <label htmlFor="profile-name">
                                Full Name
                            </label>

                            <input
                                id="profile-name"
                                type="text"
                                name="name"
                                value={profile.name}
                                disabled={!editing}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="profile-email">
                                Email Address
                            </label>

                            <input
                                id="profile-email"
                                type="email"
                                value={profile.email}
                                disabled
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="profile-phone">
                                Phone Number
                            </label>

                            <input
                                id="profile-phone"
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                placeholder="Enter phone number"
                                disabled={!editing}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="profile-address">
                                Delivery Address
                            </label>

                            <textarea
                                id="profile-address"
                                name="address"
                                value={profile.address}
                                placeholder="Enter your delivery address"
                                disabled={!editing}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                        {/* Save and Cancel buttons */}
                        {editing && (
                            <div className="profile-actions">

                                <button
                                    type="submit"
                                    className="profile-save-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                            </div>
                        )}

                    </form>

                    {/* Edit button outside the form */}
                    {!editing && (
                        <div className="profile-actions">
                            <button
                                type="button"
                                className="profile-edit-btn"
                                onClick={handleEdit}
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}

                    {/* Logout */}
                    <button
                        type="button"
                        className="profile-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
