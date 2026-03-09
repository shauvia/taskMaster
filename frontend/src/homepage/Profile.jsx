import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

export function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteAccount, user } = useAuth();
  const navigate = useNavigate();
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (window.confirm("Are you sure you want to delete your account?")) {
      console.log("Sure! We will delete your account");
      let profileIsDeleted = await deleteAccount(user.id);
      if (profileIsDeleted?.success) {
        console.log(profileIsDeleted.message);
        navigate("/", { replace: true });
      }
    } else {
      console.log("User cancelled deletion");
    }
  };
  return (
    <div className="dropdown">
      <button type="button" className="profile-trigger" onClick={handleOpen}>
        Profile
      </button>
      {isOpen ? (
        <ul className="profile-dropdown">
          <li className="profile-item">
            <button type="button">Profile</button>
          </li>
          <li className="profile-item">
            <button type="button">Profile Settings</button>
          </li>
          <li className="profile-item">
            <button type="button" onClick={handleDeleteAccount}>
              Delete Profile
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
