import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import MailIcon from '@mui/icons-material/Mail';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import User from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoginImg from '../../images/login.png'
import SignupImg from '../../images/sign_up.png'
import fb from '../../images/Facebook1.png'
import google from '../../images/Google.png'
import './Login.css'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from '../../actions/userActon';
import { useGoogleLogin } from '@react-oauth/google';
import { useAlert } from 'react-alert';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';

const Login = ({ val }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const alert = useAlert()
  const { isAuthenticated, loading } = useSelector((state) => state.user)

  const [toggle, setToggle] = useState(val)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [signupShowPassword1, setSignupShowPassword1] = useState(false);
  const [signupShowPassword2, setSignupShowPassword2] = useState(false);
  const [err, setErr] = useState('')
  const [googleLoggedUser, setGoogleLoggedUser] = useState(null)
  const [googleProfile, setGoogleProfile] = useState(null)
  const [facebookProfile, setFacebookProfile] = useState(null)

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { name, email, password, confirmPassword } = user;

  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const handleClick = (value) => {
    setToggle(value)
  }

  const loginSubmit = (e) => {
    e.preventDefault();
    const credentialData = {
      email: loginEmail,
      password: loginPassword
    }
    dispatch(login(credentialData))
  }
  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("username", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
    myForm.set("file", avatar);
    dispatch(register(myForm))
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      const file = e.target.files[0]

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleLoggedUser(codeResponse),
    onError: (error) => setErr(`Google Login Failed:${error}`)
  });

  const responseFacebook = (response) => {
  if (response.accessToken) {
      axios
        .get(`https://graph.facebook.com/me?access_token=${response.accessToken}&fields=name,email,picture`, {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setFacebookProfile(res.data);
          console.log('data:',res.data)
        })
        .catch((err) => {
          setErr(`Facebook Login Failed !!`);
        });
    } else {
      setErr('Facebook Login Failed !!');
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account')
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: Smooth scrolling animation
    });

  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (googleLoggedUser) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleLoggedUser.access_token}`, {
          headers: {
            Authorization: `Bearer ${googleLoggedUser.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setGoogleProfile(res.data);
        })
        .catch((err) => setErr(`Google Login Failed !!s`));
    }
  }, [googleLoggedUser])


  useEffect(() => {
    if (err) {
      alert.error(err)
    }

    if (googleProfile) {
      const credentialData = {
        email: googleProfile.email,
        username: googleProfile.name,
        avatar: googleProfile.picture,
        used: 'other'
      }
      dispatch(login(credentialData))
      setGoogleProfile(null)
    }

    if (facebookProfile && 'email' in facebookProfile && 'name' in facebookProfile &&
      'picture' in facebookProfile) {
      const credentialData = {
        email: facebookProfile.email,
        username: facebookProfile.name,
        avatar: facebookProfile.picture.data.url,
        used: 'other'
      }
      dispatch(login(credentialData))
      setFacebookProfile(null)

    }

  }, [err, alert, dispatch, googleProfile, facebookProfile])

  return (
    <Fragment>
      {
        !loading &&
        <div className="form-outer">
          <div className="form">
            <div className="form-top">
              <p onClick={() => handleClick("login")} className={toggle === 'login' ? 'active' : 'inactive'}>Log in</p>
              <p onClick={() => handleClick("signup")} className={toggle === 'signup' ? 'active' : 'inactive'}>Sign up</p>
            </div>
            <div className="all-body">

              <form onSubmit={loginSubmit}>
                <div className={`form-body ${toggle === 'login' ? 'login-active' : 'login-inactive'}`}>
                  <img src={LoginImg} alt="" className='cover-img' />
                  <div className="body-left">
                    <div className="email">
                      <MailIcon />
                      <input
                        type="text"
                        name='emailorusername'
                        placeholder='Email or Username'
                        value={loginEmail}
                        required
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="password">
                      <LockIcon />
                      <input
                        type={loginShowPassword ? 'text' : 'password'}
                        required
                        name='password'
                        placeholder='Password'
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />

                      {loginShowPassword ? (
                        <VisibilityOffIcon id="showPasswordToggle" className="passwordToggle" onClick={() => setLoginShowPassword(false)} />
                      ) : (
                        <VisibilityIcon id="showPasswordToggle" className="passwordToggle" onClick={() => setLoginShowPassword(true)} />
                      )}
                    </div>
                    <input type="submit" value="Log in" />
                    <p className='or'>OR</p>
                    <div className="sign-in-with or">
                      <p>Sign in with :</p>
                      <img src={google} alt="" onClick={() => googleLogin()} />
                      <div className="fb">
                      <FacebookLogin
                        appId="1127132508387672"s
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook} />
                      <img src={fb} alt="" />
                      </div>

                    </div>
                    <p className='l-para'>Don't have an account? <span style={{ cursor: 'pointer' }} onClick={() => handleClick("signup")}>Sign up</span></p>
                    <p className='l-para'>Forgot password? <Link to='/password/forgot'><span>Click here</span></Link></p>
                  </div>
                </div>
              </form>
              <div className={`form-body ${toggle === 'signup' ? 'signup-active' : 'signup-inactive'}`}>
                <img src={SignupImg} alt="" className='cover-img' />
                <form action=""
                  encType='multipart/form-data'
                  onSubmit={registerSubmit}>
                  <div className="body-left">
                    <div className="user">
                      <User />
                      <input
                        type="text"
                        name='name'
                        placeholder='Username'
                        value={name}
                        required
                        onChange={registerDataChange} />
                    </div>
                    <div className="email">
                      <MailIcon />
                      <input type="email"
                        name='email'
                        placeholder='Email'
                        value={email}
                        required
                        onChange={registerDataChange} />
                    </div>
                    <div className="password">
                      <LockIcon />
                      <input type={signupShowPassword1 ? 'text' : 'password'}
                        name='password'
                        placeholder='Password'
                        value={password}
                        required
                        onChange={registerDataChange} />
                      {signupShowPassword1 ? (
                        <VisibilityOffIcon id="showPasswordToggle" className="passwordToggle" onClick={() => setSignupShowPassword1(false)} />
                      ) : (
                        <VisibilityIcon id="showPasswordToggle" className="passwordToggle" onClick={() => setSignupShowPassword1(true)} />
                      )}
                    </div>
                    <div className="password">
                      <KeyIcon />
                      <input type={signupShowPassword2 ? 'text' : 'password'} name='confirmPassword'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        required
                        onChange={registerDataChange} />
                      {signupShowPassword2 ? (
                        <VisibilityOffIcon id="showPasswordToggle" className="passwordToggle" onClick={() => setSignupShowPassword2(false)} />
                      ) : (
                        <VisibilityIcon id="showPasswordToggle" className="passwordToggle" onClick={() => setSignupShowPassword2(true)} />
                      )}
                    </div>
                    <div className="add-profile">
                      <div style={{ background: `url(${avatarPreview}) center center /cover no-repeat` }}>

                      </div>
                      <div onClick={() => document.getElementById('avatar').click()}>
                        <p >Click to add profile</p>
                        <input
                          id='avatar'
                          type="file"
                          name="avatar"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={registerDataChange}
                        />
                        <AddCircleIcon className='no-style' />
                      </div>
                    </div>
                    <input type="submit" value="Sign up" />
                    <p className='l-para'>Already have an account? <span style={{ cursor: 'pointer' }} onClick={() => handleClick("login")}>Log in</span></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      }

    </Fragment>
  )
}

export default Login