import React,{useEffect} from 'react';
import Home from './components/Home/Home';
import './App.css';
import Checkout from './components/Checkout/Checkout';
import Header from './components/Header/Header';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Login from './components/Login/Login';
import {auth} from './firebase';
import {useStateValue} from './StateProvider/StateProvider';
import Payment from './components/Payment/Payment'; 
//setting up stripe
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
const promise = loadStripe('pk_test_51J1qpSSIROaRTzgjyavDp9MTS1bu8LlPHdfbNsme4RR90CCxD4M6vnLr8BbR9Y6QYcYaHB8uzUZOR8Av8UDuchDW00lcgGkToc');
function App() {
  const [{basket},dispatch]=useStateValue();
  useEffect(()=>{
    //app loads and attach listerner 
auth.onAuthStateChanged(authUser=>{
  console.log('USER -',authUser);
  if(authUser){
    //user is logged in
        dispatch({
          type:'SET_USER',
          user:authUser
        })
  }else{
    //user is logged out
dispatch({
  type:'SET_USER',
  user:null
})
  }
})
  },[])
  return (
    <Router>
        <div className="app">
<Switch>
  <Route path="/login">
<Login/>
  </Route>
  <Route path="/" exact>
  <Header/>
    <Home/>
  </Route>
  <Route path="/payment" >
    <Header/>
    <Elements stripe={promise}>
    <Payment/>
    </Elements>

  </Route>
  <Route path="/checkout">
  <Header/>
<Checkout/>
  </Route>
     </Switch>
    </div>
    </Router>
  );
}

export default App;
