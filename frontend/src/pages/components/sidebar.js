
//import useState hook to create menu collapse state
import React, { Component, useState } from "react";

//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

//import icons from react icons
import { FaHome,FaDatabase,FaUserNurse,FaWheelchair, FaClock,FaBookMedical ,FaRegMoneyBillAlt } from "react-icons/fa";
import { FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { NavLink as Link } from 'react-router-dom';
import {connect} from 'react-redux'
import {
  logOut
} from './../../store/Actions/BasicAction';

//import sidebar css from react-pro-sidebar module and our custom css 
import "react-pro-sidebar/dist/css/styles.css";
import styled from 'styled-components';

export const NavLink = styled(Link)`
color: #ffffff;
font-family:Roboto,Helvetica Neue,sans-serif;
font-size: 16px;
display: flex;
align-items: center;
text-decoration: none;
padding: 5px 12px;
height: 100%;
cursor: pointer;
&.active {
	color: white;
	background-color: #32a852;
}
`;

class Sidebar extends Component{
  constructor(props){
    super(props);
    this.state ={
      menuCollapse:true,
    };
  }
  menuIconClick = () => {
    this.setState({
      menuCollapse:!this.state.menuCollapse
    });
  };
  menuLinkClick = () => {
    this.setState({
      menuCollapse:true
    });
  };

  render(){
      return (
        <>
          <div id="sidebar">
            <div className="closemenu" onClick={this.menuIconClick}>
                {this.state.menuCollapse ? (
                <FiArrowRightCircle/>
                ) : (
                <FiArrowLeftCircle/>
                )}
            </div>
            <ProSidebar collapsed={this.state.menuCollapse}>
              <SidebarHeader>
              <div className="logotext mt-5">
                    
                </div>
              </SidebarHeader>
              <SidebarContent>
                <Menu iconShape="square">
                  <MenuItem icon={<FaHome className="text-success" />}><NavLink to='' onClick={this.menuLinkClick}>DashBoard</NavLink></MenuItem>
                  <MenuItem icon={<FaDatabase className="text-success" />}><NavLink to='basic' onClick={this.menuLinkClick}>Registration</NavLink></MenuItem>
                  <MenuItem icon={<FaUserNurse className="text-success" />}><NavLink to='working' onClick={this.menuLinkClick}>Working Days</NavLink></MenuItem>
                  <MenuItem icon={<FaWheelchair className="text-success" />}><NavLink to='leave' onClick={this.menuLinkClick}>Leave Days</NavLink></MenuItem>
                  <MenuItem icon={<FaClock className="text-success"  />}><NavLink to='roaster' onClick={this.menuLinkClick}>Roaster</NavLink></MenuItem>
                  {/* <MenuItem icon={<FaClock className="text-success"  />}><NavLink to='fte' onClick={this.menuLinkClick}>FTE</NavLink></MenuItem> */}
                  <MenuItem icon={<FaBookMedical className="text-success" />}><NavLink to='dtr' onClick={this.menuLinkClick}>DTR</NavLink></MenuItem>
                  <MenuItem icon={<FaRegMoneyBillAlt className="text-success" />}><NavLink to='payroll' onClick={this.menuLinkClick}>PayRoll</NavLink></MenuItem>
                </Menu>
              </SidebarContent>
              <SidebarFooter>
                <Menu iconShape="square">
                  <MenuItem icon={<FiLogOut />} onClick = {() =>this.props.logOut()}>Logout</MenuItem>
                </Menu>
              </SidebarFooter>
            </ProSidebar>
          </div>
        </>
      );
  }
};

const mapDispatchToProps = (dispatch) => ({
  logOut:() =>dispatch(logOut())
});

export default connect(null,mapDispatchToProps)(Sidebar)
