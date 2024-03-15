import { useState } from 'react';

function Modal() {
  const [showModal2, setShowModal2] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalbt, setShowModalbt] = useState(false);
  const [showModalid, setShowModalid] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openModal2 = (id) => {
    setShowModal2(id);
  };

  const closeModal2 = () => {
    setShowModal2(null);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openModalbt = () => {
    setShowModalbt(true);
  };

  const closeModalbt = () => {
    setShowModalbt(false);
  };

  const openModalid = (id) => {
    setShowModalid(id);
  };

  const closeModalid = () => {
    setShowModalid(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return {
    showModal2, openModalbt, closeModalbt, showModalbt,
    openModal2,
    closeModal2,
    openModalid,
    closeModalid,
    showModalid,
    closeMenu,
    toggleMenu,
    isMenuOpen,
    openModal,
    closeModal,
    showModal
  }
}
export default Modal;