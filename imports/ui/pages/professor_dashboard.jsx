

import React from 'react'
import { LogoutButton } from '../Buttons'
import ProfileCard from '../ProfileCard'
 
export const ProfessorDashboard = function() {

  return (<div className="container">
    <h1>Qlicker Professor Dasboard Page</h1>
    <ProfileCard />
    <br/>
    <LogoutButton redirect='login'/>
  </div>)

}
