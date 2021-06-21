import React ,{useState,useEffect}from 'react'
import './Payment.css';
import {useStateValue} from '../../StateProvider/StateProvider';
import CheckoutProduct from '../Checkout/CheckoutProduct/CheckoutProduct';
import {Link,useHistory} from 'react-router-dom';
import {CardElement,useStripe,useElements} from '@stripe/react-stripe-js';
import { getBasketTotal } from '../../Reducer/reducer';
import CurrencyFormat from 'react-currency-format';
import axios from '../../api/api';
function Payment() {
    const history=useHistory();
    const [{basket,user},dispatch]=useStateValue(); 
   const stripe=useStripe();
  const elements = useElements(); 
  const [error,setError]=useState(null);
  const [disabled,setDisabled]=useState(true);
  const [succeeded,setSucceeded]=useState(false);
  const [processing,setProcessing]=useState("");
  const [clientSecret,setClientSecret]=useState(true);

 useEffect(()=>{
     //client secret and including basket in rendering dependency because when cart changes price increases and we want to tell stripe to update the payment that was before adding new to present basket and want new client secret.
     const getClientSecret=async ()=>{
const response=await axios({
    method:'post',
    //?total ise query parameter
    //stripe expects total in currency subunit
    url:`/payments/create?total=${getBasketTotal(basket)*100}`
});
setClientSecret(response.data.clientSecret);
     } 
getClientSecret();
 },[basket]);

 console.log('The key is----->',clientSecret);
 
 const handleSubmit= async (e)=>{
e.preventDefault(); 
//so that after clicking one time you cant click more than one time
setProcessing(true);
//before this we need client secret .
const payload= await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement)
    }//Payment Intent is payment confirmation
}).then(({paymentIntent})=>{
    console.log(paymentIntent);
    setSucceeded(true);
    setError(null);
    setProcessing(false);
    history.replace('/orders'); 
})

  }
  const handleChange=(e)=>{
//Listen to changes in card element
setDisabled(e.empty);
setError(e.error? e.error.message:"");
  }
    return (
    
        <div className="payment">
           <div className="payment__container">
               <h1>
                   (Checkout <Link to="/checkout">{basket?.length} items</Link>)
               </h1>
               <div className="payment__section">
<div className="payment__title">
    <h3>Delivery Address</h3>
</div>
<div className="payment__address">
    <p>{user?.email}</p>
    <p>foffofofof</p>
    <p>ddd</p>
</div>
    </div>
               <div className="payment__section">
                   <div className="payment__title">
                       <h3>Review items and delivery</h3>
                   </div>
                   
                   <div className="payments__items">
                       {
                           basket.map(item=>{
                         return      <CheckoutProduct
                               id={item.id}
                               title={item.title}
                               image={item.image}
                               price={item.price}
                               rating={item.rating}
                               
                               />
                           })
                       }
                   </div>

                   </div>
                   <div className="payment__section">
                   <div className="payment__title">
                       <h3>Payment Method</h3>
                       </div>
                       <div className="payment__details">
                               <form onSubmit={handleSubmit}
                            >
                                   <CardElement onChange={handleChange}/> 
                                   <div className="payment__priceContainer">
                                   <CurrencyFormat
        renderText={(value) => (
          <h3> Order Total:{value}</h3>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)} // Part of the homework
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
      <button disabled={processing|| disabled || succeeded}>
          <span>{processing? <p>Processing</p>:"Buy Now"}</span>
      </button>
                                    
                                    </div>  
                                    {error && <div>{error}</div>}
                                   </form>       
                       </div>
                   </div>
           </div>
        </div>
    )
}

export default Payment
