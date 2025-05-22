<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        :root {
            --primary: #4f46e5;
            --primary-light: #6366f1;
            --primary-dark: #4338ca;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-400: #9ca3af;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
            --gray-900: #111827;
            --white: #ffffff;
            --red-500: #ef4444;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--gray-100);
            color: var(--gray-800);
            line-height: 1.5;
        }

        .container {
            display: flex;
            min-height: 100vh;
        }

        .left-column {
            flex: 1;
            display: none;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: var(--white);
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }

        .right-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
        }

        .signin-form {
            width: 100%;
            max-width: 400px;
            background: var(--white);
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logo-icon {
            color: var(--primary);
        }

        h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: var(--gray-900);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: var(--gray-700);
        }

        .input-field {
            position: relative;
        }

        input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border: 1px solid var(--gray-300);
            border-radius: 8px;
            font-size: 0.875rem;
            transition: all 0.2s;
        }

        input:focus {
            outline: none;
            border-color: var(--primary-light);
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-400);
            font-size: 1.1rem;
        }

        .forgot-password {
            display: block;
            text-align: right;
            font-size: 0.75rem;
            color: var(--primary);
            text-decoration: none;
            margin-top: 0.5rem;
        }

        .forgot-password:hover {
            text-decoration: underline;
        }

        .btn {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background-color: var(--primary);
            color: var(--white);
        }

        .btn-primary:hover {
            background-color: var(--primary-dark);
        }

        .btn-google {
            background-color: var(--white);
            color: var(--gray-700);
            border: 1px solid var(--gray-300);
        }

        .btn-google:hover {
            background-color: var(--gray-100);
        }

        .google-icon {
            width: 18px;
            height: 18px;
        }

        .divider {
            display: flex;
            align-items: center;
            margin: 1.5rem 0;
            color: var(--gray-400);
            font-size: 0.75rem;
        }

        .divider::before, .divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid var(--gray-200);
        }

        .divider::before {
            margin-right: 1rem;
        }

        .divider::after {
            margin-left: 1rem;
        }

        .signup-link {
            text-align: center;
            font-size: 0.875rem;
            margin-top: 1.5rem;
            color: var(--gray-600);
        }

        .signup-link a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
        }

        .signup-link a:hover {
            text-decoration: underline;
        }

        .error-message {
            color: var(--red-500);
            font-size: 0.75rem;
            margin-top: 0.25rem;
            display: none;
        }

        .input-error {
            border-color: var(--red-500);
        }

        .input-error:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .illustration {
            max-width: 100%;
            height: auto;
            margin-bottom: 2rem;
        }

        .left-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .left-content h2 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .left-content p {
            opacity: 0.9;
            margin-bottom: 2rem;
        }

        .decoration {
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            z-index: 1;
        }

        .decoration-1 {
            top: -250px;
            right: -250px;
        }

        .decoration-2 {
            bottom: -300px;
            left: -200px;
            width: 600px;
            height: 600px;
        }

        @media (min-width: 768px) {
            .left-column {
                display: block;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-column">
            <div class="decoration decoration-1"></div>
            <div class="decoration decoration-2"></div>
            <div class="left-content">
                <h2>Welcome back!</h2>
                <p>Sign in to access your personalized dashboard, manage your account, and more.</p>
                <svg class="illustration" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#ffffff" d="M100,200 Q250,100 400,200 T100,200" opacity="0.2"/>
                    <circle cx="250" cy="200" r="150" fill="#ffffff" opacity="0.1"/>
                    <path fill="none" stroke="#ffffff" stroke-width="8" d="M100,250 C150,150 350,150 400,250" opacity="0.8"/>
                    <circle cx="175" cy="150" r="30" fill="#ffffff" opacity="0.8"/>
                    <circle cx="325" cy="150" r="30" fill="#ffffff" opacity="0.8"/>
                    <path fill="#ffffff" d="M175,180 Q250,220 325,180" opacity="0.8"/>
                </svg>
            </div>
        </div>
        <div class="right-column">
            <div class="signin-form">
                <div class="logo">
                    <span class="material-icons logo-icon">rocket</span>
                    <span>Acme Inc</span>
                </div>
                <h1>Sign in to your account</h1>
                
                <form id="signinForm">
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <div class="input-field">
                            <span class="material-icons input-icon">mail</span>
                            <input type="email" id="email" name="email" placeholder="you@example.com" required>
                        </div>
                        <div class="error-message" id="email-error">Please enter a valid email address</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="input-field">
                            <span class="material-icons input-icon">lock</span>
                            <input type="password" id="password" name="password" placeholder="••••••••" required minlength="8">
                        </div>
                        <div class="error-message" id="password-error">Password must be at least 8 characters</div>
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        Sign in
                    </button>
                    
                    <div class="divider">or continue with</div>
                    
                    <button type="button" class="btn btn-google">
                        <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign in with Google
                    </button>
                    
                    <p class="signup-link">
                        Don't have an account? <a href="#">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('signinForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error states
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
            document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));
            
            let isValid = true;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Email validation
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('email-error').style.display = 'block';
                document.getElementById('email').classList.add('input-error');
                isValid = false;
            }
            
            // Password validation
            if (!password || password.length < 8) {
                document.getElementById('password-error').style.display = 'block';
                document.getElementById('password').classList.add('input-error');
                isValid = false;
            }
            
            if (isValid) {
                // Form is valid, proceed with submission
                alert('Sign in successful! (This is a demo)');
                // In a real app, you would submit to your backend here
            }
        });
        
        // Google sign-in button functionality
        document.querySelector('.btn-google').addEventListener('click', function() {
            alert('Redirecting to Google sign-in (This is a demo)');
            // In a real app, this would initiate Google OAuth flow
        });
    </script>
</body>
</html>