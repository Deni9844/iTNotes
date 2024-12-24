import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'


const SubscriptionPlan = () => {
    const alert = useAlert()
    const navigate = useNavigate()

    const { isAuthenticated } = useSelector((state) => state.user)

    const handleClick = (mnth) => {
        if (!isAuthenticated) {
            alert.info("You must login to purchse the subscription plan!!!")
        } else {
            navigate(`/checkout?mnth=${mnth}`)
        }
    }
    return (
        <div className='bg-gray-100'>
            <section className="py-20 bg-gray-100 text-gray-800 outer-home">
                <div className="container px-4 mx-auto ">
                    <div className="max-w-2xl mx-auto mb-16 text-center pt-16">
                        <span className="font-bold tracking-wider uppercase text-violet-600">Pricing</span>
                        <h2 className="text-4xl font-bold lg:text-[2.5rem] tracking-wider my-4">Get started with iTNotes</h2>
                        <p className='text-base'>Get access to all question and solutions, practical and viva questions.</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-stretch -mx-4 pb-16">
                        <div className="flex w-full mb-8 sm:px-4 md:w-[40%] lg:w-[30%] lg:mb-0">
                            <div className="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 bg-gray-50">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold">Yearly</h4>
                                    <span className="text-4xl font-bold">Rs 500
                                        <span className="text-sm tracking-wide">/year</span>
                                    </span>
                                </div>
                                <p className="leading-relaxed text-gray-600">Allow access to all the resources for 1 year</p>
                                <ul className="flex-1 mb-6 text-gray-600">
                                    <li className="flex mb-2 space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Question's Answer</span>
                                    </li>
                                    <li className="flex mb-2 space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Practicals</span>
                                    </li>
                                    <li className="flex mb-2 space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Viva Question</span>
                                    </li>
                                </ul>
                                <button onClick={() => handleClick(12)} className="inline-block px-5 py-3 font-semibold tracking-wider text-center rounded bg-violet-600 text-gray-50">Get Started</button>
                            </div>
                        </div>
                        <div className="flex w-full mb-8 sm:px-4 md:w-[40%] lg:w-[30%]  lg:mb-0">
                            <div className="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 bg-violet-600 text-gray-50">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold">Quarterly</h4>
                                    <span className="text-4xl font-bold">Rs 300
                                        <span className="text-sm tracking-wide">/6 months</span>
                                    </span>
                                </div>
                                <p className="leading-relaxed">Allow access to all the resources for 6 months</p>
                                <ul className="flex-1 space-y-2">
                                    <li className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Question's Answer</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Practicals</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Viva Question</span>
                                    </li>
                                </ul>
                                <button onClick={() => handleClick(6)}  className="inline-block  px-5 py-3 font-bold tracking-wider text-center rounded bg-gray-100 text-violet-600">Get Started</button>
                            </div>
                        </div>
                        <div className="flex w-full mb-8 sm:px-4 md:w-[40%] lg:w-[30%] lg:mb-0">
                            <div className="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 bg-gray-50">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold">Monthly</h4>
                                    <span className="text-4xl font-bold">Rs 200
                                        <span className="text-sm tracking-wide">/month</span>
                                    </span>
                                </div>
                                <p className="leading-relaxed text-gray-600">Allow access to all the resources for 1 month</p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Question's Answer</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Practicals</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>Access to All Viva Question</span>
                                    </li>
                                </ul>
                                <button onClick={() => handleClick(1)}   className="inline-block px-5 py-3 font-semibold tracking-wider text-center rounded bg-violet-600 text-gray-50">Get Started</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SubscriptionPlan
