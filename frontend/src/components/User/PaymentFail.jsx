import axios from 'axios';
import React, { useEffect } from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'

const PaymentFail = () => {

    const { search } = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(search);
    const id = queryParams.get('id');


    function isValidMongoId(id) {
        return /^[a-f\d]{24}$/i.test(id);
      }

    useEffect(() => {
        if(!isValidMongoId(id)){
            navigate('/')
        }
        const cancelPayment = async () => {
            try {
                const response = await axios.post(
                    "/api/v1/cancel-payment",
                    { id },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
            } catch (error) {
                console.error("Error:", error);
            }
        };

        cancelPayment();
    }, [id])
    return (
        <div class="bg-white h-screen">
            <div class=" pt-[15vh]  md:mx-auto">
                <svg viewBox="0 0 24 24" class="text-red-600  h-16 mx-auto my-5 w-full">
                    <path fill="currentColor"
                        d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                    </path>
                </svg>
                <div class="text-center">
                    <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Failed!</h3>
                    <p class="text-gray-600 my-2">You cancelled the online payment.</p>
                    <div class="py-10 text-center">
                        <Link to={'/'} class="px-12 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 transition-all rounded-[4px]">
                            GO BACK
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentFail
