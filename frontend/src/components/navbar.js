import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getAllDatas} from '../store/Actions/BasicAction';
import axios from '../config/server.config'
import ReactLoading from 'react-loading';
import {
	MDBNavbar,MDBContainer,MDBNavbarBrand,MDBNavbarToggler,MDBIcon,MDBCollapse,showNavColor,MDBNavbarNav,MDBNavbarItem,MDBNavbarLink
} from 'mdb-react-ui-kit';

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

export const NavItem = styled(MDBNavbarItem)`
padding:5px
`;
export const NavBrand = styled(MDBNavbarBrand)`
color:white;
font:inherit;
font-size:20px;
`;

class Navbar extends Component{
	constructor(props){
		super(props);
		this.state ={
			isLoading:true,
		}
	}
	componentDidMount(){
		var _self = this;
		axios.get('basic/list')
		.then(response => {
			_self.setState({
				isLoading:false
			});
			this.props.initialData(response.data);
		})
		.catch(function (error){
			console.log(error);
		})
	}
	render(){
		const {isLoading} = this.state;
		return (
			<MDBNavbar  expand='lg'  fixed='top' bgColor='success'>
				<ReactLoading type={"bubbles"} style={{display:isLoading?"block":"none",position:'fixed',top:'50vh',left:'50vw',width:'100px'}}/>
				<MDBContainer fluid>
					<NavBrand href='/' style={{marginLeft:'25px'}}>
						<img style={{width:'80px',height:'30px'}} src="logo-rated.png" />
					</NavBrand>
					<MDBNavbarToggler
						type='button'
						data-target='#navbarColor02'
						aria-controls='navbarColor02'
						aria-expanded='false'
						aria-label='Toggle navigation'
					>
						<MDBIcon icon='bars' fas />
					</MDBNavbarToggler>
					<MDBCollapse navbar>
						<MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
							<NavItem>
								<NavLink aria-current='page' to='basic'>
								Registration
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink aria-current='page' to='working'>
								Working Days
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink aria-current='page' to='leave'>
								Leave Days
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink aria-current='page' to='roaster'>
								Roaster
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink aria-current='page' to='dtr'>
								DTR
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink aria-current='page' to='payroll'>
								PayRoll
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink aria-current='page' to='revenue'>
								Revenue
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink aria-current='page' to='pnl'>
								PNL
								</NavLink>
							</NavItem>
						</MDBNavbarNav>
					</MDBCollapse>
				</MDBContainer>
			</MDBNavbar>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
    initialData:(data) =>dispatch(getAllDatas(data)),
});

export default connect(null,mapDispatchToProps)(Navbar)