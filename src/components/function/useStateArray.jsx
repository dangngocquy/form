import React, { useState } from 'react';

function useStateArray() {
  // useState App.js
  const storedUsername = localStorage.getItem('username');
  const storedName = localStorage.getItem('name');
  const storedid = localStorage.getItem('keys');
  const storedbophan = localStorage.getItem('bophan');
  const storedAvatar = localStorage.getItem('imgAvatar');
  
  const [password, setPassword] = useState('');
  const [name, setName] = useState(storedName || '');
  const [keys, setID] = useState(storedid || '');
  const [imgAvatar, setAvatar] = useState(storedAvatar || ''); 
  const [isLoggedIn, setLoggedIn] = useState(!!storedUsername);
  const [bophan, setBophan] = useState(storedbophan || '');
  const [username, setUsername] = useState(storedUsername || '');
  const [error, setError] = React.useState('');
  const [prevUsername, setPrevUsername] = useState('');
  const [phanquyen, setPhanquyen] = useState(() => {
    return localStorage.getItem('phanquyen') === 'true';
  });
  const [logoutTimer, setLogoutTimer] = useState(null);
  //Home.jsx
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchBophan, setSearchBophan] = useState('');
  const [visibleCount, setVisibleCount] = useState(2);
  const [show, setShow] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); 
  const [searchMyDocs, setSearchMyDocs] = useState('');
  const [visibleItems, setVisibleItems] = useState(2);

  //dashboard/Create.jsx
  const [title, setTitle] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  //Account.jsx
  const [formData, setFormData] = useState({
    name: '',
    bophan: '',
    username: '',
    password: '',
    phanquyen: false,
  });
  const [shouldRenderCreateRoute, setShouldRenderCreateRoute] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [formStatus, setFormStatus] = useState('add');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [initialFormData, setInitialFormData] = useState({
    name: '',
    username: '',
    password: '',
    bophan: '',
    phanquyen: '',
  });

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  //Department.jsx
  const [tableAData, setTableAData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editedBophan, setEditedBophan] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  //ListDocs.jsx
  const [docsUser, setDocsUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeBophan, setActiveBophan] = useState('');
  const [activeTitle, setActiveTitle] = useState('');
  const [activeChinhanh, setActiveChinhanh] = useState('');
  const [activeName, setActiveName] = useState('');
  const [contentData, setContentData] = useState([])
  //Create.jsx
  const [bophanAD, setBophanAD] = useState('');
  //ListEdits
  const [copySuccess, setCopySuccess] = useState(null);
  const [deletingDocId, setDeletingDocId] = useState(null);
  const [docs, setDocs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  //ChangePasswords
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shows, setShows] = useState('');
  //ViewDocs.jsx
  const [content, setContent] = useState({});
  //Docs.jsx
  const [tableADatas, setTableADatas] = useState([]);
  //Chức năng tìm kiếm
  const [filteredUsers, setFilteredUsers] = useState([]);
  //Notification.jsx
  const [showNotification, setShowNotification] = useState(true);
  return {
    bophan, setBophan, username, setUsername, phanquyen, setPhanquyen, password, setPassword, name, setName, keys, setID, isLoggedIn, setLoggedIn, error, setError, data, setData, datas, setDatas, searchTitle, setSearchTitle, searchBophan, setSearchBophan, visibleCount, setVisibleCount, show, setShow,
    title, setTitle, contentTitle, setContentTitle, admins, setAdmins, selectedAdminId, setSelectedAdminId, formStatus, setFormStatus, errorMessage, setErrorMessage, successMessage, setSuccessMessage,
    initialFormData, setInitialFormData, users, setUsers, departments, setDepartments, formData, setFormData, tableAData, setTableAData, isButtonDisabled, setIsButtonDisabled,
    editId, setEditId, editedBophan, setEditedBophan, searchQuery, setSearchQuery, currentPage, setCurrentPage, docsUser, setDocsUser, searchTerm, setSearchTerm, startDate,
    setStartDate, endDate, setEndDate, activeBophan, setActiveBophan, activeTitle, activeName, setActiveTitle, setActiveName, bophanAD, setBophanAD, searchInput, setSearchInput, docs, setDocs,
    deletingDocId, setDeletingDocId, copySuccess, setCopySuccess, oldPassword, setOldPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, showOldPassword, setShowOldPassword,
    showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword, shows, setShows, prevUsername, setPrevUsername, shouldRenderCreateRoute, setShouldRenderCreateRoute,
    content, setContent, totalPages, setTotalPages, filteredUsers, setFilteredUsers, searchMyDocs, setSearchMyDocs, visibleItems, setVisibleItems, loadingMore, setLoadingMore,
    contentData, setContentData, imgAvatar, setAvatar, tableADatas, setTableADatas, activeChinhanh, setActiveChinhanh, logoutTimer, setLogoutTimer, showNotification, setShowNotification
  }
}

export default useStateArray;