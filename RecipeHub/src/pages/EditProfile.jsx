import React, { useContext, useState, useEffect } from "react";
import { InputField } from "../component/common/InputField";
import { Button } from "../component/common/Button";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const { user, editProfile,loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    cookpadId: "",
    email: "",
    location: "",
    bio: "",
    avatar: null,
  });

  const [preview, setPreview] = useState("/cheflogo.png");

  // 🔥 Whenever `user` changes, update the form data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        cookpadId: user.cookpadId || "",
        email: user.email || "",
        location: user.location || "",
        bio: user.bio || "",
        avatar: null,
      });
      setPreview(user.avatar || "/cheflogo.png");
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    editProfile(data);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white px-6 py-4 rounded-2xl shadow">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <label className="cursor-pointer relative">
          <img
            className="w-20 h-20 rounded-full object-cover border"
            src={preview}
            alt="profile"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <span className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
            Edit
          </span>
        </label>
      </div>

      {/* Inputs */}
      <InputField label="Name" value={formData.name} onChange={handleChange("name")} />
      <InputField label="User ID" value={formData.cookpadId} disabled />
      <InputField disabled label="E-Mail" value={formData.email} onChange={handleChange("email")} type="email" />
      <InputField label="Location" value={formData.location} onChange={handleChange("location")} />
      <label  className="block text-md font-medium text-gray-700 mb-2 capitalize" htmlFor="area">About you and your love of cooking</label>
      <textarea onChange={handleChange("bio")} rows={6} value={formData.bio} placeholder="" className="w-full border-b-2 border-gray-300 focus:outline-none " name="area" id="">

      </textarea>

      {/* Buttons */}
      <div className="flex gap-2 mt-6">
        <Button loading={loading} variant="primary" onClick={handleSubmit}>Update</Button>
        <Link to={'/profile'}>
        <Button variant="secondary">Cancel</Button>
        </Link>
      </div>
    </div>
  );
};

export default EditProfile;
