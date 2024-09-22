import { useState } from 'react';
import '../../css/resetPassword.css';
import axios from 'axios';
const ForgotPassword=()=>{
    const [email,setEmail]=useState('');
    const [message,setMessage]=useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            const response = await axios.post('http://localhost:3001/api/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error sending password reset email');
        }
    };

    return(
        <div className="reset-password-page">

<div class="card login-form">
	<div class="card-body">
		<h3 class="card-title text-center">Reset password</h3>
		
		<div class="card-text">
        {message && <div className="alert alert-info">{message}</div>}
			<form onSubmit={handleSubmit}>
				<div class="form-group">
					<label for="exampleInputEmail1">Enter your email address and we will send you a link to reset your password.</label>
					<input
                                    type="email"
                                    className="form-control form-control-sm"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
				</div>

				<button type="submit" class="btn btn-primary btn-block">Send password reset email</button>
			</form>
		</div>
	</div>
</div>
        </div>
    )
}

export default ForgotPassword;