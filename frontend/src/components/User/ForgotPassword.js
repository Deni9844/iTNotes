import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { clearMessage, forgotPassword } from "../../actions/userActon";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate()

  const { isAuthenticated } = useSelector((state) => state.user)

  const { error, message, loading } = useSelector((state) => state.forgotPassword);

  const [email, setEmail] = useState("");


  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };


  useEffect(() => {

    if (isAuthenticated) {
      navigate('/account');
    }
    if (error) {
      alert.error(error);
      dispatch(clearMessage());
    }

    if (message) {
      alert.success(message)
    }

  }, [dispatch, error, alert, navigate, isAuthenticated, message]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {/*<MetaData title="Forgot password" /> */}
          <div className="updateProfileContainer">
            <div className="updateProfileBox" style={{ height: '250px' }}>
              <h2 className="updateProfileHeading">Forgot password</h2>

              <form
                className="updateProfileForm"
                onSubmit={forgotPasswordSubmit}
              >

                <div className="updateProfileEmail">
                  <MailOutlineOutlinedIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <input
                  type="submit"
                  value="Send"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default ForgotPassword
