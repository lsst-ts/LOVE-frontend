import React from 'react';
import EditIcon from '../../../icons/EditIcon/EditIcon';
import DeleteIcon from '../../../icons/DeleteIcon/DeleteIcon';
import Button from '../../../GeneralPurpose/Button/Button';
import styles from './ViewLauncher.module.css';

export default function({
  view,
  index,
  imgURL,
  showButtons,
  hideButtons,
  hovered,
  editView,
  changeViewToDelete,
  openView,
}) {
  return (
    <div
      title="Open"
      key={index}
      className={styles.view}
      onClick={() => openView(view.id)}
      onMouseEnter={showButtons}
      onTouchStart={showButtons}
      onTouchMove={showButtons}
      onMouseLeave={hideButtons}
    >
      <div className={styles.preview}>
        <div className={[styles.viewOverlay, hovered ? styles.viewHover : ''].join(' ')}>
          <img
            alt="View preview"
            src={imgURL}
            onLoad={(ev) => {
              ev.target.parentNode.setAttribute('hasThumbnail', true);
              ev.target.style.display = 'block';
            }}
            style={{ display: 'none' }}
          />
        </div>
        <span className={[styles.imageFallback, hovered ? styles.fallbackHover : ''].join(' ')}>
          {view.name.replace(/[a-z\s]/g, '').substring(0, 6)}
        </span>
      </div>
      <div className={styles.name}> {view.name} </div>
      <div className={[styles.buttons, hovered ? styles.visible : null].join(' ')}>
        <Button
          className={styles.iconButton}
          title="Edit"
          onClick={(event) => {
            event.stopPropagation();
            editView(view.id);
          }}
        >
          <EditIcon className={styles.icon} />
        </Button>
        <Button
          className={styles.iconButton}
          title="Delete"
          onClick={(event) => {
            event.stopPropagation();
            changeViewToDelete(view);
          }}
        >
          <DeleteIcon className={styles.icon} />
        </Button>
      </div>
    </div>
  );
}
