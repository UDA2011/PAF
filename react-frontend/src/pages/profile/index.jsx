import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer/index';
import Breadcrumb from '../../components/Breadcrumb';
import ScrollToTop from '../../components/ScrollTop';


import Logo from '../../assets/images/logos/logo2.png';
import ProfileMain from './ProfileMain';

const Profile = () => {
    return (
        <body className="profile-page">
            <Header
                parentMenu='account'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="My Profile"
                    />

                    <ProfileMain />
                    

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </body>
    );
}


export default Profile;

