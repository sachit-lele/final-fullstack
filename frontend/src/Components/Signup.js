import React, {useState} from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Signup(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleSignup = async (e) =>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/signup", {
                email,
                password
            });
            // To store authentication login token in local storage
            console.log(response.data);
            history.push("/login");

        } catch(error){
            console.error('Login error', error);
        }
    };
    return (
        <form onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      );
}

export default Signup;
