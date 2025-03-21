import React, { ReactElement } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

type CardProps = {
  title: string;
  description: string;
  to: string;
};

const Card: React.FC<CardProps> = ({ title, description, to }) => (
  <Link className={styles.cardContainer} to={to}>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={clsx(styles.cardDescription, styles.textTruncate)}>{description}</p>
    </div>
  </Link>
);

export default function Home(): ReactElement {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Classics from the bug hole"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>Explore</h2>
        <div className={styles.cardGrid}>
          <Card
            title="🍽️ Recipes"
            description="Explore delicious recipes from the bug hole classics."
            to="/recipes"
          />
          <Card
            title="🍸 Cocktails"
            description="Discover cocktail recipes and mixology magic."
            to="/cocktails"
          />
        </div>
      </main>
    </Layout>
  );
}
