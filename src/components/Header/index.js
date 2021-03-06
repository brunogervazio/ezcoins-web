import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  AccountCircle,
  MoreVert as MoreIcon,
  Notifications as NotificationsIcon,
} from '@material-ui/icons';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useHistory, useLocation } from 'react-router-dom';

import Chip from '@material-ui/core/Chip';
import useStyles from './useStyles';

const USER = gql`
  query($id: ID) {
    user(id: $id) {
      id
      name
      email
      avatar
      wallet {
        id
        toOffer
        received
        balance
      }
    }
  }
`;

const Header = memo(() => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  const menuId = useMemo(() => 'primary-search-account-menu', []);
  const mobileMenuId = useMemo(() => 'primary-search-account-menu-mobile', []);

  const isMenuOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const isMobileMenuOpen = useMemo(() => Boolean(mobileAnchorEl), [mobileAnchorEl]);

  const openProfileMenu = useCallback(({ currentTarget }) => {
    setAnchorEl(currentTarget);
  }, []);

  const openMobileMenu = useCallback(({ currentTarget }) => {
    setMobileAnchorEl(currentTarget);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileAnchorEl(null);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
    closeMobileMenu();
  }, [closeMobileMenu]);

  const history = useHistory();

  const { pathname } = useLocation();

  const isActive = useCallback(value => (pathname === value ? classes.imageMarked : ''), [
    classes.imageMarked,
    pathname,
  ]);

  const {
    client,
    data: {
      user: {
        avatar,
        wallet: { toOffer },
      },
    },
  } = useQuery(USER, {
    variables: { id: localStorage.getItem('userId') },
    fetchPolicy: 'cache-only',
  });

  const logout = useCallback(async () => {
    closeMenu();
    await client.clearStore();
    localStorage.clear();
    history.push('/login');
  }, [client, closeMenu, history]);

  const handleNavigation = useCallback(
    ({
      target: {
        id,
        parentElement: { id: parentId },
      },
    }) => history.push(id || parentId),
    [history],
  );

  const renderDeleteIcon = useMemo(
    () => (
      <div className={classes.profile}>
        <Badge badgeContent={0} overlap="circle" color="secondary">
          <Avatar src={avatar}>A</Avatar>
        </Badge>
      </div>
    ),
    [avatar, classes.profile],
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            ez.coins
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button id="history" color="inherit" onClick={handleNavigation}>
              Histórico
              <span className={isActive('/history')} />
            </Button>
            <Button id="donate" color="inherit" onClick={handleNavigation}>
              Doar
              <span className={isActive('/donate')} />
            </Button>
            <Chip
              className={classes.profileContainer}
              label={`EZȻ ${toOffer}`}
              onDelete={openProfileMenu}
              deleteIcon={renderDeleteIcon}
            />
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={openMobileMenu}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>Minha conta</MenuItem>
        <MenuItem onClick={logout}>Sair</MenuItem>
      </Menu>
      <Menu
        anchorEl={mobileAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={closeMobileMenu}
      >
        <MenuItem>
          <IconButton aria-label="show 11 new notifications" color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={openProfileMenu}>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    </div>
  );
});

export default Header;
