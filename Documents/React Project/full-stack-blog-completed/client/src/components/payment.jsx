import { useState } from 'react';

const SupportAuthor = () => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('telebirr');
  const [customAmount, setCustomAmount] = useState('');

  // Ethiopian Birr amounts
  const presetAmounts = [50, 100, 200, 500, 1000];

  // Ethiopian payment methods
  const paymentMethods = [
    { 
      id: 'telebirr', 
      name: 'Telebirr', 
      logo: '../assets/Telebirr.jpeg',
      description: 'Send via Telebirr mobile money' 
    },
    { 
      id: 'cbe_birr', 
      name: 'CBE Birr', 
      logo: '../assets/CBE-Birr.png',
      description: 'Transfer using CBE Birr account' 
    },
    { 
      id: 'amole', 
      name: 'Amole', 
      logo: '../assets/amole.png',
      description: 'Digital wallet payment' 
    },
    { 
      id: 'hellocash', 
      name: 'HelloCash', 
      logo: '../assets/hellocash.png',
      description: 'Send via HelloCash agent' 
    },
    { 
      id: 'bank', 
      name: 'Bank Transfer', 
      logo: '/bank-logo.png',
      description: 'Direct bank transfer (CBE, Awash, etc.)' 
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your ${amount} ETB support via ${paymentMethods.find(m => m.id === selectedMethod).name}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support me</h1>
          <p className="text-gray-600">
            Your support helps us keep creating great content! Choose an amount and payment method to proceed.

          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose an amount to support(birr)
            </label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2 px-2 border rounded-md text-sm font-medium ${
                    amount === amt && !customAmount
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {amt} birr
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">birr</span>
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(e.target.value);
                }}
                placeholder="other amount"
                className="pl-12 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-start p-3 border rounded-md cursor-pointer ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-8 mr-3 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{method.name}</span>
                      {selectedMethod === method.id && (
                        <svg
                          className="ml-auto h-5 w-5 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Leave a message (optional)
            </label>
            <textarea
              id="message"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full border border-gray-300 rounded-md p-2"
              placeholder="write support message..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              amount ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {amount ?  `Donate ${amount} ETB` : 'Select an amount'}
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