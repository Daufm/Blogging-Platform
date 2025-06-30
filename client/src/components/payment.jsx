import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import telebirrLogo from '../assets/Telebirr.jpeg';


// const params = useParams();
// console.log("Params:", params);


const SupportAuthor = (  ) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('telebirr');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
   const { authorId } = useParams();



  


 

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || 'Guest';
 

  const presetAmounts = [50, 100, 200, 500, 1000];

  const paymentMethods = [
    {
      id: 'chapa',
      name: 'Chapa',
      logo: telebirrLogo,
      description: 'Send via chapa mobile money'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      logo: '/bank-logo.png',
      description: 'Direct bank transfer (CBE, Awash, etc.)'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();



    //console.log('Submitting donation:', { amount, email, selectedMethod, message , authorId, username });
    // Send data to your backend endpoint
    try {
        if (authorId === undefined || authorId === null) {
          alert('Author ID is missing. Please try again later.');
          return;
        }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:username,
          amount,
          // email,
          method: selectedMethod,
          message,
          authorId: authorId,
        })
      });

      const result = await response.json();
     
      console.log('Chapa payment result:', result);


      // Redirect to the Chapa checkout URL
      if(result.checkout_url){
        window.open(result.checkout_url, '_blank');
      }
      else{
        alert('Failed to initiate payment. Please try again later.');
        console.error('Payment initiation error:', result);
      }
    
    } catch (error) {
      alert('Failed to send donation. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center relative overflow-hidden">
      {/* Modern floating background shapes */}
      <div className="fixed -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-200 dark:bg-indigo-800 opacity-30 blur-[100px] animate-float1"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-200 dark:bg-blue-800 opacity-30 blur-[100px] animate-float2"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-200 dark:bg-purple-800 opacity-30 blur-[100px] animate-blob"></div>
      </div>
      <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden p-8 border border-gray-100 dark:border-gray-800 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support me</h1>
          <p className="text-gray-600 dark:text-gray-300">Your support helps us keep creating great content! Choose an amount and payment method to proceed.</p>
          <p className="text-gray-600 dark:text-gray-200 text-xs mt-2 bg-red-500 rounded-md p-2 text-white ">Because we are using Testing mode, you will not be charged for the donation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div> */}

          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Choose an amount to support (birr)</label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2 px-2 border rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 shadow-sm
                    ${amount == amt && !customAmount
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                >
                  {amt} birr
                </button>
              ))}
            </div>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAmount(e.target.value);
              }}
              placeholder="Other amount"
              className="block w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            />
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Payment Method</label>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-start p-3 border rounded-md cursor-pointer transition-all duration-200 shadow-sm
                    ${selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                >
                  <img src={method.logo} alt={method.name} className="h-8 mr-3 mt-1 rounded" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{method.name}</span>
                      {selectedMethod === method.id && (
                        <svg className="ml-auto h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Leave a message (optional)</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 block w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md p-2"
              placeholder="Write support message..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Donate Now
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All donations are securely processed.</p>
          <p className="mt-1">Your support is greatly appreciated!</p>
        </div>
      </div>
    </div>
  );
};

export default SupportAuthor;
