import React, { useEffect, useRef, useState } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
const Checkout = () => {
    const [data, setData] = useState(null)
    const buttonRef = useRef(null);
    const [isClicked ,setIsClicked] = useState(false)
    const [name,setName] = useState(null)
    const [email,setEmail] = useState(null)
    const [phoneNum,setPhoneNum] = useState(null)

    const navigate = useNavigate()

    const { search } = useLocation()
    const queryParams = new URLSearchParams(search);
    const mnth = Number(queryParams.get('mnth'));
    const numOfSlot = Number(queryParams.get('slot'));
    const id = queryParams.get('id');

    const [slot, setSlot] = useState(numOfSlot || 1)

    const amt = mnth === 1 ? 200 : mnth === 6 ? 300 : 500
    const plan = mnth === 1 ? "monthly" : mnth === 6 ? "quarterly" : "yearly"
    const alert = useAlert()

    const [totalAmt, setTotalAmt] = useState(amt)

    const { isAuthenticated } = useSelector((state) => state.user)

    const handleIncrement = () => {
        setSlot(prev => prev + 1)
    }

    const handleDecrement = () => {
        slot > 1 && setSlot(prev => prev - 1)
    }

    useEffect(() => {
        setTotalAmt(() => slot * amt)
        if(mnth !== 1 && mnth !== 6 && mnth !== 12 && isAuthenticated){
            navigate('/subscription-plan')
        }
    }, [slot, amt,mnth, isAuthenticated])

    const initiateEsewa = async () => {
         if(!name || !email || !phoneNum){
           alert.error("Please provide all the required details")
           setIsClicked(false)
           return 
         }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const dataPayload = {
                slot,
                email,
                phoneNum,
                name,
                plan,
                ...(id != null && { id }),
            };

            const { data } = await axios.post(`/api/v1/initialize-esewa`, dataPayload, config);

            setData(data)
        } catch (error) {
            console.log(`error : ${error}`)
        }

    }

    useEffect(() => {
        if (buttonRef.current && data) {
            buttonRef.current.click();
        }
    }, [data]);

    return (
        <div>
            <div className="cover">
                <h2>Checkout</h2>
                <p>Page {'>>'} Checkout</p>
            </div>
            <div className="py-4 px-5">
                <div className='max-w-[1250px] mx-auto my-0 lg:px-28 md:px-8 py-16'>
                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8 md:gap-2 ">
                        <div>
                            <h2 className='uppercase font-bold text-2xl mb-2'>billing details</h2>
                            <div className='ml-2'>
                                <p className='pt-5 text-lg pb-2'>Full Name <span className='text-red-500'>*</span></p>
                                <input onChange={(e) => setName(e.target.value)} className='text-[1.07rem] border-[1px] border-solid border-slate-400 outline-none rounded
                            p-2 w-[95%] sm:w-[90%]' type="text" />
                                <p className='pt-5 text-lg pb-2'>Phone <span className='text-red-500'>*</span></p>
                                <input  onChange={(e) => setPhoneNum(e.target.value)} className='text-[1.07rem] border-[1px] border-solid border-slate-400 outline-none rounded
                            p-2  w-[95%] sm:w-[90%]' type="number" />
                                <p className='pt-5 text-lg pb-2'>Email address <span className='text-red-500'>*</span></p>
                                <input onChange={(e) => setEmail(e.target.value)} className='text-[1.07rem] border-[1px] border-solid border-slate-400 outline-none rounded
                            p-2  w-[95%] sm:w-[90%]' type="text" />
                            </div>
                        </div>
                        <div>
                            <h2 className='uppercase font-bold text-2xl mb-2'>Your order</h2>
                            <div className='ml-2'>
                                <table className="table-fixed border-2 border-solid border-slate-400 mt-7 sm:w-[93%] w-[100%]">
                                    <thead className='border-2 border-solid border-slate-400'>
                                        <tr >
                                            <th className='border-2 border-solid border-slate-400 p-2 text-lg'>Product</th>
                                            <th className='border-2 border-solid border-slate-400 p-2 text-lg'>Subtotal</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            {<td className='border-2 border-solid border-slate-400 p-2 text-lg'>Subscription Plan -
                                                {
                                                    mnth === 1 ? " Monthly" : mnth === 6 ? " Quarterly" : " Yearly"
                                                } Plan</td>}
                                            <td className='border-2 border-solid border-slate-400 p-2 text-lg'>₨ {amt} for

                                                {
                                                    mnth === 1 ? " 1 month" : mnth === 6 ? " 6 months" : " 1 year"
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border-2 border-solid border-slate-400 p-2 text-lg '>Subscription Plan -
                                                {
                                                    mnth === 1 ? " Monthly" : mnth === 6 ? " Quarterly" : " Yearly"
                                                } Plan
                                                <div className='flex items-center'> X
                                                    <button className='bg-violet-600 px-[6px] mx-2 rounded text-white h-6 flex justify-center items-center' onClick={handleIncrement}> + </button>
                                                    {slot}
                                                    <button className='bg-violet-600 px-[6px] mx-2 rounded text-white h-6 flex justify-center items-center' onClick={handleDecrement}> - </button>
                                                </div>
                                            </td>
                                            <td className='border-2 border-solid border-slate-400 p-2 text-lg'>₨ {amt} X {slot}</td>
                                        </tr>
                                        <tr>
                                            <td className='border-2 border-solid border-slate-400 p-2 text-lg font-bold'>Subtotal</td>
                                            <td className='border-2 border-solid border-slate-400 p-2 text-lg'>₨ {totalAmt}</td>
                                        </tr>

                                        <tr>
                                            <td className='border-2 border-solid border-slate-400 p-2 text-lg font-bold'>Total</td>
                                            <td className='border-2 border-solid border-slate-400 p-2 text-lg'>₨ {totalAmt}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <div className='bg-violet-200 mt-8 px-4 py-4 rounded-md md:w-[95%] sm:w-[90%]'>
                        <h2 className='pb-4 pt-2 text-lg ' >iTNotes Automated Esewa Checkout</h2>
                        <p className='bg-violet-300 px-6 py-4 rounded-md'>Pay via your eSewa account. Payment you make through eSewa account is completely secured.</p>
                        <button className={` mt-4 px-5 py-2 text-center rounded bg-violet-600 text-gray-50 align-baseline
                        grid place-self-end ${isClicked && 'cursor-not-allowed'}`} disabled={isClicked}  onClick={()=> {setIsClicked(true); initiateEsewa()}}>Proceed to eSewa</button>
                    </div>
                </div>

            </div>
            {data && <form
                action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                method="POST"
                className='hidden'
            >
                <br /><br />
                <table>
                    <tbody>
                        <tr>
                            <td><strong>Parameter </strong></td>
                            <td><strong>Value</strong></td>
                        </tr>

                        <tr>
                            <td>Amount:</td>
                            <td>
                                <input
                                    type="text"
                                    id="amount"
                                    name="amount"
                                    value={data.purchasedItemData.totalPrice}
                                    class="form"
                                    required=""
                                />
                                <br />
                            </td>
                        </tr>

                        <tr>
                            <td>Tax Amount:</td>
                            <td>
                                <input
                                    type="text"
                                    id="tax_amount"
                                    name="tax_amount"
                                    value="0"
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Total Amount:</td>
                            <td>
                                <input
                                    type="text"
                                    id="total_amount"
                                    name="total_amount"
                                    value={data.purchasedItemData.totalPrice}
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Transaction UUID (Item Purchase ID):</td>
                            <td>
                                <input
                                    type="text"
                                    id="transaction_uuid"
                                    name="transaction_uuid"
                                    value={data.purchasedItemData._id}
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Product Code:</td>
                            <td>
                                <input
                                    type="text"
                                    id="product_code"
                                    name="product_code"
                                    value="EPAYTEST"
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Product Service Charge:</td>
                            <td>
                                <input
                                    type="text"
                                    id="product_service_charge"
                                    name="product_service_charge"
                                    value="0"
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Product Delivery Charge:</td>
                            <td>
                                <input
                                    type="text"
                                    id="product_delivery_charge"
                                    name="product_delivery_charge"
                                    value="0"
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Success URL:</td>
                            <td>
                                <input
                                    type="text"
                                    id="success_url"
                                    name="success_url"
                                    value="http://localhost:3000/paymentSuccess"
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Failure URL:</td>
                            <td>
                                <input
                                    type="text"
                                    id="failure_url"
                                    name="failure_url"
                                    value={`http://localhost:3000/paymentFail?id=${data.purchasedItemData._id}`}
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>signed Field Names:</td>
                            <td>
                                <input
                                    type="text"
                                    id="signed_field_names"
                                    name="signed_field_names"
                                    value={data.payment.signed_field_names}
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>Signature:</td>
                            <td>
                                <input
                                    type="text"
                                    id="signature"
                                    name="signature"
                                    value={data.payment.signature}
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Secret Key:</td>
                            <td>
                                <input
                                    type="text"
                                    id="secret"
                                    name="secret"
                                    value="8gBm/:&amp;EnhH.1/q"
                                    class="form"
                                    required=""
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input
                    value=" Pay with eSewa "
                    type="submit"
                    class="button" ref={buttonRef} />
            </form>}
        </div>
    )
}

export default Checkout
