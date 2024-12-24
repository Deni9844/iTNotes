import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import webFont from 'webfontloader';
import Header from './components/layout/Header/Header.jsx';
import Footer from './components/layout/Footer/Footer.jsx';
import Home from './components/Home/Home.jsx';
import Login from './components/User/Login.jsx';
import Subject from './components/Semester/Subject.jsx';
import Chapter from './components/Semester/Chapter.jsx';
import ChapterDetails from './components/Semester/ChapterDetails.jsx';
import React from 'react';
import store from './store.js'
import { clearMessage, loadUser, getAtivePurchasedItem } from './actions/userActon.js';
import Questions from './components/Semester/Questions.jsx'
import Notices from './components/Notice/Notices.jsx'
import NoticeDetails from './components/Notice/NoticeDetails.jsx'
import Articles from './components/Article/Articels.jsx'
import ArticleDetails from './components/Article/ArticleDetails.jsx'
import AskQuestion from './components/Help/AskQuestion.jsx'
import Contribute from './components/Help/Contribute.jsx'
import Account from './components/User/Account.jsx'
import ProtectedRoute from './components/layout/Route/ProtectedRoute.js'
import Dashboard from './components/Admin/Dashboard.jsx'
import ForgotPassword from './components/User/ForgotPassword.js'
import ResetPassword from './components/User/ResetPassword.jsx'
import SubscriptionPlan from './components/User/SubscriptionPlan.jsx'
import Checkout from './components/User/Checkout.jsx'
import PaymentSuccess from './components/User/PaymentSuccess.jsx'
import PaymentFail from './components/User/PaymentFail.jsx'
import { useSelector } from 'react-redux';
import { useAlert } from 'react-alert'
import axios from 'axios';


function App() {

  const { activePurchases, error } = useSelector((state) => state.activePurchase)

  const alert = useAlert()

  React.useEffect(() => {
    webFont.load({
      google: {
        families: ["Inter:400,500,600", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser())
    store.dispatch(getAtivePurchasedItem())
  }, [])

  React.useEffect(() => {
    if (error) {
      alert.error(error)
      store.dispatch(clearMessage())
    }
  }, [error, alert])

  React.useEffect(() => {
    const timeouts = [];

    if (activePurchases) {
      for (const activePurchase of activePurchases) {
        const targetDate = new Date(activePurchase.endDate).getTime();
        const currentTime = Date.now();
        let timeDifference = targetDate - currentTime;

        const id = activePurchase._id;

        // Handle very large delays by splitting into intervals
        const checkInterval = 2 * 60 * 60 * 1000; // Check every 2 hours

        const expirePayment = async () => {
          try {
            await axios.post(
              "/api/v1/expire-payment",
              { id },
              { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            console.log("subscription expired");
          } catch (error) {
            console.error("Error:", error);
          }
        };

        const handleTimeout = () => {
          if (Date.now() >= targetDate) {
            expirePayment();
          } else {
            setTimeout(handleTimeout, Math.min(checkInterval, targetDate - Date.now()));
          }
        };

        // Start the interval to check
        if (timeDifference > 0) {
          timeouts.push(setTimeout(handleTimeout, Math.min(checkInterval, timeDifference)));
        }
      }
    }

    return () => timeouts.forEach(clearTimeout);
  }, [activePurchases]);


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Header />} />
        <Route path='/login' element={<Header />} />
        <Route path='/signup' element={<Header />} />
        <Route
          exact
          path='/semester/:level'
          element={<Header />}
        />
        <Route
          exact
          path='/semester/:level/:subject'
          element={<Header />}
        />
        <Route exact path='/questions' element={<Header />} />
        <Route exact path='/notices' element={<Header />} />
        <Route exact path='/notice/:id' element={<Header />} />
        <Route exact path='/articles' element={<Header />} />
        <Route exact path='/article/:id' element={<Header />} />
        <Route exact path='/askquestion' element={<Header />} />
        <Route exact path='/contribute' element={<Header />} />
        <Route exact path='/account' element={<Header />} />
        <Route exact path='/subscription-plan' element={<Header />} />
        <Route exact path='/checkout' element={<Header />} />
      </Routes>
      <Routes>
        <Route
          exact
          path='/'
          element={<Home />}
        />
        <Route
          exact
          path='/login'
          element={<Login val={"login"} />}
        />
        <Route
          exact
          path='/signup'
          element={<Login val={"signup"} />}
        />
        <Route
          exact
          path='/password/forgot'
          element={<ForgotPassword />}
        />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route
          exact
          path='/semester/:level'
          element={<Subject />}
        />
        <Route
          exact
          path='/semester/:level/:subject'
          element={<Chapter />}
        />
        <Route
          exact
          path='/semester/:level/:subject/:chapter'
          element={<ChapterDetails />}
        />
        <Route exact path='/questions' element={<Questions />} />
        <Route exact path='/notices' element={<Notices />} />
        <Route exact path='/notice/:id' element={<NoticeDetails />} />
        <Route exact path='/articles' element={<Articles />} />
        <Route exact path='/article/:id' element={<ArticleDetails />} />
        <Route exact path='/askquestion' element={<AskQuestion />} />
        <Route exact path='/contribute' element={<Contribute />} />
        <Route exact path='/account' element={<Account />} />
        <Route exact path='/admin/dashboard' element={<ProtectedRoute isAdmin={true} Component={Dashboard} />} />
        <Route exact path='/subscription-plan' element={<SubscriptionPlan />} />
        <Route exact path='/checkout' element={<Checkout />} />
        <Route exact path='/paymentSuccess' element={<PaymentSuccess />} />
        <Route exact path='/paymentFail' element={<PaymentFail />} />
      </Routes>
      <Routes>
        <Route path='/' element={<Footer />} />
        <Route path='/login' element={<Footer />} />
        <Route path='/signup' element={<Footer />} />
        <Route
          exact
          path='/semester/:level'
          element={<Footer />}
        />
        <Route
          exact
          path='/semester/:level/:subject'
          element={<Footer />}
        />
        <Route exact path='/questions' element={<Footer />} />
        <Route exact path='/notices' element={<Footer />} />
        <Route exact path='/notice/:id' element={<Footer />} />
        <Route exact path='/articles' element={<Footer />} />
        <Route exact path='/article/:id' element={<Footer />} />
        <Route exact path='/askquestion' element={<Footer />} />
        <Route exact path='/contribute' element={<Footer />} />
        <Route exact path='/account' element={<Footer />} />
        <Route exact path='/subscription-plan' element={<Footer />} />
        <Route exact path='/checkout' element={<Footer />} />
        <Route exact path='/paymentSuccess' element={<Footer />} />
        <Route exact path='/paymentFail' element={<Footer />} />
      </Routes>

    </Router>
  );
}

export default App;
