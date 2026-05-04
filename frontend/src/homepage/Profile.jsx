import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

export function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteAccount, user } = useAuth();
  const navigate = useNavigate();

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closeMenu();
    }
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
    <div
      className="dropdown"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onFocus={openMenu}
      onBlur={handleBlur}
    >
      <button
        type="button"
        className="profile-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        Profile
      </button>
      {isOpen ? (
        <ul className="profile-dropdown" role="menu">
          <li className="profile-item">
            <button type="button" role="menuitem">
              Profile
            </button>
          </li>
          <li className="profile-item">
            <button type="button" role="menuitem">
              Profile Settings
            </button>
          </li>
          <li className="profile-item">
            <button type="button" onClick={handleDeleteAccount} role="menuitem">
              Delete Profile
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
