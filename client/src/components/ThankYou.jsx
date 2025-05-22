import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref'); // Get the tx_ref from the URL
  const [status, setStatus] = useState('loading');
  const [donationDetails, setDonationDetails] = useState(null);

  useEffect(() => {
    // Fetch donation details from the backend using tx_ref
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
    return <div className="text-center py-12">Loading donation details...</div>;
  }

  if (status === 'error') {
    return <div className="text-center text-red-500 py-12">Failed to load donation details. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You for Your Donation!</h1>
        <p className="text-gray-700 mb-4">
          Your transaction reference is: <span className="font-mono text-blue-600">{txRef}</span>
        </p>
        {donationDetails && (
          <div className="text-left mt-4">
            <p><strong>Name:</strong> {donationDetails.name}</p>
            <p><strong>Email:</strong> {donationDetails.email}</p>
            <p><strong>Amount:</strong> {donationDetails.amount} ETB</p>
            <p><strong>Status:</strong> {donationDetails.status}</p>
          </div>
        )}
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default ThankYou;