import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userImg from '../../assets/images/author/11.jpg';
import { userService } from '../../services/userService';
import { notificationService } from '../../services/notificationService';

const MenuItems = (props) => {
  const { parentMenu } = props;
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();
  const postURL = location.pathname.split('/');
  const pathLength = Number(postURL.length);

  // Mobile menu state
  const [home, setHome] = useState(false);
  const [page, setPage] = useState(false);
  const [event, setEvent] = useState(false);
  const [learnShare, setLearnShare] = useState(false);
  const [my, setMy] = useState(false);
  const [account, setAccount] = useState(false);
  const [blog, setBlog] = useState(false);

  // State for user details
  const [userDetails, setUserDetails] = useState(null);
  
  // State for notifications
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileImg = userDetails?.profileImageUrl || userImg;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await userService.getMe();
        setUserDetails(userData);
      } catch {
      }
    };

    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const me = await userService.getMe();
      const userId = me.id;
      const response = await notificationService.getByUserId(userId);

      if (response) {
        setNotifications(response);
        setUnreadCount(response.filter(n => !n.notificationRead).length);
      }
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const openMobileMenu = (menu) => {
    if (menu === 'home') {
      setHome(!home);
      setPage(false);
      setEvent(false);
      setLearnShare(false);
      setAccount(false);
      setBlog(false);
    } else if (menu === 'page') {
      setHome(false);
      setPage(!page);
      setEvent(false);
      setAccount(false);
      setLearnShare(false);
      setBlog(false);
    } else if (menu === 'event') {
      setHome(false);
      setPage(false);
      setEvent(!event);
      setAccount(false);
      setLearnShare(false);
      setBlog(false);
    } else if (menu === 'learnShare') {
      setHome(false);
      setPage(false);
      setEvent(false);
      setAccount(false);
      setLearnShare(!learnShare);
      setBlog(false);
    } else if (menu === 'my') {
      setHome(false);
      setPage(false);
      setEvent(false);
      setAccount(false);
      setLearnShare(false);
      setMy(!my);
    } else if (menu === 'account') {
      setHome(false);
      setPage(false);
      setEvent(false);
      setAccount(!account);
      setLearnShare(false);
      setMy(false);
    } else if (menu === 'blog') {
      setHome(false);
      setPage(false);
      setEvent(false);
      setLearnShare(false);
      setBlog(!blog);
    }
  };

  return (
    <>
      <li className={location.pathname === '/' ? 'menu-active' : ''}>
        <Link to="/">Home</Link>
      </li>

      {!isAuthenticated && (
        <li className={location.pathname === '/about' ? 'menu-active' : ''}>
          <Link to="/about">About</Link>
        </li>
      )}

      {!isAuthenticated && (
        <li className={location.pathname === '/login' ? 'menu-active' : ''}>
          <Link to="/login">Login</Link>
        </li>
      )}

      

      {/* Authenticated Menu */}
      {isAuthenticated && (
        <>
          <li className={parentMenu === 'learnShare' ? 'has-sub menu-active' : 'has-sub'}>
            <Link to="#" className={learnShare ? 'hash menu-active' : 'hash'} onClick={() => openMobileMenu('learnShare')}>
              Learn &amp; Share
              <span className="arrow" />
            </Link>
            <ul className={learnShare ? 'sub-menu sub-menu-open' : 'sub-menu'}>
              <li className={location.pathname === '/skill-feed' ? 'menu-active' : ''}>
                <Link to="/skill-feed">Skill Posts</Link>
              </li>
              <li className={location.pathname === '/milestones' ? 'menu-active' : ''}>
                <Link to="/milestones">Milestones</Link>
              </li>
              <li className={location.pathname === '/plans' ? 'menu-active' : ''}>
                <Link to="/plans">Plans</Link>
              </li>
            </ul>
          </li>


          <li style={{ marginTop: "5px" }} className={location.pathname === '/notifications' ? 'menu-active' : ''}>
            <Link to="/notifications" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '25px',
                  right: '15px',
                  background: '#5B4AEB',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </li>

          <li className={parentMenu === 'account' ? 'has-sub menu-active' : 'has-sub'}>
            <Link to="#" className={account ? 'hash menu-active' : 'hash'} onClick={() => openMobileMenu('account')}>
              <img src={profileImg} alt="Profile" style={{ width: 40, height: 40, marginTop: -8, borderRadius: "50%" }} />
            </Link>
            <ul className={account ? 'sub-menu sub-menu-open' : 'sub-menu'}>
              
              <li className={location.pathname === '/my-skills' ? 'menu-active' : ''}>
                <Link to="/my-skills">My Skill Posts</Link>
              </li>

              <li className={location.pathname === '/my-milestones' ? 'menu-active' : ''}>
                <Link to="/my-milestones">My Milestones</Link>
              </li>

              <li className={location.pathname === '/my-plans' ? 'menu-active' : ''}>
                <Link to="/my-plans">My Plans</Link>
              </li>


              <li className={postURL[1] === 'my-account' && pathLength > 2 ? 'menu-active' : ''}>
                <Link to="/my-account">Profile</Link>
              </li>
              <li onClick={logout}>
                <Link style={{ color: "red", fontWeight: 700 }} to="/">Log out</Link>
              </li>
            </ul>
          </li>
        </>
      )}
    </>
  );
};

export default MenuItems;