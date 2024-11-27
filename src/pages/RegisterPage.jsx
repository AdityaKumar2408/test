import React, { useState } from 'react'

const RegisterPage = () => {

  const [data, setdata] = useState({
    name:'',
    email:'',
    password:'',
  })
  const registerUser = (e) =>{
    e.preventDefault();
  }
  return (
   
    <div>

      <form onSubmit={registerUser}>
        <label>name</label>
        <input type="text" placeholder="enter name" value={data.name} onChange={(e)=>setdata({...data, name : e.target.value})}/>
        <label>email</label>
        <input type="email" placeholder="enter email" value={data.email} onChange={(e)=>setdata({...data,email:e.target.value})}/>
        <label>password</label>
        <input type="password" placeholder="enter password" value={data.password} onChange={(e)=>setdata({...data,password:e.target.value})}/>
      <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default RegisterPage
