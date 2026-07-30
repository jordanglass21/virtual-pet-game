import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import ShopCategoryTabs from './ShopCategoryTabs.jsx';
import ShopItemGrid from './ShopItemGrid.jsx';

export default function ShopModal({ onClose }) {
  const [category, setCategory] = useState('clothes');

  return (
    <Modal title="Shop" onClose={onClose}>
      <ShopCategoryTabs active={category} onChange={setCategory} />
      <ShopItemGrid category={category} />
    </Modal>
  );
}
