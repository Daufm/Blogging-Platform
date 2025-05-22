/** @type {import('tailwindcss').Config} */
export default {
  
   darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
 
  plugins: [],
  // tailwind.config.js
  theme: {
    extend: {
      animation: {
        'float1': 'float 6s ease-in-out infinite',
        'float2': 'float 8s ease-in-out infinite',
        'float3': 'float 10s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    }
  }

};