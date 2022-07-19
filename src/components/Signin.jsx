import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserAuth} from '../context/AuthContext'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '../firebase'

const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, loading, auth_error] = useAuthState(auth);
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signIn } = UserAuth();

  useEffect(() => {
    if(loading){
      return;
    }
    if(user){
      navigate("/home");
    }
  }, [user,loading])

  const handleSubmit = async (e) => {
    console.log('click');
    e.preventDefault();
    setError('')
    try{
      await signIn(email, password)
      navigate('/home')
    }catch(e){
      setError(e.message)
      console.log(e.message)
      alert(e);
    }
  };

  return (
    <div className='max-w-[700px] p-8 pt-2'>
            <div>
                <h1 className='text-2xl font-bold'>
                  Sign in to your Account
                </h1>
                <p className='py-2'>
                    Don't have an Account yet? 
                      <Link to='/signup' className='p-3 underline'>
                        Sign up!
                      </Link>
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col py-2'>
                    <label className='py-2 font-medium'>
                      Email Address
                    </label>
                    <input onChange={(e) => setEmail(e.target.value)} className='border p-3' type="email" />
                </div>
                <div className='flex flex-col py-2'>
                    <label className='py-2 font-medium'>
                      Password
                    </label>
                    <input onChange={(e) => setPassword(e.target.value)} className='border p-3'type="password" />
                </div>
                <button className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white'>
                  Sign In
                </button>
            </form>
        </div>
  )
}

export default Signin