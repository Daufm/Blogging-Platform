import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const [status, setStatus] = useState('loading');
  const [donationDetails, setDonationDetails] = useState(null);

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 text-gray-700 text-xl font-medium">
        Loading donation details...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-6">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-600">We couldn't load your donation details. Please try again later.</p>
        <a href="/" className="mt-6 text-blue-600 underline">Go back home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transition-all duration-300">
        <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-4 animate-pulse" />
        <h1 className="text-3xl font-bold text-green-700 mb-2">Thank You!</h1>
        <p className="text-gray-700 mb-4">We appreciate your support.</p>
        <div className="bg-gray-100 rounded-lg p-4 text-left text-sm shadow-inner">
          <p><strong>Transaction Ref:</strong> <span className="font-mono text-blue-700">{txRef}</span></p>
          <p><strong>Name:</strong> {donationDetails.name}</p>
          <p><strong>Email:</strong> {donationDetails.email}</p>
          <p><strong>Amount:</strong> {donationDetails.amount} ETB</p>
          <p><strong>Status:</strong> <span className="capitalize text-green-600">{donationDetails.status}</span></p>
        </div>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all shadow-md"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default ThankYou;
