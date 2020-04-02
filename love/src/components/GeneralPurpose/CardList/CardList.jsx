import React from 'react';
import styles from './CardList.module.css';

export const CardList = ({ className, children }) => {
  return <div className={[styles.cardList, className].join(' ')}>{children}</div>;
};

export const Card = ({ className, children }) => {
  return <div className={[styles.card, className].join(' ')}>{children}</div>;
};

export const Title = ({ className, children }) => {
  return <div className={[styles.title, className].join(' ')}>{children}</div>;
};

export const SubTitle = ({ className, children }) => {
  return <div className={[styles.subTitle, className].join(' ')}>{children}</div>;
};

export default CardList;
