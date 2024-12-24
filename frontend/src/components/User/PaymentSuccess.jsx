import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux'
import axios from 'axios';
import { getAtivePurchasedItem } from '../../actions/userActon';

const PaymentSuccess = () => {
    const { search } = useLocation()
    const queryParams = new URLSearchParams(search);
    const data = queryParams.get('data');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function isBase64(str) {
        if (typeof str !== 'string') {
            return false;
        }

        // Check if the string matches the Base64 pattern
        const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;

        // Return true if the string matches the pattern and its length is divisible by 4
        return base64Regex.test(str) && str.length % 4 === 0;
    }


    useEffect(() => {
        const fetchData = async () => {
            if (!isBase64(data)) {
                navigate('/');
                return;
            }

            try {
                const response = await axios.post(
                    "/api/v1/complete-payment",
                    { data },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                
                dispatch(getAtivePurchasedItem())
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [data, navigate]);


    return (
        <>
            {data && <div class="bg-white h-screen">
                <div class=" pt-[15vh]  md:mx-auto">
                    <svg viewBox="0 0 24 24" class="text-green-600  h-16 mx-auto my-5 w-full">
                        <path fill="currentColor"
                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                        </path>
                    </svg>
                    <div class="text-center">
                        <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
                        <p class="text-gray-600 my-2">Thank you for completing secure online payment.</p>
                        <p> Have a great day!  </p>
                        <div class="py-10 text-center">
                            <Link to={'/'} class="px-12 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 transition-all rounded-[4px]">
                                GO BACK
                            </Link>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default PaymentSuccess
