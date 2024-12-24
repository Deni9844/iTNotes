import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useParams } from "react-router-dom";
import { clearMessage, resetPassword } from "../../actions/userActon";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate()
    const {token} = useParams()

    const { isAuthenticated } = useSelector((state) => state.user)

    const { error, success , loading } = useSelector((state) => state.forgotPassword);

    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);
        dispatch(resetPassword(token,myForm));
    };


    useEffect(() => {

        if (isAuthenticated) {
            navigate('/account');
          }

        if (error) {
            alert.error(error);
            dispatch(clearMessage());
        }

        if (success) {
            alert.success("Password Updated Successfully");
            navigate("/login");
        }
    }, [dispatch, error, alert, navigate,success,isAuthenticated]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox big">
                            <h2 className="updateProfileHeading">Reset password</h2>

                            <form
                                className="updateProfileForm"
                                onSubmit={updatePasswordSubmit}
                            >
                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockIcon />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setconfirmPassword(e.target.value)}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Update"
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

export default ResetPassword
