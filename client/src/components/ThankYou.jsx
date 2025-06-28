import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const [status, setStatus] = useState('loading');
  const [donationDetails, setDonationDetails] = useState(null);
  const receiptRef = useRef();

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/donations/${txRef}`);
        const data = await response.json();
        setDonationDetails(data);
        setStatus('success');
      } catch (error) {
        console.error('Error fetching donation details:', error);
        setStatus('error');
      }
    };

    if (txRef) {
      fetchDonationDetails();
    }
  }, [txRef]);

  // Print only the receipt section
  const handlePrint = () => {
    if (!receiptRef.current) return;
    const printContents = receiptRef.current.innerHTML;
    const win = window.open('', '', 'width=600,height=800');
    win.document.write(`
      <html>
        <head>
          <title>Donation Receipt</title>
          <style>
            body { font-family: sans-serif; background: #fff; color: #222; margin: 0; padding: 2rem; }
            .receipt-card { max-width: 400px; margin: 0 auto; border-radius: 1rem; box-shadow: 0 2px 16px #0001; padding: 2rem; border: 1px solid #eee; }
            .receipt-title { color: #16a34a; font-size: 2rem; font-weight: bold; margin-bottom: 1rem; }
            .receipt-label { font-weight: bold; }
            .receipt-value { font-family: monospace; color: #2563eb; }
            .receipt-status { color: #16a34a; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            ${printContents}
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-200 text-xl font-medium">
        Loading donation details...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-900 text-center px-6">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-600 dark:text-gray-300">We couldn't load your donation details. Please try again later.</p>
        <a href="/" className="mt-6 text-blue-600 dark:text-blue-400 underline">Go back home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transition-all duration-300 border border-gray-100 dark:border-gray-800">
        <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-4 animate-pulse" />
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">Thank You!</h1>
        <p className="text-gray-700 dark:text-gray-200 mb-4">We appreciate your support.</p>
        {/* Receipt Section */}
        <div ref={receiptRef} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-left text-sm shadow-inner mb-4 print:bg-white print:text-black print:shadow-none print:p-0">
          <p><span className="font-semibold">Transaction Ref:</span> <span className="font-mono text-blue-700 dark:text-blue-300">{txRef}</span></p>
          <p><span className="font-semibold">Name:</span> {donationDetails.name}</p>
          <p><span className="font-semibold">Email:</span> {donationDetails.email}</p>
          <p><span className="font-semibold">Amount:</span> {donationDetails.amount} ETB</p>
          <p><span className="font-semibold">Status:</span> <span className="capitalize text-green-600 dark:text-green-400 font-bold">{donationDetails.status}</span></p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all shadow-md"
          >
            Back to Home
          </a>
          <button
            onClick={handlePrint}
            className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-6 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md border border-gray-300 dark:border-gray-600"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
